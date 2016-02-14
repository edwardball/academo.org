ui = {
	dieCount: {
		title: "Number of dice",
		range: [1,6],
		value: 1,
		resolution: 1,
		step: 1

	},
	roll: {
		title: "Roll",
		type: "button"
	},
	autoRoll: {
		title: "Roll automatically",
		value: false
	},
};

var diceRolls = 0;
var dieValues = [1,2,3,4,5,6];
var barSpacing = 2;
var durationPeriod = 100;

$(document).on("uiLoaded", function(){

	$("#demo").append("<div class='dice-wrapper'><div class='js-die'></div></div>");
	$("#demo").append("<div class='dice-rolls-wrapper'>Number of rolls: <span class='js-dice-rolls'>1</span></div>");
	$("#demo").append("<div id='js-chart'></div>");
	svg = d3.select("#js-chart").append("svg");

	    svg.attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	
	graphCanvas = svg.append("g")
		    .attr("transform", 
	          "translate(" + margin.left + "," + margin.top + ")");


	graphCanvas.append("g").attr('class', 'y-axis');
	graphCanvas.append("g").attr('class', 'x-axis').attr("transform", "translate(0, "+ (height) +")");



	graphCanvas.append("text")
	    .attr("class", "x-label")
	    .attr("text-anchor", "middle")
	    .attr("x", 300)
	    .attr("y",  height + margin.bottom * 0.75)
	    .text("Dice roll result");


	graphCanvas.append("text")
	    .attr("class", "y-label")
	    .attr("text-anchor", "middle")
	    .attr("x", 0)
	    .attr("y",  height*0.5)
	    .attr("transform", 'rotate(-90, '+ 0+','+ height*0.5+ ') translate(0,-30)')
	    .text("Frequency");

	setupChart();
	$(".js-die").dice({  
	    size: 100, // in pixels  
	    val: 3, // 1, 2, 3, 4, 5, 6  
	    rotation: 0 // O to 359 deg  
	});  
	update();
});

function update(e){
	range = diceMinMax(ui.dieCount.value);


	if (ui.autoRoll.value == true){
		durationPeriod = 0;
		setTimeout(update,100);
	} else {
		durationPeriod = 100;
	}

	if (e == "dieCount"){
		diceRolls = 0;
		data = [];
		for (i = 0 ; i < range[0] ; i++){ //fill initial values with 0s. Eg if 6 dice, results 1,2,3,4,5 will also be 0
			data[i] = 0;
		}
		for (i = range[0] ; i < range[1] ; i++){
			data[i] = 0;
		}
		// data = [];
		svg.selectAll("rect").remove();
		setupChart();
		$(".js-die").remove();
		$(".js-dice-rolls").html(0);
		for (i = 0 ; i < ui.dieCount.value; i++){
			$(".dice-wrapper").append("<div class='js-die'></div>");
			$(".js-die").eq(i).dice({
				val: dieValues[i],
			}); 
		}
	} else {
		diceRolls++;
		runningTotal = 0;
		for (i = 0 ; i < ui.dieCount.value; i++){
			newValue = shuffle(dieValues)[0]; 
			$(".js-die").eq(i).dice({
				val: newValue,
			});
			runningTotal += newValue;

		}
		data[runningTotal-1] = data[runningTotal-1] + 1; 
	


	yScale = d3.scale.linear()
					.domain([0, d3.max(data)])
					// .range([0, 300- margin.top - margin.bottom]);
					.range([0, 300- margin.top - margin.bottom]);

	xScale = d3.scale.linear()
					.domain([0, data.length])
					// .range([0, 300- margin.top - margin.bottom]);
					.range([0, 600 - margin.left - margin.right]);


	yAxisScale = d3.scale.linear()
		.domain([0, d3.max(data)])
		// .range([0, 300- margin.top - margin.bottom]);
		.range([300- margin.top - margin.bottom,0]);

	yAxis = d3.svg.axis().scale(yAxisScale).orient("left").tickFormat(d3.format("d"));;
	xAxis = d3.svg.axis().scale(xScale).ticks(range[1]).orient("bottom");

	svg.selectAll("rect")
	.data(data)
		.transition()
		.duration(durationPeriod)
		.attr("y", function(d) { return height - yScale(d); })
		.attr("x", function(d, i) { return xScale(i+1) -5; })
		// .attr("height", function(d) { return height - y(d.value); });
		.attr("height", function(d) { return yScale(d); });
		svg.selectAll(".y-axis").call(yAxis);
		svg.selectAll(".x-axis").call(xAxis);


	}
	$(".js-dice-rolls").html(diceRolls);


}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


var data = [0,0,0,0,0,0];

var svg, yScale, yAxis;



var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

//d3


function setupChart(){

  graphCanvas.selectAll("rect")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d,i) { return i * (10 + barSpacing) -5; })
      .attr("width", 10)   
      .attr("y", function(d) { return height - d*10; })
      .attr("height", function(d) { return d*10; });

}

function diceMinMax(n){
	return [n, 6*n]
}
