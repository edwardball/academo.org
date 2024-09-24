 var ui = {
 	month: {
 		title: "Current Month",
 		value: 4,
 		units: null,
 		range:[1,13],
 		resolution:0.01,
 		input: 'hidden'
 	},
 	animate: {
      title: "Animate",
      value: false
  	}
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


function update(prop){


	if (typeof prop != "undefined" && prop == "animate"){
	    if (ui.animate.value == true){
	        animate();
	    } else {
	      cancelAnimationFrame(animateID);
	      animateID = null;
	  }

	 } else {

		currentMonth = ui.month.value;
		opacity = currentMonth % 1;
		opaque_id = Math.floor(currentMonth);
		$('#month-interface label').html("Current Month: " + data[opaque_id-1][0]);
		elements.forEach(function(el){
			el.style.opacity = 0;
		})
		elements[opaque_id-1].style.opacity = 1;
		if (opaque_id < 13) elements[opaque_id].style.opacity = opacity;

		$("#month-interface").val(ui.month.value);

	}
}

$(document).on("uiLoaded", function(){
	update();
})

function animate() {

    animateID = window.requestAnimationFrame(animate);
    ui.month.value = ui.month.value*1 + 0.03;
    if (ui.month.value > 13){
        ui.month.value = 1;
    }
    update();
    // return animateID;
}

