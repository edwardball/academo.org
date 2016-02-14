var ui = {
	constellation:{
		title: "Constellation",
	    value: 1,
	    values: [
		    ["Orion",1],
		    ["The Plough (Big Dipper)",2]
		]
	},
	level: {
		title: "Adjust Bortle Level",
		value: 9,
		units: null,
		range:[1,9],
		resolution:0.01,
		input: 'hidden'
	}
};

var data = [
	["Excellent dark-sky site"],
	["Typical dark site"],
	["Rural sky"],
	["Rural/Suburban transition"],
	["Suburban sky"],
	["Bright Suburban sky"],
	["Suburban/Urban transition"],
	["City Sky"],
	["Inner-city sky"]
];


var elements = [];
var demo = document.getElementById('demo');
var name = 'orion';
demo.style.height =  2/3 * demo.offsetWidth + "px";

$(document).on("uiLoaded", function(){
	$('#ui-container').append("<div id='current-bortle-level-description'></div>");
	init();
	update();
});


function init(){
	for (i = 0, length = data.length ; i < length ; i++){
		elements[i] = document.createElement("img");
		elements[i].style.opacity = 0;
		demo.appendChild(elements[i]);
	}
	updateImgSrcs(elements);
	elements[data.length - 1].style.opacity = 1;	
}

function updateImgSrcs(elements){
	elements.forEach(function(el, index){
		el.src = "images/" + name + (index+1) + ".png";
	});
}

function update(e){

	if (e == "constellation"){
		if (ui.constellation.value == 1){
			name = "orion";
		} else {
			name = "plough";
		}
		updateImgSrcs(elements);
	}

	bortleValue = ui.level.value;
	roundedBortleValue = Math.round(bortleValue);
	$("#level-interface input").val(roundedBortleValue);
	opacity = bortleValue % 1;
	opaqueID = Math.floor(bortleValue);
	elements.forEach(function(el){
		el.style.opacity = 0;
	})
	elements[opaqueID-1].style.opacity = 1;
	if (opaqueID < 9){
		elements[opaqueID].style.opacity = opacity;
	}
	$("#current-bortle-level-description").html("<span>Current Bortle Level: "+roundedBortleValue+"</span><br /><br /><span>Description:</span><br />"+data[roundedBortleValue-1]);
}