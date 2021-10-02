var map;
var ui = null;
var mines = [
  ["#mir-mine", 62.529422,113.993539,14],
  ["#udachnaya-pipe", 66.4331, 112.323, 13],
  ["#hambach", 50.910833,6.502778, 12],
  ["#rossing", -22.484167,15.048889, 13],
  ["#sunrise-dam", -29.0805, 122.4147,14],
  ["#bingham-canyon", 40.523,-112.151,13],
  ["#chino", 32.6436,-108.3686,15],


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
  center: new google.maps.LatLng(mines[0][1], mines[0][2]),
  zoom: 14,
  mapTypeId: google.maps.MapTypeId.SATELLITE,
  scaleControl: true,
  scaleControlOptions: {
          position: google.maps.ControlPosition.LEFT_TOP
      },
  // mapTypeControlOptions: {
  //       mapTypeIds: [google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.ROADMAP, 'map_style']
  //     }
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

for (i = 0 ; i < mines.length ; i++){
  (function(i){
  $(mines[i][0]).click(function(e){

    e.preventDefault();
    $(".selected").removeClass("selected");
    $(this).addClass("selected");
    map.setCenter(new google.maps.LatLng(mines[i][1], mines[i][2]));
    map.setZoom(mines[i][3]);
  });
  })(i);
}

