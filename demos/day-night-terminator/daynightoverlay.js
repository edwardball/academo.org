
/**
 * Day/Night Overlay
 * Version 1.3
 *
 * @author kaktus621@gmail.com (Martin Matysiak)
 * @fileoverview This class provides a custom overlay which shows an
 * approximation of where the day/night line runs at any given date.
 */

/**
 * @license Copyright 2011-2012 Martin Matysiak.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * DayNightOverlayOptions
 *
 * {string} fillColor A color string that will be used when drawing
 * the night area.
 * {string} id A unique identifiert which will be assigned to the
 * canvas on which we will draw.
 * {Date} date A specific point of time for which the day/night-
 * overview shall be calculated (UTC date is taken).
 * {google.maps.Map} map A handle to the Google Maps map on which the
 * overlay shall be shown.
 */



/**
 * The Class which represents the Overlay.
 *
 * @constructor
 * @param {DayNightOverlayOptions=} opt_params A set of optional parameters.
 * @extends {google.maps.OverlayView}
 */
var DayNightOverlay = function(opt_params) {

  /**
   * The canvas on which we will draw later on.
   * @type {?element}
   * @private
   */
  this.canvas_ = null;

  /**
   * The color with which the night area shall be filled.
   * @type {!string}
   * @private
   */
  this.fillColor_ = 'rgba(0,0,0,0.5)';

  /**
   * If specified, this ID will be assigned to the Canvas element which will be
   * created later on.
   * @type {?string}
   * @private
   */
  this.id_ = null;

  /**
   * If specified, this fixed date will be drawn instead of the current time.
   * The date should always be specified in UTC! Please not that not only the
   * time, but also the day counts because of the sun's movement between the
   * Solstices.
   * @type {?Date} A date object that should be displayed
   * @private
   */
  this.date_ = null;

  if (typeof opt_params == 'object') {
    // Check which defaults shall be overwritten
    if (typeof opt_params.fillColor != 'undefined') {
      this.fillColor_ = opt_params.fillColor;
    }

    if (typeof opt_params.id != 'undefined') {
      this.id_ = opt_params.id;
    }

    if (typeof opt_params.date != 'undefined') {
      this.date_ = opt_params.date;
    }

    if (typeof opt_params.map != 'undefined') {
      this.setMap(opt_params.map);
    }
  }
};

DayNightOverlay.prototype = new google.maps.OverlayView();


/**
 * A fixed reference to a very northern point on the world. Note: latitudes
 * over 85 degrees result in a strange bug where the calculated pixel
 * coordinates are _way_ outside the map. Therefore I use latitudes of +-85
 * degrees which result in being placed very close to the visible borders
 * of the map. I suppose this behaviour has to do with the mecrator projection.
 *
 * @type {google.maps.LatLng}
 * @private
 * @const
 */
DayNightOverlay.NORTH_ = new google.maps.LatLng(85, 0);


/**
 * A fixed reference to a very southern point on the world. Note: see
 * DayNightOverlay.NORTH_.
 *
 * @type {google.maps.LatLng}
 * @private
 * @const
 */
DayNightOverlay.SOUTH_ = new google.maps.LatLng(-85, 0);


/** @override */
DayNightOverlay.prototype.onAdd = function() {
  this.canvas_ = document.createElement('canvas');
  this.canvas_.style.position = 'absolute';

  if (this.id_) {
    this.canvas_.id = this.id_;
  }

  this.getPanes().overlayLayer.appendChild(this.canvas_);
};


/** @override */
DayNightOverlay.prototype.onRemove = function() {
  this.canvas_.parentNode.removeChild(this.canvas_);
  this.canvas_ = null;
};


