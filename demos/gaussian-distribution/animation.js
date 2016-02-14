ui = {
	mean1: {
		title: "\\( \\mu_{1} \\)",
		value: 0,
		range: [-10,10],
		color: "#5bccf6"
	},
	stdev1: {
		title: "\\( \\sigma_{1} \\)",
		value: 1,
		range: [0,3],
		color: "#5bccf6"
	},
	mean2: {
		title: "\\( \\mu_{2} \\)",
		value: .5,
		range: [-10,10],
		color: "#d8e750"
	},
	stdev2: {
		title: "\\( \\sigma_{2} \\)",
		value: 2,
		range: [0,3],
		color: "#d8e750"
	}
};

$(document).on("uiLoaded", function(){
	$("#demo").append("<div id='graph-container'></div>");
	graph_dom = document.getElementById('graph-container');
	graph_dom.style.height =  2/3 * graph_dom.offsetWidth + "px";


  // Container div:
  var graph_dom = document.getElementById('graph-container')
      // First data series:
      d1 = [],
      d2 = [],
      options = {
      	xaxis: {
      		minorTickFreq: 4
      	},
      	grid: {
      		minorVerticalLines: true
      	}
      }

      update();
  });



function update(){
	animate();
}



var numPoints = 100;
var increment = (ui.stdev1.range[1] - ui.stdev1.range[0]) / numPoints;


function gaussian(x, mean, stdev){
	var exponent = -0.5 * Math.pow(x-mean,2) / Math.pow(stdev,2);
	return Math.exp(exponent)*(1/stdev) * (1/(Math.sqrt(2*Math.PI)));
}


function animate () {

	//need this to count
	i = 0;
	// starting value for x
	start = -10;
	for (x = start; x < numPoints; x = x+increment) {
		d1[i] = [x, gaussian(x, ui.mean1.value, ui.stdev1.value)];
		d2[i] = [x, gaussian(x, ui.mean2.value, ui.stdev2.value)];
		i++;
	}

	data = [
		{data : d1},
		{data : d2}
	];

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
			title: "f(x,μ,σ)",
			titleAngle: 90,
			showLables: true,
			max: 1,
			min: 0,
		},
		preventDefault: false, //allows scrolling on touch screen devices instead of preventing scrolling
		xaxis : {
			title: "x",
			showLabels: true,
			max: 10,
			min: -10,
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