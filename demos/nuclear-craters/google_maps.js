
var ui = null;

var craters = [
  ["#sedan", 37.17676, -116.0462,15],
  ["#bravo", 11.6977, 165.272,13],
  ["#yucca-flats", 37.1130, -116.0599,15],
  ["#ivy-mike", 11.6690, 162.1935,14],
  ["#cactus", 11.55255, 162.34726,17],
  ["#pokhran", 27.09444, 71.75372,17],
  ["#lake-chagan", 49.935278, 79.008889,15]
]
var map;
function initialize() {

  $("#demo").append("<div id='map' style='height:500px;width:100%;'></div>");

  $(".demo_user_interface").appendTo("#ui-container");

  var map_container = document.getElementById('map');
  map_container.style.height =  0.5 * map_container.offsetWidth + "px";

  $(window).resize(function(){
    map_container.style.height =  0.5 * map_container.offsetWidth + "px";
  })





var mapOptions = {
  center: new google.maps.LatLng(craters[0][1], craters[0][2]),
  zoom: craters[0][3],
  mapTypeId: google.maps.MapTypeId.SATELLITE,
  mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.ROADMAP, 'map_style']
      }
};

map = new google.maps.Map(document.getElementById("map"),
  mapOptions);



}
google.maps.event.addDomListener(window, 'load', initialize);


function getQueryStrings() {
  var assoc  = {};
  var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
  var queryString = location.search.substring(1);
  var keyValues = queryString.split('&');

  for(var i in keyValues) {
    var key = keyValues[i].split('=');
    if (key.length > 1) {
      assoc[decode(key[0])] = decode(key[1]);
    }
  }

  return assoc;
}

var qs = getQueryStrings();
var myParam = qs.ship;


for (i = 0 ; i < craters.length ; i++){
  (function(i){
  $(craters[i][0]).click(function(e){

    e.preventDefault();
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
    map.setCenter(new google.maps.LatLng(craters[i][1], craters[i][2]));
    map.setZoom(craters[i][3]);
  });
  })(i);
}

// $("#world-discoverer").click(function(e){
//   e.preventDefault();
//   $(".selected").removeClass("selected");
//   $(this).addClass("selected");
//   map.setCenter(new google.maps.LatLng(-9.02303, 160.12311));
//   map.setZoom(17);
// });
// $("#costa").click(function(e){
//   e.preventDefault();
//   $(".selected").removeClass("selected");
//   $(this).addClass("selected");
//   map.setCenter(new google.maps.LatLng(42.3654, 10.9216));
//   map.setZoom(16);
// });
// $("#fedora").click(function(e){
//   e.preventDefault();
//   $(".selected").removeClass("selected");
//   $(this).addClass("selected");
//   map.setCenter(new google.maps.LatLng(46.860191, -90.778624));
//   map.setZoom(18);
// });
// $("#uss-utah").click(function(e){
//   e.preventDefault();
//   $(".selected").removeClass("selected");
//   $(this).addClass("selected");
//   map.setCenter(new google.maps.LatLng(21.36900, -157.96242));
//   map.setZoom(19);
// });
// $("#ss-jassim").click(function(e){
//   e.preventDefault();
//   $(".selected").removeClass("selected");
//   $(this).addClass("selected");
//   map.setCenter(new google.maps.LatLng(19.64616, 37.29523));
//   map.setZoom(18);
// });
// $("#united-malika").click(function(e){
//   e.preventDefault();
//   $(".selected").removeClass("selected");
//   $(this).addClass("selected");
//   map.setCenter(new google.maps.LatLng(20.77102, -17.04473));
//   map.setZoom(18);
// });
// $("#mediterranean-sky").click(function(e){
//   e.preventDefault();
//   $(".selected").removeClass("selected");
//   $(this).addClass("selected");
//   map.setCenter(new google.maps.LatLng(38.02463, 23.4896));
//   map.setZoom(17);
// });
// $("#captayannis").click(function(e){
//   e.preventDefault();
//   $(".selected").removeClass("selected");
//   $(this).addClass("selected");
//   map.setCenter(new google.maps.LatLng(55.9761, -4.7419));
//   map.setZoom(16);
// });
// $("#chernobyl").click(function(e){
//   e.preventDefault();
//   $(".selected").removeClass("selected");
//   $(this).addClass("selected");
//   map.setCenter(new google.maps.LatLng(51.28392, 30.2130));
//   map.setZoom(17);
// });
// $("#plassy").click(function(e){
//   e.preventDefault();
//   $(".selected").removeClass("selected");
//   $(this).addClass("selected");
//   map.setCenter(new google.maps.LatLng(53.05584, -9.503625));
//   map.setZoom(18);
// });
// $("#primrose").click(function(e){
//   e.preventDefault();
//   $(".selected").removeClass("selected");
//   $(this).addClass("selected");
//   map.setCenter(new google.maps.LatLng(11.593429, 92.212582));
//   map.setZoom(17);
// });
