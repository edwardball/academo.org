ui = {
	// radius: {
	// 	title: "radius",
	// 	value: 150,
	// 	range: [1,200],
	// 	resolution: 1,
	// 	units: "pixels"
	// },
	segments: {
		title: "Number of sectors",
		value: 4,
		range: [4,40],
		resolution: 1,
		step: 2,
		color: "lightblue"
	},
	rearrange: {
		title: "Rearrange",
		type: "button"
	}
};

var radius = 150;

var rectangleArrangement = false;

function transformElement(element, transformString){
	element.style.webkitTransform = transformString;
	element.style.MozTransform = transformString;
	element.style.msTransform = transformString;
	element.style.OTransform = transformString;
	element.style.transform = transformString;
}

var SVG = function(){
	this.element = document.getElementsByTagName("svg")[0];
	this.namespace = "http://www.w3.org/2000/svg";
	this.width = $("#demo").width();
	this.height = 600;
}

var Wedge = function(x,y, rotation, fill){
	this.radius = 50;
	this.rotation = rotation; // orientated like an ice-cream cone.
	//coords of tip;
	this.x = x; 
	this.y = y;
	this.stroke = "#333";

	this.radius = radius;
	this.fill = fill;
	this.strokeWidth = 0.5;
	this.angle = 360 / ui.segments.value;
	this.wacawaca = false;
	this.element = null;
	this.init();
}

Wedge.prototype.init = function(){
	this.element = document.createElementNS(svg.namespace,"path");
	$("svg g").append(this.element);
	this.element.setAttribute("fill",this.fill);
	this.element.setAttribute("stroke",this.stroke);
	this.element.setAttribute("stroke-width",this.strokeWidth);
	this.draw();
};

Wedge.prototype.draw = function(){
	rads = Math.PI * this.angle /180;

	large_arc_flag = 0;

	path = [
		"M", this.x, ",", this.y,
		"L", this.x - (this.radius*Math.sin(rads/2)), ",", this.y - (this.radius*Math.cos(rads/2)),
		"A",this.radius,",",this.radius,
		" 0 ",large_arc_flag,",1",
		this.x + (this.radius*Math.sin(rads/2)), ",", this.y - (this.radius*Math.cos(rads/2)),
		"Z"
	];

	this.element.setAttribute("d", path.join(""));
	transformElement(this.element,"translateZ(0px) translateX(0px) translateY(0px) rotate("+this.rotation+"deg)");
	transformOriginString = this.x + "px " + this.y + "px";
	this.element.style.OTransformOrigin = this.element.style.msTransformOrigin = this.element.style.webkitTransformOrigin = this.element.style.MozTransformOrigin = this.element.style.transformOrigin = transformOriginString;
};

var stepDelay = 1000;