/** @override */
DayNightOverlay.prototype.draw = function() {

  // Adjust the canvas to the current map's size
  var projection = this.getProjection();
  var worldDim = this.getWorldDimensions_(projection);
  var visibleDim = this.getVisibleDimensions_(projection, 250);

  // The viewport dimensions seem to be a bit buggy on small zoom levels.
  // Therefore we adjust the viewport to the world's dimensions, extended by
  // half a world width on the left and right
  if (this.getMap().getZoom() < 3) {
    //visibleDim = worldDim;
    visibleDim.x = worldDim.x - worldDim.width;
    visibleDim.y = worldDim.y;
    visibleDim.width = worldDim.width * 3;
    visibleDim.height = worldDim.height;
  }

  // Resize canvas to current viewport
  this.canvas_.style.left = visibleDim.x + 'px';
  this.canvas_.style.top = visibleDim.y + 'px';
  this.canvas_.style.width = visibleDim.width + 'px';
  this.canvas_.style.height = visibleDim.height + 'px';
  // Important: resize not only CSS dimensions, but also canvas dimensions
  this.canvas_.width = visibleDim.width;
  this.canvas_.height = visibleDim.height;

  // Clear the current canvas
  var ctx = this.canvas_.getContext('2d');
  ctx.clearRect(0, 0, visibleDim.width, visibleDim.height);

  // Redraw the wave which approximately describes where it's currently night
  var terminator = this.createTerminatorFunc_(visibleDim, worldDim);
  var northernSun = this.isNorthernSun_(this.date_ ? this.date_ : new Date());

  ctx.fillStyle = this.fillColor_;
  ctx.beginPath();
  ctx.moveTo(0, northernSun ? visibleDim.height : 0);
  for (var x = 0; x < visibleDim.width; x++) {
    ctx.lineTo(x, terminator(x));
  }
  ctx.lineTo(visibleDim.width, northernSun ? visibleDim.height : 0);
  ctx.fill();
};


/**
 * Setter for date_.
 *
 * @param {?Date} date A specific point of time for which the day/night-
 * overview shall be calculated (UTC date is taken) or null if the current
 * time shall be taken.
 */
DayNightOverlay.prototype.setDate = function(date) {
  this.date_ = date;

  // Redraw the line if we're added to a maps canvas
  if (this.canvas_ !== null) {
    this.draw();
  }
};


/**
 * Returns the coordinates of the world map, based on the current maps view.
 *
 * @private
 * @param {google.maps.MapCanvasProjection} projection The projection object for
 * the current maps view.
 * @return {Object} The dimensions, containing x and y coordinates of the upper
 * left point as well as width and height of the rectangular world map.
 */
DayNightOverlay.prototype.getWorldDimensions_ = function(projection) {
  var north = projection.fromLatLngToDivPixel(DayNightOverlay.NORTH_);
  var south = projection.fromLatLngToDivPixel(DayNightOverlay.SOUTH_);
  var width = projection.getWorldWidth();

  return {
    x: north.x - width / 2,
    y: north.y,
    width: width,
    height: south.y - north.y
  };
};


/**
 * Returns the coordinates of the currently visible viewport plus a specifiable
 * margin around it.
 *
 * @private
 * @param {google.maps.MapCanvasProjection} projection The projection object for
 * the current maps view.
 * @param {number} margin The number of pixels by which the dimensions of the
 * current viewport shall be increased.
 * @return {Object} The dimensions, containing x and y coordinates of the upper
 * left point as well as width and height of the rectangular viewport.
 */
DayNightOverlay.prototype.getVisibleDimensions_ = function(projection, margin) {
  var ne = projection.fromLatLngToDivPixel(
      this.getMap().getBounds().getNorthEast()
      );
  var sw = projection.fromLatLngToDivPixel(
      this.getMap().getBounds().getSouthWest()
      );

  return {
    x: sw.x - margin,
    y: ne.y - margin,
    width: ne.x - sw.x + 2 * margin,
    height: sw.y - ne.y + 2 * margin
  };
};


/**
 * Generates a function which in turn calculates the day/night terminator curve
 * based on the current viewport. The generated function awaits an x-coordinate
 * in the scope of the current viewport (i.e. from 0 to viewport.width) and
 * returns the corresponding y-coordinate of the curve (limited to the bounds
 * of the current viewport).
 *
 * If you don't like mathematics, feel free to skip this code ;-) It's roughly
 * based on http://www.geoastro.de/map/index.html
 *
 * This version uses a lot of variables to make the calculation a bit more
 * understandable. You might want to inline them in a minified version.
 *
 * @private
 * @param {Object} viewport The dimensions of the currently visible viewport.
 * @param {Object} world The dimensions of the world as it's seen in every
 * atlas (i.e. the rectangular area from (90°N,180°W) to (90°S,180°E)).
 * @return {function(number): number} A function which calculates the day/night
 * terminator curve.
 */
