var ui = {
  a: {
    title: "a",
    value: 2,
    units: null,
    range:[1,4],
    resolution:0.01
  }
};


var graph_dom = document.getElementById('demo');

// $(document).ready(function(){
  if ($("body").data('full')){
    graph_dom.style.height  = $(window).height() + "px";
  } else {
    graph_dom.style.height =  2/3 * graph_dom.offsetWidth + "px";
  }
  animate();
// })


function update(){
  animate();
}


      // var canvas = document.getElementById('canvas'),
      // context = canvas.getContext('2d');


     // Container div:
    var container = document.getElementById("demo"),
    // First data series:
    d1 = [],
    // Second data series:
    d2 = [],
    // A couple flotr configuration options:
    options = {
      title: "Y=aˣ",
      xaxis: {
        minorTickFreq: 4
      },
      grid: {
        minorVerticalLines: true
      }
    },
    i, graph;



         // Draw a sine curve at time t
        function animate () {
          //requestAnimationFrame(animate);
          // console.log("animate");

          // data = {};
          d1 = [];
          d2 = [];
          d3 = [];

          // offset = 2 * Math.PI * (t - start) / 10000;

          // Sample the sine function

a = ui.a.value;
x = -5;
y = 0;
          for (u = 0; u <= 200; u++) {


            d1.push([x, Math.pow(a,x)]); //kW per steradian per square meter per nanometer
            d2.push([x, (Math.pow(a,x)-Math.pow(a,x-0.0001))/0.0001 ]); //kW per steradian per square meter per nanometer


            // y +0.01;
            y +=.05;
            // x += 0.01;
            x += .05;

          }
          // console.log(d1[998]);

          // console.log(d1);


          // Draw Graph
          // graph = Flotr.draw(container, [ d1, d2 ], {
          graph = Flotr.draw(document.getElementById("demo"), [ d1, d2 ], {
            shadowSize: 0,
            // title: "y=aˣ",
            yaxis : {
              title: "y",
              showLabels: true,
              // ticks: [[0,""],[5,"0"],[10,"0"],[15,"0"]],
              // minorTIcks: true,
              max : 5,
               min : 0,
              // minorTickFreq : 4,

              // scaling: "logarithmic"
            },
            xaxis : {
              title: "x",
              showLabels: true,
              max : 5,
               min : -5,
              // scaling: "logarithmic"

              // max : 2000,
               // minorTickFreq : 4
            },
            grid : {
              minorVerticalLines: true,
              minorHorizontalLines: true
            },
            mouse : {
              track:true,
              sensibility: 10,
              radius: 5,
              trackDecimals: 3
            }
          });
          // t += settings.speed;

          // Animate
          // setTimeout(function () {
          //   animate(-(new Date).getTime());
          // }, 50);
        }


