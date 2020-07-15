var demo = new Demo({
	ui: {
		origin: {
		        title: "Origin",
		        value: "",
		        input: "hidden"
		    },
		    destination: {
		        title: "Destination",
		        value: "",
		        input: "hidden"
		    },
		    heading: {
		        title: "Heading",
		        value: "",
		        input: "hidden"
		    },
	},

	init: function(){

    	this.path;
    	this.poly;
    	this.geodesicPoly;
    	this.marker1;
    	this.marker2;
		this.map_dom = document.getElementById('demo');
    	this.map_dom.style.height = this.map_dom.offsetWidth/2  + "px";


		var myOptions = {
        	zoom: 2,
        	center: new google.maps.LatLng(25.80, -35.69),
        	mapTypeId: google.maps.MapTypeId.ROADMAP
      	};

      	this.map = new google.maps.Map(this.map_dom, myOptions);


      	this.marker1 = new google.maps.Marker({
        	map: this.map,
        	draggable: true,
        	position: new google.maps.LatLng(39.64, -115.49)
      	});

      	this.marker2 = new google.maps.Marker({
        	map: this.map,
        	draggable: true,
        	position: new google.maps.LatLng(-22.69, 52.98)
      	});


      	google.maps.event.addListener(this.marker1, 'position_changed', this.updateMarkers());
      	google.maps.event.addListener(this.marker2, 'position_changed', this.updateMarkers());

      var polyOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: this.map,
      };

      this.poly = new google.maps.Polyline(polyOptions);

      var geodesicOptions = {
        strokeColor: '#CC0099',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        geodesic: true,
        map: this.map
      };

      this.geodesicPoly = new google.maps.Polyline(geodesicOptions);


      this.updateMarkers();
	},

	update: function(e){

	},

	updateMarkers() {
      this.path = [this.marker1.getPosition(), this.marker2.getPosition()];
      this.poly.setPath(this.path);
      this.geodesicPoly.setPath(this.path);

      var heading = google.maps.geometry.spherical.computeHeading(this.path[0], this.path[1]);

      $('#heading-interface input').val(heading.toFixed(2)+"°");
      // $('#origin-interface input').val(path[0].toString());
      $('#origin-interface input').val("("+(this.path[0].lat()).toFixed(2) + "°, " + (this.path[0].lng()).toFixed(2)+"°)");
      $('#destination-interface input').val("("+(this.path[1].lat()).toFixed(2) + "°, " + (this.path[1].lng()).toFixed(2)+"°)");
    }


});
