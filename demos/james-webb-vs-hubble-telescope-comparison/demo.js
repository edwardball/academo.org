// Map Generated with Map Tiler Desktop, https://www.maptiler.com/

var demo = new Demo({
	ui: {
	},

	init: function(){
		var map_container = document.getElementById('demo');
		$("#demo").append("<div id='map'></div>");
		// map_container.append("<div id='map'></div>")
		map_container.style.height =   map_container.offsetWidth + "px";
		var customUI = "<div class='custom-ui'><button id='show-hubble'>Hubble</button><button class='telescope-comparison-active' id='show-jwst'>JWST</button></div>";
		$("#demo").append(customUI);


		var mapExtent = [0.00000000, -4628.00000000, 4529.00000000, 0.00000000];
var mapMinZoom = 0;
var mapMaxZoom = 4;
var mapMaxResolution = 1.00000000;
var tileExtent = [0.00000000, -4628.00000000, 4529.00000000, 0.00000000];
var tileWidth = 512;
var tileHeight = 512;

var mapResolutions = [];
for (var z = 0; z <= mapMaxZoom; z++) {
  mapResolutions.push(Math.pow(2, mapMaxZoom - z) * mapMaxResolution);
}

var mapTileGrid = new ol.tilegrid.TileGrid({
  tileSize: [tileWidth, tileHeight],
  extent: tileExtent,
  minZoom: mapMinZoom,
  zoom:2,
  resolutions: mapResolutions
});

// note images are not in this repo in order to keep file size of repo low.

var layer = new ol.layer.Tile({
  source: new ol.source.XYZ({
    projection: 'PIXELS',
    tileGrid: mapTileGrid,
    tilePixelRatio: 1.00000000,
    url: "jwst/{z}/{x}/{y}.png",
  })
});

var layer2 = new ol.layer.Tile({
  source: new ol.source.XYZ({
    projection: 'PIXELS',
    tileGrid: mapTileGrid,
    tilePixelRatio: 1.00000000,
    url: "hubble/{z}/{x}/{y}.png",
  })
});

var map = new ol.Map({
  target: 'map',
  layers: [
    layer2, layer
  ],

  view: new ol.View({
    projection: ol.proj.get('PIXELS'),
    extent: mapExtent,
    maxResolution: mapTileGrid.getResolution(mapMinZoom)
  }),
});

map.getView().fit(mapExtent, map.getSize());
map.getView().setZoom(2);




$("#show-hubble").click(function(){
  layer2.setVisible(true);
  layer.setVisible(false); 
  $("#show-hubble").addClass("telescope-comparison-active");
  $("#show-jwst").removeClass("telescope-comparison-active");
});

$("#show-jwst").click(function(){
  layer2.setVisible(false);  
  layer.setVisible(true);  
  $("#show-hubble").removeClass("telescope-comparison-active");
  $("#show-jwst").addClass("telescope-comparison-active");
});


	},

	update: function(e){

	}
});