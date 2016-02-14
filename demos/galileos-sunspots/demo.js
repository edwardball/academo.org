var ui = {
	date: {
		title: "Date",
		value: 9,
		units: null,
		range:[1,35],
		resolution:1,
        input: 'hidden'
    },
    animate: {
      title: "Animate",
      value: false
  }
};


var data = [
        //filename, description
        ["ss602-l", "02 June 1613"],
        ["ss603-l", "03 June 1613"],
        ["ss605-l", "05 June 1613"],
        ["ss606-l", "06 June 1613"],
        ["ss607-l", "07 June 1613"],
        ["ss608-l", "08 June 1613"],
        ["ss609-l", "09 June 1613"],
        ["ss610-l", "10 June 1613"],
        ["ss611-l", "11 June 1613"],
        ["ss612-l", "12 June 1613"],
        ["ss613-l", "13 June 1613"],
        ["ss614-l", "14 June 1613"],
        ["ss615-l", "15 June 1613"],
        ["ss616-l", "16 June 1613"],
        ["ss617-l", "17 June 1613"],
        ["ss618-l", "18 June 1613"],
        ["ss619-l", "19 June 1613"],
        ["ss620-l", "20 June 1613"],
        ["ss621-l", "21 June 1613"],
        ["ss622-l", "22 June 1613"],
        ["ss623-l", "23 June 1613"],
        ["ss624-l", "24 June 1613"],
        ["ss625-l", "25 June 1613"],
        ["ss626-l", "26 June 1613"],
        ["ss627-l", "27 June 1613"],
        ["ss628-l", "28 June 1613"],
        ["ss629-l", "29 June 1613"],
        ["ss701-l", "01 July 1613"],
        ["ss702-l", "02 July 1613"],
        ["ss703-l", "03 July 1613"],
        ["ss704-l", "04 July 1613"],
        ["ss705-l", "05 July 1613"],
        ["ss706-l", "06 July 1613"],
        ["ss707-l", "07 July 1613"],
        ["ss708-l", "08 July 1613"]
        ];


        var elements = [];


        demo = document.getElementById('demo');
        demo.style.height =  2/3 * demo.offsetWidth + "px";
        demo.style.height = 400 + "px";




      var directory = "https://s3-us-west-2.amazonaws.com/academo-assets/images/galileo-sunspots";
      // var directory = "/demos/galileos-sunspots/images/JPEG";
      var extension = "jpg";

      var demo = document.getElementById("demo");

      $("#demo").append("<div class='image-wrapper'></div>")



      for (i = 0, length = data.length ; i < length ; i++){
      	elements[i] = document.createElement("img");
      	elements[i].src = directory + '/' + data[i][0] + "." + extension;
      	elements[i].style.opacity = 0;
        // demo.appendChild(elements[i]);
        $(".image-wrapper").append(elements[i]);
        // demo.style.height = elements[0].height + "px";
    }
    elements[data.length - 1].style.opacity = 1;
    // console.log(elements[0].height);
    // demo.style.height = elements[0].height + "px";
    demo.style.height = 400 + "px";


    $(document).on("uiLoaded", function(){

    	$('#ui-container').append("<div class='interface' id='date'></div>");
    });




    function update(prop){

        if (typeof prop != "undefined" && prop == "animate"){
            if (ui.animate.value == true){
                animate();
            } else {
              cancelAnimationFrame(spin);
              spin = null;
          }
      } else {

      }
      bortle_value = Math.floor(ui.date.value);
      opacity = bortle_value % 1;
      opaque_id = Math.floor(bortle_value);
      elements.forEach(function(el){
          el.style.opacity = 0;
      })
      elements[opaque_id-1].style.opacity = 1;
      if (opaque_id < 9) elements[opaque_id].style.opacity = opacity;

      $("#date-interface label").html("<span class='bold'>Date: </span>"+data[bortle_value-1][1]);

      $("#date-interface").val(ui.date.value);

  }

  $(document).ready(function(){

      update();

  });


var spin;
var f= 0;

function animate() {

    spin = window.requestAnimationFrame(animate);
    ui.date.value = ui.date.value*1 + 0.1;
    if (ui.date.value > 35){
        ui.date.value = 1;
    }
    update();
    f++;
    // return spin;
}


$(window).on('resize', function(){
   demo.style.height = elements[0].height + "px";
});