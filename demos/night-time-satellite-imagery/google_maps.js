// ui = null;

// var map;
// function initialize() {

//   var map_container = document.getElementById('demo');
//   map_container.style.height =  0.5 * map_container.offsetWidth + "px";

//   $(window).resize(function(){
//     map_container.style.height =  0.5 * map_container.offsetWidth + "px";
//   })


// var styles = [
//   {
//     "featureType": "water",
//     "stylers": [
//       { "hue": "#ff0000" },
//       { "color": "#000020" }
//     ]
//   },{
//     "featureType": "landscape",
//     "elementType": "geometry",
//     "stylers": [
//       { "color": "#0e194a" }
//     ]
//   },{
//     "elementType": "labels",
//     "stylers": [
//       { "visibility": "off" }
//     ]
//   },{
//     "featureType": "road",
//     "stylers": [
//       { "visibility": "off" }
//     ]
//   },{
//     "featureType": "administrative",
//     "stylers": [
//       { "visibility": "off" }
//     ]
//   },{
//     "featureType": "poi",
//     "stylers": [
//       { "visibility": "off" }
//     ]
//   },{
//     "featureType": "transit",
//     "stylers": [
//       { "visibility": "off" }
//     ]
//   },{
//   }
// ];

// var styledMap = new google.maps.StyledMapType(styles,
//     {name: "Night"});




// var mapOptions = {
//   center: new google.maps.LatLng(20, 0),
//   zoom: 2,
//   // mapTypeId: google.maps.MapTypeId.SATELLITE,
//   mapTypeControlOptions: {
//         mapTypeIds: [google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.ROADMAP, 'map_style']
//       }
// };
// map = new google.maps.Map(document.getElementById("demo"),
//   mapOptions);

// var mapsEngineLayer = new google.maps.visualization.MapsEngineLayer({
//   mapId: '10446176163891957399-13737975182519107424-4',
//   layerKey: 'layer_00001',
//   // map: map,
// });

// google.maps.event.addListener( map, 'maptypeid_changed', function() {
//   if (map.getMapTypeId() == "map_style"){
//     mapsEngineLayer.setMap(map);
//   } else {
//     mapsEngineLayer.setMap(null);
//     // map.setMapTypeId(google.maps.MapTypeId.SATELLITE)
//   }
// });


// //Associate the styled map with the MapTypeId and set it to display.
//   map.mapTypes.set('map_style', styledMap);
//    map.setMapTypeId('map_style');


// if ($('body').data('full')){
//    // Create the DIV to hold the control and
//     // call the HomeControl() constructor passing
//     // in this DIV.
//     var homeControlDiv = document.createElement('div');
//     var homeControl = new HomeControl(homeControlDiv, map);

//     homeControlDiv.index = 1;
//     map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);

// }


// }
// google.maps.event.addDomListener(window, 'load', initialize);



// /**
//  * The HomeControl adds a control to the map that simply
//  * returns the user to Chicago. This constructor takes
//  * the control DIV as an argument.
//  * @constructor
//  */
// function HomeControl(controlDiv, map) {

//   // Set CSS styles for the DIV containing the control
//   // Setting padding to 5 px will offset the control
//   // from the edge of the map
//   controlDiv.style.padding = '5px';

//   // Set CSS for the control border
//   var controlUI = document.createElement('div');
//   controlUI.style.backgroundColor = 'white';
//   controlUI.style.borderStyle = 'solid';
//   controlUI.style.borderWidth = '2px';
//   controlUI.style.cursor = 'pointer';
//   controlUI.style.textAlign = 'center';
//   controlUI.title = 'Click to exit full page mode';
//   controlDiv.appendChild(controlUI);

//   // Set CSS for the control interior
//   var controlText = document.createElement('div');
//   controlText.style.fontFamily = 'Arial,sans-serif';
//   controlText.style.fontSize = '12px';
//   controlText.style.paddingLeft = '4px';
//   controlText.style.paddingRight = '4px';
//   controlText.innerHTML = '<a href="../">Exit full page mode</a>';
//   controlUI.appendChild(controlText);

//   // Setup the click event listeners: simply set the map to
//   // Chicago
//   // google.maps.event.addDomListener(controlUI, 'click', function() {
//   //   map.setCenter(chicago)
//   // });

// }

$("#demo").append($("#night-sky-image"));