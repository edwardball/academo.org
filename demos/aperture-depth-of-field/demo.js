 var ui = {
 	month: {
 		title: "Current Month",
 		value: 1,
 		units: null,
 		range:[1,8],
 		resolution:1,
 		step: 1,
 		input: 'hidden'
 	},
 };

 var i = 0;
 var move;
 var data = [
	 ["f/1.8","1-8"],
	 ["f/2.8","2-8"],
	 ["f/4","4"],
	 ["f/5.6","5-6"],
	 ["f/8","8"],
	 ["f/11","11"],
	 ["f/16","16"],
	 ["f/22","22"],
 ]


function update(){
	currentMonth = ui.month.value;
	opacity = currentMonth % 1;
	opaque_id = Math.floor(currentMonth);

	$('#month-interface label').html("Current Aperture: <span class='f-number'>" + data[opaque_id-1][0]+"</span>");
	elements.forEach(function(el){
		el.style.opacity = 0;
	})
	elements[opaque_id-1].style.opacity = 1;
	// if (opaque_id < 13) elements[opaque_id].style.opacity = opacity;

	$(".aperture").css("background", "#AAA");
	$(".aperture").eq(currentMonth - 1).css("background", "lightblue");
}

$(document).on("uiLoaded", function(){

	directory = assetPath + "/demos/aperture-depth-of-field/images";
	elements = [];

	demo = document.getElementById("demo");

	$("#ui-container").append("<div class='aperture-diagrams'></div>")

	for (i = 0, length = data.length ; i < length ; i++){
		elements[i] = document.createElement("img");
		elements[i].src = directory + '/' + data[i][1] + ".jpg";
		demo.appendChild(elements[i]);
		size = data[i][1].replace("-", ".");
		width = 100 / parseFloat(size);
		$(".aperture-diagrams").append("<div class='aperture' style='width:"+width+"px;height:"+width+"px;'></div>")
	}

	demo.style.height =  ($("#demo").width() * 665/950) + 20 + "px";


	update();
})


//Animation, disabled for the time being
// $("#checkbox1").change(function(){
// 	if ($(this).prop("checked")){
// 		animate();
// 		console.log("start")
// 	} else {
// 		cancelRequestAnimFrame(move);
// 		console.log("stop")
// 	}
// });