DayNightOverlay.prototype.createTerminatorFunc_ = function(viewport, world) {

  var date = this.date_ ? this.date_ : new Date();

  // Precalculate some constants to make the actual terminator function faster

  var TWO_PI = 2 * Math.PI;

  var WORLD_WIDTH = world.width;
  var WORLD_HEIGHT = world.height;
  var HALF_WORLD_HEIGHT = world.height / 2;

  var VISIBLE_WIDTH = viewport.width;
  var VISIBLE_HEIGHT = viewport.height;

  var WORLD_OFFSET_X = viewport.x - world.x;
  var WORLD_OFFSET_Y = viewport.y - world.y;


  // Scaling factors

  // Used for scaling the x-coordinate in the scope of the world with
  // onto the range of [0, 2*PI)
  var X_SCALE = TWO_PI / WORLD_WIDTH;

  // Used for scaling the output of the crazy function below ([-PI/2, PI/2]) to
  // the range of the world's height ([-world.height/2, world.height/2])
  var Y_SCALE = WORLD_HEIGHT / Math.PI;


  // Offset calculation

  // The current (or specified) UTC time in seconds.
  var TIME_SECS = date.getUTCHours() * 3600 +
      date.getUTCMinutes() * 60 +
      date.getUTCSeconds();

  // Since the world's borders are at longitude +-180 degrees but we are
  // are comparing to UTC time (which takes place at longitude 0 degrees),
  // we have to shift the time by exactly 12 hours using NOON_SECS.
  var NOON_SECS = 86400 / 2;

  // We calculate the horizontal offset on the basis of seconds. Therefore we
  // divide the maximum offset (2 * PI) by the amount of seconds in a day.
  var PI_STEP = TWO_PI / 86400;

  // Now let's add everything together... the offset is now in the
  // range of [0, 2*PI)
  var TIME_OFFSET_X = (TIME_SECS + NOON_SECS) * PI_STEP;

  // And now the vertical offset... throughout the year, the sun's position
  // varies between +-23.44 degrees around the equatorial line (it's exactly
  // over the equator on the vernal and autumnal equinox, 23.44° north at the
  // summer solstice and 23.44° south at the winter solstice). Between those
  // dates, the sun moves on a sine wave.

  // The first thing we do is calculating the sun's position by using the
  // vernal equinox as a reference point.
  var DAY_OF_YEAR = this.getDayOfYear_(date);
  var VERNAL_EQUINOX = this.getDayOfYear_(
      new Date(Date.UTC(date.getFullYear(), 2, 20))
      );

  var MAX_DECLINATION = 23.44 * Math.PI / 90;
  var DECLINATION = Math.sin(TWO_PI * (DAY_OF_YEAR - VERNAL_EQUINOX) / 365) *
      MAX_DECLINATION;

  // The returned method first translates the viewport x to world x,
  // calculates the world y and translates it back to the viewport y
  return function(x) {
    // x in range [0, visible_width]

    // World x in the range [0, 2PI) ("longitude")
    var worldX = (x + WORLD_OFFSET_X) * X_SCALE + TIME_OFFSET_X;

    // World y in the range [-PI/2, PI/2] ("latitude")
    // This is the main function for calculating the terminator line!!
    var worldY = Math.atan(-Math.cos(worldX) / Math.tan(DECLINATION));

    // Translate to range [0, world_height]
    worldY = HALF_WORLD_HEIGHT + worldY * Y_SCALE;

    // Crop to visible range
    return Math.min(VISIBLE_HEIGHT, Math.max(0, worldY - WORLD_OFFSET_Y));
  };
};


/**
 * Returns true if sun is currently north of the equatorial line. That's
 * basically always between the vernal and autumnal equinax (i.e. Mar - Sep)
 *
 * @private
 * @param {Date} date The date for which the sun's position shall be determined.
 * @return {boolean} true if the sun is north of the equatorial line, false
 * otherwise.
 */
DayNightOverlay.prototype.isNorthernSun_ = function(date) {
  var vernalEq = new Date(Date.UTC(date.getFullYear(), 2, 19));
  var autumnalEq = new Date(Date.UTC(date.getFullYear(), 8, 18));
  // var autumnalEq = new Date(Date.UTC(date.getFullYear(), 8, 23));

  return (date.getTime() > vernalEq.getTime()) &&
      (date.getTime() <= autumnalEq.getTime());
};


/**
 * Calculates the day of year based on the given date. Method: the timestamp
 * of the given date is substracted by the timestamp of the first day of the
 * respective year. The resulting time difference is then divided by the number
 * of milliseconds per day, which results in the day of the year.
 *
 * @private
 * @param {Date} date A date for which the day of year shall be calculated.
 * @return {number} The date's day of year.
 */
DayNightOverlay.prototype.getDayOfYear_ = function(date) {
  // Yes, the month has to be zero thanks to JavaScript's great Date class.....
  var firstDay = new Date(Date.UTC(date.getFullYear(), 0, 1));

  return Math.ceil((date.getTime() - firstDay.getTime()) / 86400000);
};
