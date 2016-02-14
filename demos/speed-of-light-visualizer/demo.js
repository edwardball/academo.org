var demo = new Demo({
	ui: {
		// mode: {
		// 	title: "Mode"
		// 	value: 'point',
		// 	values: [['Point to Point', 'point'], ['Equatorial Circumnavigation', 'equator']]
		// },
		pusle: {
			title: "Send Pulse",
			type: "button"
		}
	},

	markerPosition: 0,
	distance:0,
	currentOffset:0,
	c: 299792458,
	t0:0,

	init: function(){
		this.path;
		// this.poly;
		this.geodesicPoly;
		this.marker1;
		this.marker2;

		_this = this;


		map_dom = document.getElementById('demo');
		map_dom.style.height = map_dom.offsetWidth/2  + "px";


		var myOptions = {
		  zoom: 2,
		  center: new google.maps.LatLng(25.80, -35.69),
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(map_dom, myOptions);


		this.marker1 = new google.maps.Marker({
		  map: map,
		  draggable: true,
		  position: new google.maps.LatLng(22,-110)
		});

		this.marker2 = new google.maps.Marker({
		  map: map,
		  draggable: true,
		  position: new google.maps.LatLng(-22, 60)
		});


		google.maps.event.addListener(_this.marker1, 'position_changed', this.updateMarkers.bind(this));
		google.maps.event.addListener(_this.marker2, 'position_changed', this.updateMarkers.bind(this));

		// Define the symbol, using one of the predefined paths ('CIRCLE')
		// supplied by the Google Maps JavaScript API.
		var lineSymbol = {
			path: google.maps.SymbolPath.CIRCLE,
			scale: 8,
			strokeColor: 'yellow',
			fillColor: 'yellow',

		};

		var geodesicOptions = {
		  strokeColor: '#CC0099',
		  strokeOpacity: 1.0,
		  strokeWeight: 3,
		  geodesic: true,
		  map: map,
		  icons: [{
		  	icon: lineSymbol,
		  	offset: this.currentOffset + "%"
		  }],
		};



		this.geodesicPoly = new google.maps.Polyline(geodesicOptions);

		// var polyOptions = {
		//   strokeColor: '#FF0000',
		//   strokeOpacity: 1.0,
		//   strokeWeight: 3,
		//   map: map,
		//   icons: [{
		//   	icon: lineSymbol,
		//   	offset: this.currentOffset + "%"
		//   }],
		// };
		// this.poly = new google.maps.Polyline(polyOptions);

		// path = [new google.maps.LatLng(0, -180),  new google.maps.LatLng(0, 0), new google.maps.LatLng(0, 180)];
		// this.poly.setPath(path);

		$("#ui-container").append("Distance: <span class='js-distance'></span>km<br />");
		$("#ui-container").append("Time Taken: <span class='js-time'></span>s");
		this.updateMarkers();
	},

	updateMarkers: function(){
		this.path = [this.marker1.getPosition(), this.marker2.getPosition()];
		this.geodesicPoly.setPath(this.path);
		this.distance = google.maps.geometry.spherical.computeDistanceBetween(this.marker1.getPosition(), this.marker2.getPosition());
		$(".js-distance").html(numberWithCommas(Math.round(this.distance/1000)));
		$(".js-time").html((this.distance/this.c).toFixed(6));
	},

	update: function(e){
		this.animate();
	},

	updateIcon: function(){
		t1 = new Date().getTime();
		dt = 0.001 * (t1 - this.t0);
		// dt = dt > 0.2 ? 0 : dt;
		distanceTravelled = dt * this.c;
		this.currentOffset = 100* (distanceTravelled / this.distance);
		var icons = this.geodesicPoly.get('icons');
		
		if (this.currentOffset > 100){
			window.clearInterval(this.animateID);
			tmp = this.marker1;
			this.marker1 = this.marker2;
			this.marker2 = tmp;
			this.updateMarkers();
			icons[0].offset = '0%';

		} else {
			icons[0].offset = this.currentOffset + '%';
			this.geodesicPoly.set('icons', icons);
		}
		
		// this.t0 = t1;

	},

	animate: function(){
		  this.t0 = new Date().getTime();
		  this.animateID = window.setInterval(this.updateIcon.bind(this), 1);

	}
});

//http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
