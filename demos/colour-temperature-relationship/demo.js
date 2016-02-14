var ui = {
	temperature: {
		title: "Temperature",
		value: 1500,
		units: "K",
		range:[1500,15000],
		resolution:1
	},
};


/**
* http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
* */
function KToRGB(Temperature){

	Temperature = Temperature / 100;

	if (Temperature <= 66){
		Red = 255;
	} else {
		Red = Temperature - 60;
		Red = 329.698727466 * Math.pow(Red, -0.1332047592);
		if (Red < 0){
			Red = 0;
		}
		if (Red > 255){
			Red = 255;
		}
	}

	if (Temperature <= 66){
		Green = Temperature;
		Green = 99.4708025861 * Math.log(Green) - 161.1195681661;
		if (Green < 0 ) {
			Green = 0;
		}
		if (Green > 255) {
			Green = 255;
		}
	} else {
		Green = Temperature - 60;
		Green = 288.1221695283 * Math.pow(Green, -0.0755148492);
		if (Green < 0 ) {
			Green = 0;
		}
		if (Green > 255) {
			Green = 255;
		}
	}

	if (Temperature >= 66){
		Blue = 255;
	} else {
		if (Temperature <= 19){
			Blue = 0;
		} else {
			Blue = Temperature - 10;
			Blue = 138.5177312231 * Math.log(Blue) - 305.0447927307;
			if (Blue < 0){
				Blue = 0;
			}
			if (Blue > 255){
				Blue = 255;
			}
		}
	}

	rgb = new Array(Math.round(Red),Math.round(Green),Math.round(Blue));
	return rgb;

}

$('#demo').append("<div id='color-display'></div>");

$(document).on("uiLoaded", function(){
	$('#ui-container').append("<div id='color'></div>");
	update();
});


function update(){
	color = KToRGB(ui.temperature.value)
	$("#color-display").css("background-color", "rgb("+ color[0] +","+ color[1] + ", "+ color[2] +")")
	$("#color").html("<p><span>Color:</span><br />rgb("+ color[0] +","+ color[1] + ", "+ color[2] +")<br />Hex: #" + toHex(color[0]).toUpperCase() + toHex(color[1]).toUpperCase() + toHex(color[2]).toUpperCase()+"</p>");
}

function toHex(number){
	var hex =  number.toString(16);
	if (hex.length < 2){
		hex = "0" + hex;
	}
	return hex;
}