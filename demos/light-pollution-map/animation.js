ui = {

};

$(document).on("uiLoaded", function(){

              var map;

             /*
              * = PS_Bramus.GoogleMapsTileCutter Config
              * ----------------
              */

                 var repeatOnXAxis = false; // Do we need to repeat the image on the X-axis? Most likely you'll want to set this to false



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

                 // window.onload = function() {

                     // Define our custom map type
                     var customMapType = new google.maps.ImageMapType({
                         getTileUrl: function(coord, zoom) {
                             var normalizedCoord = getNormalizedCoord(coord, zoom);
                             if(normalizedCoord && (normalizedCoord.x < Math.pow(2, zoom)) && (normalizedCoord.x > -1) && (normalizedCoord.y < Math.pow(2, zoom)) && (normalizedCoord.y > -1)) {
                                 return assetPath + "/demos/light-pollution-map/tiles/" + zoom + '_' + normalizedCoord.x + '_' + normalizedCoord.y + '.png';
                             } else {
                                 return assetPath + '/demos/light-pollution-map/tiles/empty.png';
                             }
                         },
                         tileSize: new google.maps.Size(256, 256),
                         maxZoom: 6,
                         name: 'PS_Bramus.GoogleMapsTileCutter',
                     });

                     // Basic options for our map
                     var myOptions = {
                        backgroundColor: "#000",
                         center: new google.maps.LatLng(0, 0),
                         zoom: 3,
                         minZoom: 2,
                         maxZoom:6,
                         streetViewControl: false,
                         mapTypeControl: false,
                         mapTypeControlOptions: {
                             mapTypeIds: ["custom"]
                         },
                         scrollwheel:false

                     };

                     var map_container = document.getElementById('demo');
                     map_container.style.height =  0.5 * map_container.offsetWidth + "px";

                     $(window).resize(function(){
                       map_container.style.height =  0.5 * map_container.offsetWidth + "px";
                     })

                     // Init the map and hook our custom map type to it
                     map = new google.maps.Map(document.getElementById('demo'), myOptions);
                     map.mapTypes.set('custom', customMapType);
                     map.setMapTypeId('custom');

                 // }
});