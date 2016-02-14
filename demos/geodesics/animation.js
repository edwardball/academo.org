  ui = {
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
  };

  //google earth
  var ge;
  var lineString;

  function init() {
    google.earth.createInstance('map3d', initCB, failureCB);
    // initialize();

  }

  function failureCB(errorCode) {
  }

  function initCB(instance) {
        ge = instance;
        ge.getWindow().setVisibility(true);
        ge.getNavigationControl().setVisibility(ge.VISIBILITY_SHOW);


        // Create the placemark
        var lineStringPlacemark = ge.createPlacemark('');

        // Create the LineString
        lineString = ge.createLineString('');
        lineStringPlacemark.setGeometry(lineString);
        lineString.setExtrude(true);

        // Add LineString points
        var startLat = 39.64;
        var startLng = -115.49;

        lineString.getCoordinates().pushLatLngAlt(39.64, -115.49, 0);
        for (i = 0, pointCount = 20 ; i < pointCount ; i++){
          middle = google.maps.geometry.spherical.interpolate(new google.maps.LatLng(39.64, -115.49), new google.maps.LatLng(-22.69, 52.98), i / pointCount);
          lineString.getCoordinates().pushLatLngAlt(middle.lat(), middle.lng(), 0);
        }
        lineString.getCoordinates().pushLatLngAlt(-22.69, 52.98, 0);


        //style it
        // Create a style and set width and color of line
        lineStringPlacemark.setStyleSelector(ge.createStyle(''));
        var lineStyle = lineStringPlacemark.getStyleSelector().getLineStyle();
        lineStyle.setWidth(5);
        lineStyle.getColor().set('99CC0099');  // aabbggrr format

        // Add the feature to Earth
        ge.getFeatures().appendChild(lineStringPlacemark);

        initialize();

      }

  $(document).on("uiLoaded", function(){

    var path;
    var poly;
    var geodesicPoly;
    var marker1;
    var marker2;


    map_dom = document.getElementById('demo');
    map_dom.style.height = map_dom.offsetWidth/2  + "px";


    google.load("earth", "1", {"other_params":"sensor=false"});

    // //calbacks

    google.setOnLoadCallback(initialize);

});


    function initialize() {
      var myOptions = {
        zoom: 2,
        center: new google.maps.LatLng(25.80, -35.69),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(map_dom, myOptions);

      if (typeof GoogleEarth != 'undefined') {
        var ge = new GoogleEarth(map);
      }


      marker1 = new google.maps.Marker({
        map: map,
        draggable: true,
        position: new google.maps.LatLng(39.64, -115.49)
      });

      marker2 = new google.maps.Marker({
        map: map,
        draggable: true,
        position: new google.maps.LatLng(-22.69, 52.98)
      });


      google.maps.event.addListener(marker1, 'position_changed', updateMarkers);
      google.maps.event.addListener(marker2, 'position_changed', updateMarkers);

      var polyOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map,
      };
      poly = new google.maps.Polyline(polyOptions);

      var geodesicOptions = {
        strokeColor: '#CC0099',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        geodesic: true,
        map: map
      };
      geodesicPoly = new google.maps.Polyline(geodesicOptions);


      updateMarkers();
    }

    function updateMarkers() {
      path = [marker1.getPosition(), marker2.getPosition()];
      poly.setPath(path);
      geodesicPoly.setPath(path);

      var heading = google.maps.geometry.spherical.computeHeading(path[0], path[1]);

      $('#heading-interface input').val(heading.toFixed(2)+"°");
      // $('#origin-interface input').val(path[0].toString());
      $('#origin-interface input').val("("+(path[0].lat()).toFixed(2) + "°, " + (path[0].lng()).toFixed(2)+"°)");
      $('#destination-interface input').val("("+(path[1].lat()).toFixed(2) + "°, " + (path[1].lng()).toFixed(2)+"°)");
    }