function update(e){

	if (e == "segments"){
		rectangleArrangement = false;
		$("svg path").remove();
		wedges = [];
		initWedges();
	}

	if (e == "rearrange"){

		if (rectangleArrangement == false){

			for ( i = 0 ; i < ui.segments.value ; i++){
				transformElement(wedges[i].element, "translateZ(0px) translateX(0px) translateY(0px) rotate("+wedges[i].rotation+"deg) translateY("+-50+"px)")
			}

			setTimeout(function(){

				quarterValue = ui.segments.value/4;

				for ( i = 0 ; i < ui.segments.value *0.5 ; i++){
					horizOffset = 0.5 * ((i - quarterValue)/quarterValue)*diagramWidth; 
					transformElement(wedges[i].element, "translateX("+horizOffset+"px) translateY(-20px)")
					horizOffsetLower = -horizOffset-(0.5*diagramWidth/(0.5*ui.segments.value));
					transformElement(wedges[i+ui.segments.value*0.5].element, "translateX("+horizOffsetLower+"px) translateY(20px) rotate(180deg)")

				}

				setTimeout(function(){
					vertOffsetCorrection = radius - radius * Math.cos(sectorAngleRad/2);
					vertOffset = radius*0.5;
					vertOffsetCorrected = vertOffset - vertOffsetCorrection;
					for ( i = 0 ; i < ui.segments.value *0.5 ; i++){
						horizOffset = 0.5 * ((i - quarterValue)/quarterValue)*diagramWidth; 
						transformElement(wedges[i].element, "translateX("+horizOffset+"px) translateY("+vertOffset+"px)")
						horizOffsetLower = -horizOffset-(0.5*diagramWidth/(0.5*ui.segments.value));
						
						//NB one side needs the vertOffsetCorrect applied. We've chosen the lower.
						transformElement(wedges[i+ui.segments.value*0.5].element, "translateX("+horizOffsetLower+"px) rotate(180deg) translateY("+vertOffsetCorrected+"px)");
					}
				},stepDelay)

				rectangleArrangement = true;


			}, stepDelay);

		} else {

			quarterValue = ui.segments.value/4;

			for ( i = 0 ; i < ui.segments.value *0.5 ; i++){
				horizOffset = 0.5 * ((i - quarterValue)/quarterValue)*diagramWidth; 
				// wedges[i].element.style.webkitTransform = "translateX("+horizOffset+"px) translateY(-20px)";
				transformElement(wedges[i].element, "translateX("+horizOffset+"px) translateY(-20px)");
				horizOffsetLower = -horizOffset-(0.5*diagramWidth/(0.5*ui.segments.value));
				wedges[i+ui.segments.value*0.5].element.style.webkitTransform = "translateX("+horizOffsetLower+"px) translateY(20px) rotate(180deg)";
				transformElement(wedges[i+ui.segments.value*0.5].element, "translateX("+horizOffsetLower+"px) translateY(20px) rotate(180deg)");

			}

			setTimeout(function(){
				for ( i = 0 ; i < ui.segments.value ; i++){
					// wedges[i].element.style.webkitTransform = "translateZ(0px) translateX(0px) translateY(0px) rotate("+wedges[i].rotation+"deg) translateY("+-50+"px)";
					transformElement(wedges[i].element, "translateZ(0px) translateX(0px) translateY(0px) rotate("+wedges[i].rotation+"deg) translateY("+-50+"px)")
				}

				setTimeout(function(){
					for ( i = 0 ; i < ui.segments.value ; i++){
						// wedges[i].element.style.webkitTransform = "translateZ(0px) translateX(0px) translateY(0px) rotate("+wedges[i].rotation+"deg)";
						transformElement(wedges[i].element, "translateZ(0px) translateX(0px) translateY(0px) rotate("+wedges[i].rotation+"deg)")
					}
				},stepDelay);

				rectangleArrangement = false;

			},stepDelay);

		}


	}
}

var wedges;
var diagramWidth;
var sectorAngleRad;
var labels = {};
var rotation;

$(document).on("uiLoaded", function(){


	$("#demo").append("<svg width='100%' height='600px'><g></g></svg>");
	svg = new SVG();
	wedges = [];
	x = svg.width/2;;
	y = svg.height/2;


	initWedges();

	// labels.x = document.createElementNS(svg.namespace,"text");
	// $("svg g").append(labels.x);
	// labels.x.setAttribute("x",x);
	// labels.x.setAttribute("y",60);

	// $("svg text")
	// 	.css({
	// 		"font-family": "STIXGeneral-Regaular",
	// 		"font-style": "italic",
	// 		"font-size": "30px",
	// 		"color": "#333"
	// 	})
	// 	.html("&pi;r");


});

function initWedges(){
	sectorAngle = 360 / ui.segments.value;
	sectorAngleRad = sectorAngle * Math.PI/ 180;
	rotation = -90 + 0.5*sectorAngle; // ensures that wedges[0] is always the first segment in the upper half
	for ( i = 0 ; i < ui.segments.value ; i++){
		// wedges.push(new Wedge(x,y, rotation, "hsl("+60+", 50%, 50%)"));
		wedges.push(new Wedge(x,y, rotation, "lightblue"));
		rotation += sectorAngle;
		rotation = parseFloat(rotation.toFixed(2));
		// wedges[i].element.style.webkitTransitionDelay = i*25 + "ms";
	}
	diagramWidth = 2 * Math.sin(sectorAngleRad/2) * ui.segments.value * 0.5 * radius;

}