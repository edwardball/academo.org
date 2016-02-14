 window.onload = function() {

 var moonTypeOptions = {
   getTileUrl: function(coord, zoom) {

    var tilesCount = Math.pow(2, zoom);

    // if (coord.x >= tilesCount || coord.x < 0 || coord.y >= tilesCount || coord.y < 0) {
    //     var div = ownerDocument.createElement('div');
    //     div.style.width = this.tileSize.width + 'px';
    //     div.style.height = this.tileSize.height + 'px';
    //     div.style.backgroundColor = this._backgroundColor;
    //     return div;
    // }

    return "http://localhost:4000/demos/hubble-ultra-deep-field/tiles/tile_" +
        zoom + '_' + coord.x + '-' + coord.y + '.png';

    ////////////////

       // var normalizedCoord = getNormalizedCoord(coord, zoom);
       // if (!normalizedCoord) {
       //   return null;
       // }
       // var bound = Math.pow(2, zoom);
       // return "http://localhost:4000/demos/hubble-ultra-deep-field/tiles/tile_" +
       //     zoom + "_" + normalizedCoord.x + "-" +
       //     (bound - normalizedCoord.y - 1) + ".png";
   },
   tileSize: new google.maps.Size(256, 256),
   maxZoom: 1,
   minZoom: 0,
   radius: 1738000,
   name: "Moon"
 };

 var moonMapType = new google.maps.ImageMapType(moonTypeOptions);

 function initialize() {

  var map_container = document.getElementById('map_canvas');
  map_container.style.height =  map_container.offsetWidth + "px";

  $(window).resize(function(){
    console.log("resize")
    map_container.style.height =  map_container.offsetWidth + "px";
  })

   var myLatlng = new google.maps.LatLng(0, 0);
   var mapOptions = {
     center: myLatlng,
     zoom: 3,
     streetViewControl: false,
     // mapTypeControlOptions: {
     //   mapTypeIds: ["moon"]
     // }
     mapTypeControl: false,
     panControl: false
   };


//NB LINE 73 of flatly_sass_test.css has max-width 100% for images so it messes up the display,
// map needs to have id of "map_canvas" to have max-width set to 0;
   var map = new google.maps.Map(document.getElementById("map_canvas"),
       mapOptions


    );
   map.mapTypes.set('moon', moonMapType);
   map.setMapTypeId('moon');

   // bounds of the desired area
   var allowedBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-45, -90),
        new google.maps.LatLng(45, 90)
   );
   var lastValidCenter = map.getCenter();

   google.maps.event.addListener(map, 'center_changed', function() {
       if (allowedBounds.contains(map.getCenter())) {
           // still within valid bounds, so save the last valid position
           lastValidCenter = map.getCenter();
           return;
       }

       // not valid anymore => return to last valid position
       map.panTo(lastValidCenter);
   });
 }

 // Normalizes the coords that tiles repeat across the x axis (horizontally)
 // like the standard Google map tiles.
 function getNormalizedCoord(coord, zoom) {
   var y = coord.y;
   var x = coord.x;

   // tile range in one direction range is dependent on zoom level
   // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
   var tileRange = 1 << zoom;

   // don't repeat across y-axis (vertically)
   if (y < 0 || y >= tileRange) {
     return null;
   }

   // repeat across x-axis
   if (x < 0 || x >= tileRange) {
     x = (x % tileRange + tileRange) % tileRange;
   }

   return {
     x: x,
     y: y
   };
 }

 initialize();



};