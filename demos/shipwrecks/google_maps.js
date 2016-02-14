var map;
var ui = null;
var shipwrecks = [
  ["#world-discoverer", -9.02303, 160.12311,17],
  ["#costa", 42.3654, 10.9216,16],
  ["#fedora", 46.860191, -90.778624,18],
  ["#uss-utah", 21.36900, -157.96242,19],
  ["#ss-jassim", 19.64616, 37.29523,18],
  ["#united-malika", 20.77102, -17.04473,18],
  ["#mediterranean-sky", 38.02463, 23.4896,17],
  ["#captayannis", 55.9761, -4.7419,16],
  ["#chernobyl", 51.28392, 30.2130,17],
  ["#chernobyl", 51.28392, 30.2130,17],
  ["#plassy", 53.05584, -9.503625,18],
  ["#primrose", 11.593429, 92.212582,17],
  ["#roxburgh", -14.43209, -144.98714,18],
  ["#kyotoku", 38.91579, 141.5803,18],
  ["#lst-480", 21.35725, -157.9972,19],

]

function initialize() {

  $("#demo").append("<div id='map' style='height:500px;width:100%;'></div>");

  $(".demo_user_interface").appendTo("#ui-container");

  var map_container = document.getElementById('map');
  map_container.style.height =  0.5 * map_container.offsetWidth + "px";

  $(window).resize(function(){
    map_container.style.height =  0.5 * map_container.offsetWidth + "px";
  })





var mapOptions = {
  center: new google.maps.LatLng(-9.02303, 160.12311),
  zoom: 17,
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

for (i = 0 ; i < shipwrecks.length ; i++){
  (function(i){
  $(shipwrecks[i][0]).click(function(e){

    e.preventDefault();
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
    map.setCenter(new google.maps.LatLng(shipwrecks[i][1], shipwrecks[i][2]));
    map.setZoom(shipwrecks[i][3]);
  });
  })(i);
}

