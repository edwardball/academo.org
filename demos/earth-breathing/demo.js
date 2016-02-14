 var ui = {
 	month: {
 		title: "Current Month",
 		value: 4,
 		units: null,
 		range:[1,13],
 		resolution:0.01,
 		input: 'hidden'
 	},
 };

 var i = 0;
 var move;
 var data = [
	 ["January","jan"],
	 ["February","feb"],
	 ["March","mar"],
	 ["April","apr"],
	 ["May","may"],
	 ["June","jun"],
	 ["July","jul"],
	 ["August","aug"],
	 ["September","sep"],
	 ["October","oct"],
	 ["November","nov"],
	 ["December","dec"],
	 ["January","jan"]
 ]
 var directory = "images";
 var elements = [];

 var demo = document.getElementById("demo");
 demo.style.height =  1/2 * demo.offsetWidth + "px";


 for (i = 0, length = data.length ; i < length ; i++){
 	elements[i] = document.createElement("img");
 	elements[i].src = directory + '/' + data[i][1] + ".jpg";
 	demo.appendChild(elements[i]);
 }


function update(){
	currentMonth = ui.month.value;
	opacity = currentMonth % 1;
	opaque_id = Math.floor(currentMonth);
	$('#month-interface label').html("Current Month: " + data[opaque_id-1][0]);
	elements.forEach(function(el){
		el.style.opacity = 0;
	})
	elements[opaque_id-1].style.opacity = 1;
	if (opaque_id < 13) elements[opaque_id].style.opacity = opacity;
}

$(document).on("uiLoaded", function(){
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