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

 

  $(document).on("uiLoaded", function(){

    var path;
    var poly;
    var geodesicPoly;
    var marker1;
    var marker2;


    map_dom = document.getElementById('demo');
    map_dom.style.height = map_dom.offsetWidth/2  + "px";

    initialize();

});


    function initialize() {
      var myOptions = {
        zoom: 2,
        center: new google.maps.LatLng(25.80, -35.69),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map = new google.maps.Map(map_dom, myOptions);


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
