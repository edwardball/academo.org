var pivot1 = {},
pivot2 = {},
pivot3 = {},
pivot4 = {};


	var demo = new Demo({
		ui: {
			angle: {
				title: "Angle <span style='font-family:times;text-transform:none'>α</span>",
				value: 90,
				type: "userInputNumerical"
			},
			length4: { //length 1 & 4 swapped so labels go clockwise
				title: "Length AB",
				value: 100,
				type: "userInputNumerical"
			},
			length3: {
				title: "Length BC",
				value: 100,
				range: [0,3],
				type: "userInputNumerical"
			},
			length2: {
				title: "Length CD",
				value: 100,
				range: [-10,10],
				type: "userInputNumerical"
			},
			length1: {
				title: "Length DA",
				value: 100,
				range: [0,3],
				type: "userInputNumerical"
			},
			calculate: {
				title: "Calculate",
				type: "button"
			}
		},

		width: Math.round($("#demo").width()),
		height: Math.round($("#demo").width()),

		init: function(){
			$("#demo").append($("#quad-area"));
			$("#demo").append($("#quadrilateral-area"));
			$("#quadrilateral-area").attr("width", this.width).attr("height", this.height);
			// $("#quadrilateral-area path").attr("transform", "translate("+$("#demo").width()/2+" "+$("#demo").width()*.67*.5+")")
			this.update();

		},

		calcArea: function(){
			a = parseFloat(this.ui.length1.value);
			b = parseFloat(this.ui.length2.value);
			c = parseFloat(this.ui.length3.value);
			d = parseFloat(this.ui.length4.value);
			s = 0.5 * (a + b +c + d);
			console.log(s);
			alpha = this.ui.angle.value * Math.PI / 180;
			gamma = find_angle(pivot4, pivot3, pivot2);

			return Math.sqrt((s-a)*(s-b)*(s-c)*(s-d) - a*b*c*d * Math.pow(Math.cos(0.5*(alpha + gamma)),2));

		},

		update: function(e){
			pivot1.angle = this.ui.angle.value;//ui.angle.value;
			length1 = this.ui.length1.value;//ui.length1.value;
			length2 = this.ui.length2.value;//ui.length2.value;
			length3 = this.ui.length3.value;//ui.length3.value;
			length4 = this.ui.length4.value;//ui.length4.value;

			pivot1 = {
				x: 0,
				y: 0,
				angle: pivot1.angle
			}




			pivot2 = {
				x: pivot1.x + length1 * Math.cos(pivot1.angle * Math.PI / 180),
				y: pivot1.y + length1 * Math.sin(pivot1.angle * Math.PI / 180)
			}

			calcPivotLocations(true);
			draw();

			angleDCB = find_angle(pivot4, pivot3, pivot2);
			console.log("DCB: ", angleDCB * 180 / Math.PI);









			if (angleBetween(pivot1, pivot2, true) < angleBetween(pivot1, pivot3, true) || pivot2.x > pivot3.x || angleBetween(pivot3, pivot4, true) > 0 && angleBetween(pivot3, pivot4, true)<=180){
				//try alternative solution
				calcPivotLocations(false);
				draw();
				if (angleBetween(pivot1, pivot2, true) < angleBetween(pivot1, pivot3, true) || pivot2.x > pivot3.x || angleBetween(pivot3, pivot4, true) > 0 && angleBetween(pivot3, pivot4, true)<=180){
					$("#quad-area").html("Area: Measurements not valid");
				} else {
					console.log("Convex")
					$("#quad-area").html("Area: " + this.calcArea());
				}

			} else {
				console.log("Convex");
				$("#quad-area").html("Area: " + this.calcArea());
			}

			// console.log(this.calcArea());

		}
	});



function dist(point1,point2){
	dx = Math.abs(point1.x - point2.x);
	dy = Math.abs(point1.y - point2.y);
	return Math.sqrt(dx*dx + dy*dy);
}

function angleBetween(point1, point2, deg){
	//find angle from vertical
	dx = (point2.x - point1.x);
	dy = (point2.y - point1.y);
	if (deg){
		return Math.atan2(dy, dx) * 180 / Math.PI;
	} else {
		return Math.atan2(dy, dx);
	}

}

 /*
 * Calculates the angle ABC (in radians) 
 *
 * A first point
 * C second point
 * B center point
 */
 //http://stackoverflow.com/questions/17763392/how-to-calculate-in-javascript-angle-between-3-points
 // cosine rule
