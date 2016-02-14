var ui = {
	frame: {
		title: "Rotate",
		value: 18,
		units: null,
		range:[1,36],
		resolution:1,
		input: 'hidden'

	},
	animate: {
		title: "Animate",
		value: false
	}
}

$("#demo").append("<div id='map'></div>");
n = ui.frame.value;
$("#map").css("background-position", "0px " + -(n-1)*256 + "px")

var spin;

function update(){


	if (ui.animate.value == true && !spin){
		animate()
	} else {
		cancelAnimationFrame(spin);
		spin = null;
	}

	n = ui.frame.value;
	$("#map").css("background-position", "0px " + -(n-1)*256 + "px");
}

var f = 0;
var i =0;

$("label").click(function(){
	alert("test");
});

function animate() {

	spin = window.requestAnimationFrame(animate);

	if (f % 7 == 0){
		$("#map").css("background-position", "0px " + -(ui.frame.value-1)*256 + "px")
		if (ui.frame.value >=36){
			  ui.frame.value = 1;
		} else {
			ui.frame.value++;
		}
	}
	$("#frame-interface").val(ui.frame.value);

	f++;

	return spin
}