//NB!! Javascripts Date Object --- January == 0, and December == 11

var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

var ui = {
	day: {
		title: "Day of the Year",
		value: 180,
		units: null,
		range:[1,365],
		resolution:1,
		input: 'hidden'
	},
	hour: {
		title: "Hour of the Day",
		value: 12,
		units: null,
		range:[0,23.99],
		resolution:.1,
		input: 'hidden'
	},
};

var map = document.getElementById('demo');
map.style.height = map.offsetWidth/1.5  + "px";

zoom = (map.offsetWidth > 768) ? 2 : 1;

var mapObj = new google.maps.Map(map, {
	scrollwheel:false,
	zoom:zoom,
	center: new google.maps.LatLng(0,0),
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	mapTypeControl: false,
	streetViewControl: false,
});

var date = new Date();
date.setDate(ui.day.value);

window.dno = new DayNightOverlay({
	map: mapObj,
	fillColor: 'rgba(0,0,0,0.5)',
	date: new Date(Date.UTC(2013,date.getMonth(),date.getDate()))
});


// $("#daySimulation").click(function(e){
// 	e.preventDefault();
// 	simulate(new Date(Date.UTC(2012,0,1)), new Date(Date.UTC(2012,0,2)), 3600000 / 10, 20)
// })

// $("#yearSimulation").click(function(e){
// 	e.preventDefault();
// 	simulate(new Date(Date.UTC(2012,0,1)), new Date(Date.UTC(2012,11,31)), 86400000, 20)
// })

$(document).on("uiLoaded", function(){
	$('#ui-container').prepend("<div class='interface'><span class='label'>Current Date:</span><div id='date'></div></div>");
	update();
});

function update(){
	var mins = (ui.hour.value%1 *60).toFixed(0);
	var date = new Date(2013, 0);
	date.setDate(ui.day.value);
	time = new Date(Date.UTC(2013,date.getMonth(),date.getDate(),ui.hour.value, mins));
	dno.setDate(time);
	$("#date").html(pad(time.getDate()) +" "+monthNames[time.getMonth()] + " " + pad(parseInt(ui.hour.value)) + ":" +pad(mins) + " GMT");
}

//http://stackoverflow.com/questions/8089875/show-a-leading-zero-if-a-number-is-less-than-10
function pad(n) {
	return (n < 10) ? ("0" + n) : n;
}