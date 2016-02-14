//////////
// http://stackoverflow.com/questions/1397329/how-to-remove-the-hash-from-window-location-with-javascript-without-page-refresh

function removeHash () {
  history.pushState("", document.title, window.location.pathname + window.location.search);
    // window.location.hash = ''; // for older browsers, leaves a # behind
    // history.replaceState('', document.title, window.location.pathname); // nice and clean
    // e.preventDefault(); // no page reload
  }


    var hash = window.location.hash.substring(1);
    if (hash == 'full') {
    // console.log(window.location.hash)
    addControls();
    $("body").addClass("fullscreen");

    window.scrollTo(0,0);

    $("#ui-container").appendTo("body");
  } else {
    $("body").removeClass("fullscreen");
  }

  var sliderOpen;
  var p;
  var size;
  function addControls(){
    $('#ui-container').append('<button id="exit-fullscreen" class="clean-gray">Exit full page mode.</button><button id="toggle-controls" class="clean-gray">Hide Controls</button>');

    sliderOpen = true;

    $("#toggle-controls").click(function(){
      toggle();

    });

  }

  function toggle(){


    if (sliderOpen == true){

      p = $("#ui-container").position();
      $("#ui-container").animate({width:150}, 100, function(){
        size = $("#ui-container").height();
        size -= 20;
        $("#toggle-controls").html("Show Controls");
        $("#ui-container").animate({top: -size + 'px'},125);
        sliderOpen = false;

      });


    } else {

      p = $("#ui-container").position();
      $("#ui-container").animate({width:270}, 100, function(){
        size = $("#ui-container").height();
        size -= 20;
        $("#toggle-controls").html("Hide Controls");
        $("#ui-container").animate({top: '0px'},125);
        sliderOpen = true;

      });

    }
  }


  $("#full-link").click(function(e){
    // e.preventDefault();
    addControls();

    $("body").addClass("fullscreen");

    $("#demo").height($(window).height());

    window.location.hash = 'full';

    window.scrollTo(0,0);

    if ($('#ui-container').length > 0) {
        // it exists
        $("#ui-container").appendTo("body");
      } else {
        $("body").append('<div class="span3 clearfix" id="ui-container"><button id="exit-fullscreen" class="clean-gray">Exit full page mode.</button></div>');
      }

      //

    // alert("entering fullscreen");
    // var demoContents = $("#demo").html();
    // $("body").html("<div id='demo'>"+demoContents+"</div>");

    // backup = $('body').clone();

    // $(".navbar").hide();

    // http://stackoverflow.com/questions/1535331/how-to-hide-all-elements-except-one-using-jquery

    // $('body > :not(#demo)').hide(); //hide all nodes directly under the body
    // $('#demo').appendTo('body');


    // $("#demo").width($(window).width());
    // $("#demo").height($(window).height());
    update();
  });

$("body").on('click', '#exit-fullscreen', function(e){
  e.preventDefault();
  // console.log('hello')
  $("body").removeClass("fullscreen");
  $("#demo").after($("#ui-container"));
  $("#exit-fullscreen").remove();
  $("#toggle-controls").remove();
  removeHash();
  update();
});


if ("onhashchange" in window) {
    // alert("The browser supports the hashchange event!");
  }


  function locationHashChanged() {
    if (!location.hash) {
      $("body").removeClass("fullscreen");
      $("#demo").after($("#ui-container"));
      update();
    }
  }

  window.onhashchange = locationHashChanged;


  if (typeof variable === 'undefined') {
    // variable is undefined
  } else {
    if (settings.colorScheme == "dark"){
      $("#ui-container").addClass("dark");
    }
  }

  if (window.location.hash == '#full'){
    $("#demo").height($(window).height());
    $("body").addClass("fullscreen");

  }