function find_angle(A,B,C) {
    var AB = Math.sqrt(Math.pow(B.x-A.x,2)+ Math.pow(B.y-A.y,2));    
    var BC = Math.sqrt(Math.pow(B.x-C.x,2)+ Math.pow(B.y-C.y,2)); 
    var AC = Math.sqrt(Math.pow(C.x-A.x,2)+ Math.pow(C.y-A.y,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}


function calcPivotLocations(positive){
	//S,P,Q,R and variables used to calculate the position of the third pivot. derived from equation to find intersection of two circles
	S = (Math.pow(length1,2) - Math.pow(length2,2) + Math.pow(length3,2) - Math.pow(length4,2)) / (2*(pivot2.x - length4));
	P = Math.pow(pivot2.y,2) / Math.pow((pivot2.x - length4),2) + 1;
	Q = 2 * pivot2.y * (length4 - S) / (pivot2.x - length4);
	R = Math.pow(length4 - S, 2) - Math.pow(length3,2);


	if (positive){
		by = (-Q + Math.sqrt(Q*Q - 4*P*R))/(2*P);
	} else {
		by = (-Q - Math.sqrt(Q*Q - 4*P*R))/(2*P);
	}
	bx = S- 2*pivot2.y*by / (2*(pivot2.x - length4));

	
	pivot3 = {
		x: bx,
		y: by
	}

	pivot4 = {
		x: pivot1.x + length4,
		y: pivot1.y
	}
}

function draw(){

	largestX = 0;
	largestY = 0;
	smallestX = 0;
	smallestY = 0;
	for (i = 1 ; i < 5 ; i++){
		if (window["pivot"+i].x > largestX){
			largestX = window["pivot"+i].x
		}
		if (window["pivot"+i].y > largestY){
			largestY = window["pivot"+i].y
		}

		if (window["pivot"+i].x < smallestX){
			smallestX = window["pivot"+i].x	
		}
		if (window["pivot"+i].y < smallestY){
			smallestY = window["pivot"+i].y	
		}
	}

	xRange = largestX -smallestX;
	yRange = largestY -smallestY;

	if (pivot2.x < pivot1.x){
		midPoint = {x:xRange/2 - (pivot1.x - pivot2.x), y:yRange/2};
	} else {
		midPoint = {x:xRange/2, y:yRange/2};
	}

	for (i = 1 ; i < 5 ; i++){
		window["plot"+i] = {
			x:window["pivot"+i].x - midPoint.x,
			y:window["pivot"+i].y - midPoint.y
		}
	}



	// offsetX = xRange - $("#demo").width();


	// if (pivot2.x < pivot1.x){ //need to translate forward
	// 	translateXDirection = +1 
	// 	horizOffset = pivot2.x - pivot1.x;
	// } else {
	// 	translateXDirection = -1;
	// 	horizOffset = 0;
	// }

	if (xRange > yRange){
		scale = $("#demo").width()*.5 / xRange;
	// 	translateX = $("#demo").width()/2 + xRange*0.5*scale*translateXDirection;
	// 	translateY = $("#demo").width()/2 - yRange*0.5*scale;
	} else {
		scale = $("#demo").width()*.5 / yRange;
	// 	translateX = $("#demo").width()/2 + xRange*0.5*scale*translateXDirection;
	// 	translateY = $("#demo").width()/2 - yRange*0.5*scale;
	}


	$("#scaler").attr("transform", "scale("+scale+")");

	// $("#quadrilateral-area path").attr("transform", "translate("+$("#demo").width()/2+" "+$("#demo").width()*.5+")")
	$("#translator").attr("transform", "translate("+$("#demo").width()/2+" "+$("#demo").height()/2+")")


	pathData = "M" +plot1.x+","+plot1.y + "L" + plot2.x +"," + plot2.y +"L"+ plot3.x+"," + plot3.y +"L" + plot4.x+","+ plot4.y +"z";

	$("svg path").attr("d", pathData);
	$("svg path").attr("stroke-width", 1/scale);
	$("#text-a").attr("x", plot1.x-10/scale).attr("y", plot1.y).attr("font-size", 20/scale);
	$("#text-alpha").attr("x", plot1.x + 10/scale).attr("y", plot1.y+15/scale).attr("font-size", 20/scale);
	$("#text-d").attr("x", plot2.x-10/scale).attr("y", plot2.y + 10/scale).attr("font-size", 20/scale); //swap B & D to go round clockwise
	$("#text-c").attr("x", plot3.x).attr("y", plot3.y + 10/scale).attr("font-size", 20/scale);
	$("#text-b").attr("x", plot4.x).attr("y", plot4.y).attr("font-size", 20/scale);
}
