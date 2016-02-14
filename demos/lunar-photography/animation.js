var ui = {
  phase: {
    title: "Phase",
    value: 10,
    units: null,
    range:[1,16],
    resolution:1,
    input: 'hidden'

  },
  animate: {
    title: "Animate",
    value: false
  }
}


window.onload = function () {

  $("#demo").append("<div id='map'></div>");

};

  var spin;

  function update(prop){


    // if (ui.animate.value == true && !spin){
    //   animate()
    // } else {
    //   cancelAnimationFrame(spin);
    //   spin = null;
    //   console.log("cancel");
    // }

    if (typeof prop != "undefined" && prop == "animate"){
        if (ui.animate.value == true){
            animate();
        } else {
          cancelAnimationFrame(spin);
          spin = null;
      }
    }

    n = ui.phase.value;
    $("#map").css("background-position", "0px " + -(n-1)*300 + "px");

  }

  var f = 0;
  var i =0;

  $("label").click(function(){
    alert("test");
  });

  function animate() {

    spin = window.requestAnimationFrame(animate);

    if (f % 7 == 0){
      $("#map").css("background-position", "0px " + -(ui.phase.value-1)*300 + "px")

      if (ui.phase.value >=16){
        ui.phase.value = 1;
      } else {
        ui.phase.value++;
      }

    }
    $("#phase-interface").val(ui.phase.value);

    f++;

    return spin
  }