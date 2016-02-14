// var ui = null;
var map_container = document.getElementById('demo');
var ui = null;
// map_container.style.width =  0.75 * map_container.offsetWidth + "px";

if ($('body').data('full')){
	map_container.style.height = $(window).height() + "px";
} else {
	map_container.style.height =  1 * map_container.offsetWidth + "px";
}

// $(window).resize(function(){
//   console.log("resize")
//   map_container.style.height =  map_container.offsetWidth + "px";
// })

	/*
	 * = Config
	 * ----------------
	 */

		var repeatOnXAxis = false; // Do we need to repeat the image on the X-axis? Most likely you'll want to set this to false
		var blankTilePath = 'https://s3-us-west-2.amazonaws.com/academo-assets/images/hudf/empty.jpg'; // Path to a blank tile when repeat is set to false
		// var blankTilePath = 'tilecutter/empty.jpg'; // Path to a blank tile when repeat is set to false
		// Maximum zoom level. Set this to the first number of the last tile generated (eg. 5_31_31 -> 5)
		var maxZoom = 5;


		var settings = {
			full: {
				zoom: 3,
				pathPrefix: "../"
			},
			standard: {
				zoom: 3,
				pathPrefix: ""
			}
		}

		var version;
		if ($("body").data("full")){
			version = 'full';
		} else {
			version = 'standard';
		}

	/*
	 * Helper function which normalizes the coords so that tiles can repeat across the X-axis (horizontally) like the standard Google map tiles.
	 * ----------------
	 */

		function getNormalizedCoord(coord, zoom) {

			if (!repeatOnXAxis) return coord;

			var y = coord.y;
			var x = coord.x;

			// tile range in one direction range is dependent on zoom level
			// 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
			var tileRange = 1 << zoom;

			// don't repeat across Y-axis (vertically)
			if (y < 0 || y >= tileRange) {
				return null;
			}

			// repeat across X-axis
			if (x < 0 || x >= tileRange) {
				x = (x % tileRange + tileRange) % tileRange;
			}

			return {
				x: x,
				y: y
			};

		}


	/*
	 * Main Core
	 * ----------------
	 */

		window.onload = function() {

			// Define our custom map type
			var customMapType = new google.maps.ImageMapType({
				getTileUrl: function(coord, zoom) {
					var normalizedCoord = getNormalizedCoord(coord, zoom);
					if(normalizedCoord && (normalizedCoord.x < Math.pow(2, zoom)) && (normalizedCoord.x > -1) && (normalizedCoord.y < Math.pow(2, zoom)) && (normalizedCoord.y > -1)) {
						return 'https://s3-us-west-2.amazonaws.com/academo-assets/images/hudf/' + zoom + '_' + normalizedCoord.x + '_' + normalizedCoord.y + '.jpg';
						// return settings[version].pathPrefix + 'tilecutter/' + zoom + '_' + normalizedCoord.x + '_' + normalizedCoord.y + '.jpg';
					} else {
						return blankTilePath;
					}
				},
				tileSize: new google.maps.Size(256, 256),
				maxZoom: maxZoom
			});

			// Basic options for our map
			var myOptions = {
				center: new google.maps.LatLng(0,0),
				zoom: settings[version].zoom,
				minZoom: 2,
				streetViewControl: false,
				mapTypeControl: false,
				panControl: false,
				mapTypeControlOptions: {
					mapTypeIds: ["custom"]
				}
			};

			// Init the map
			var map = new google.maps.Map(document.getElementById('demo'), myOptions);

			// Hook the our custom map type to the map and activate it
			map.mapTypes.set('custom', customMapType);
			map.setMapTypeId('custom');

			google.maps.event.addListener(map, 'click', function(event) {

			  });

			if ($('body').data('full')){
			   // Create the DIV to hold the control and
			    // call the HomeControl() constructor passing
			    // in this DIV.
			    var homeControlDiv = document.createElement('div');
			    var homeControl = new HomeControl(homeControlDiv, map);

			    homeControlDiv.index = 1;
			    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);

			}

		}


		/**
		 * The HomeControl adds a control to the map that simply
		 * returns the user to Chicago. This constructor takes
		 * the control DIV as an argument.
		 * @constructor
		 */
		function HomeControl(controlDiv, map) {

		  // Set CSS styles for the DIV containing the control
		  // Setting padding to 5 px will offset the control
		  // from the edge of the map
		  controlDiv.style.padding = '5px';

		  // Set CSS for the control border
		  var controlUI = document.createElement('div');
		  controlUI.style.backgroundColor = 'white';
		  controlUI.style.borderStyle = 'solid';
		  controlUI.style.borderWidth = '2px';
		  controlUI.style.cursor = 'pointer';
		  controlUI.style.textAlign = 'center';
		  controlUI.title = 'Click to exit full page mode';
		  controlDiv.appendChild(controlUI);

		  // Set CSS for the control interior
		  var controlText = document.createElement('div');
		  controlText.style.fontFamily = 'Arial,sans-serif';
		  controlText.style.fontSize = '12px';
		  controlText.style.paddingLeft = '4px';
		  controlText.style.paddingRight = '4px';
		  controlText.innerHTML = '<a href="../">Exit full page mode</a>';
		  controlUI.appendChild(controlText);

		  // Setup the click event listeners: simply set the map to
		  // Chicago
		  // google.maps.event.addDomListener(controlUI, 'click', function() {
		  //   map.setCenter(chicago)
		  // });

		}