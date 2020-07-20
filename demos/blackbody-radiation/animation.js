var ui = {
	temperature1: {
		title: "Temperature 1",
		value: 5000,
		units: "K",
		range:[2000,7000],
		resolution:1,
    color: "lightblue"
	},
	temperature2: {
		title: "Temperature 2",
		value: 6000,
		units: "K",
		range:[2000,7000],
		resolution:1,
    color: "lightgreen"
	},
	wien: {
		title: "Display Wien's Displacement Law?",
		value: true,
		units: null

	}
};

var settings = {
  // colorScheme: "dark"
}



$("#demo").append("<div id='graph-container'></div>")

graph_dom = document.getElementById('graph-container');
// console.log(graph_dom.offsetWidth)




function update(){
	animate();
}

$(document).ready(function(){
  // if ($("body").data('full')){
	if ($("body").hasClass('fullscreen')){
		graph_dom.style.height  = $(window).height() + "px";
	} else {
		graph_dom.style.height =  2/3 * graph_dom.offsetWidth + "px";
	}
	update();
})


var
    // Container div:
    container = document.getElementById("graph-container"),
    // First data series:
    d1 = [],
    // Second data series:
    d2 = [],
    // A couple flotr configuration options:
    options = {
    	xaxis: {
    		minorTickFreq: 4
    	},
    	grid: {
    		minorVerticalLines: true
    	}
    },
    i, graph;



    function animate () {


      graph_dom = document.getElementById('graph-container');
      if ($("body").hasClass('fullscreen')){
        // 40 is padding
        graph_dom.style.height  = $(window).height() - 40 + "px";
      } else {
        graph_dom.style.height =  2/3 * graph_dom.offsetWidth + "px";
        $("#demo").height(2/3 * graph_dom.offsetWidth + "px");
      }

    	d1 = [];
    	d2 = [];
    	d3 = [];



    	h = 6.626 * Math.pow(10, -34);
    	c = 3*Math.pow(10,8);
    	k = 1.38 * Math.pow(10, -23);
    	T = ui.temperature1.value;
    	T2 = ui.temperature2.value;
    	b = 2.8977685 * 0.001


    	lambda = 1*Math.pow(10,-9);
    	temp = 1000;
    	for (u = 0; u < 300; u = u+1) {


            d1.push([lambda * 1000000000, 0.001 * 0.000000001 * (2*h*c*c/(Math.pow(lambda,5)))*(1/(Math.exp(h*c/(lambda*k*T))-1))]); //kW per steradian per square meter per nanometer
            d2.push([lambda * 1000000000, 0.001 * 0.000000001 * (2*h*c*c/(Math.pow(lambda,5)))*(1/(Math.exp(h*c/(lambda*k*T2))-1))]); //kW per steradian per square meter per nanometer

            lambda_max = 2.897 * 0.001 / temp;

            d3.push([lambda_max * 1000000000 ,0.001 * 0.000000001 * (2*h*c*c/(Math.pow(lambda_max,5)))*(1/(Math.exp(h*c/(lambda_max*k*temp))-1))])


            lambda += Math.pow(10,-8);
            temp +=20;


        }

        data = [
        { data : d1},
        { data : d2},
         ];
         if (ui.wien.value === true){
              	data.push({data: d3})
          }



          // Draw Graph
          graph = Flotr.draw(document.getElementById("graph-container"), data, {
          	legend : {
                  position : 'ne',            // Position the legend 'south-east'.
                  backgroundColor : '#D2E8FF' // A light blue background color.
              },
              shadowSize: 0,
              HtmlText: false,
              fontSize: 10,
              yaxis : {
              	title: "Spectral Radiance (kW sr\u207B\u2071 m\u207B\u00B2 nm\u207B\u2071)",
              	titleAngle: 90,
              	showLables: true,

              max : 51,
              min : 0,

          },
          preventDefault: false, //allows scrolling on touch screen devices instead of preventing scrolling
          xaxis : {

          	title: "<span class='expression'>&lambda;</span> (nm)",
          	title: "\u03BB (nm)",
          	showLabels: true,
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

}




window.onresize = function(){
	// graph_dom = document.getElementById('graph-container');
	// console.log(graph_dom.offsetWidth)
	// graph_dom.style.height =  2/3 * graph_dom.offsetWidth + "px";
	animate();


};

