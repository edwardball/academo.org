var demo = new Demo({
	ui: {
		    azimuth: {
		        title: "Azimuth",
		        value: "",
		        input: "hidden"
		    },
        direction: {
            title: "Direction",
            value: "",
            input: "hidden"
        },
        getLocation: {
          title: "Set marker to you current location",
          type: "button"
    }
	},

	init: function(){

      var _this = this;

    	this.path;
    	this.poly;
    	this.geodesicPoly;
    	this.marker1;
    	this.marker2;
		this.map_dom = document.getElementById('demo');
    	this.map_dom.style.height = this.map_dom.offsetWidth/2  + "px";


		var myOptions = {
        	zoom: 15,
        	center: new google.maps.LatLng(51.508056, -0.128056),
        	mapTypeId: google.maps.MapTypeId.ROADMAP
      	};

      	this.map = new google.maps.Map(this.map_dom, myOptions);
        console.log(this.map);


      	this.marker1 = new google.maps.Marker({
        	map: this.map,
        	draggable: true,
        	position: new google.maps.LatLng(51.508056, -0.128056)
      	});




        var starPath = "M7.5,0l-2,5h-5l4,3.5l-2,6l5-3.5l5,3.5l-2-6l4-3.5h-5L7.5,0z";

        var icon = {
          path: starPath,
          fillColor: '#FFFF00',
          fillOpacity: .7,
          anchor: new google.maps.Point(0,0),
          strokeWeight: 1,
          scale: 1.5,
          // origin: new google.maps.Point(100, 100),
          anchor: new google.maps.Point(7.5, 7.5)
        }

        // var marker = new google.maps.Marker({
        //   position: event.latLng,
        //   map: map,
        //   draggable: false,
        //   icon: icon
        // });

        this.marker2 = new google.maps.Marker({
          map: this.map,
          draggable: true,
          icon: icon,
          position: new google.maps.LatLng(51.509722, -0.126389)
        });


      	google.maps.event.addListener(this.marker1, 'position_changed', function(){
          _this.updateMarkers();
        });
        google.maps.event.addListener(this.marker2, 'position_changed', function(){
          _this.updateMarkers();
        });
        
      	

      var polyOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: this.map,
      };

      this.poly = new google.maps.Polyline(polyOptions);
      console.log(this.poly);

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
    if (e == "getLocation"){
      this.geoFindMe();
    }
	},

	updateMarkers: function() {
      
      this.path = [this.marker1.getPosition(), this.marker2.getPosition()];
      this.poly.setPath(this.path);
      // this.geodesicPoly.setPath(this.path);

      var heading = google.maps.geometry.spherical.computeHeading(this.path[0], this.path[1]);

      if (heading < -0.5){
        heading += 360;
      }

      $('#azimuth-interface input').val(heading.toFixed(0)+"°");
      $('#direction-interface input').val(this.getDirection(heading.toFixed(0)));
      // console.log(heading.toFixed(0));
      console.log(this.getDirection(heading.toFixed(0)));
      // this.getDirection(heading.toFixed(0));
      // $('#origin-interface input').val("("+(this.path[0].lat()).toFixed(2) + "°, " + (this.path[0].lng()).toFixed(2)+"°)");
      // $('#destination-interface input').val("("+(this.path[1].lat()).toFixed(2) + "°, " + (this.path[1].lng()).toFixed(2)+"°)");
    },

    geoFindMe: function() {
      _this = this;

     const status = document.querySelector('#status');

    


  if(!navigator.geolocation) {
    // status.textContent = 'Geolocation is not supported by your browser';
  } else {
    // status.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(function(position){
      _this.geoSuccess(position)
    }, function(){
      _this.geoError()
    });
  }

  },

  geoSuccess: function(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log(latitude, longitude);
      this.marker1.setPosition({lat: latitude, lng: longitude});
      this.marker2.setPosition({lat: latitude+0.001, lng: longitude+0.001});
      this.map.setCenter({lat: latitude, lng: longitude});
      this.updateMarkers();
  },

  geoError: function(){

  },

  directions: [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ],

  getDirection: function(angle){
    var shift = 11.25;
    var percentageRoundCircle = (1.0 * angle + shift) / 360;
    var directionIndex = percentageRoundCircle * 16;
    var directionIndexRounded = Math.floor(directionIndex) % 16;
    return this.directions[directionIndexRounded];
  }




});

















