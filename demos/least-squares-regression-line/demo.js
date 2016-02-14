var demo = new Demo({
	ui: {
		dataPoints: {
			title: "Data points",
			value: "x,y\n1,0\n2,3\n5,6\n-1,-9\n6,3\n4,8\n22.1,1",
			// value: "(1,2)",
			type: "userInputTextarea"
		},
		gradient: {
			title: "Gradient",
			value: '',
		    input: 'readonly'
		},
		c: {
			title: "y-intercept",
			value: '',
		    input: 'readonly'
		},
		rSquared: {
			title: "R Squared",
			value: '',
		    input: 'readonly'
		},
		calculate: {
			title: "Calculate",
			type: "button"
		}
	},

	init: function(){

		// var _this = this;

		this.dataset = d3.csv.parse(this.ui.dataPoints.value, function(d){ //data is always read as a string - need to cast to numbers
			return {
				x: +d.x,
				y: +d.y
			}
		});

		//see http://bl.ocks.org/mbostock/3019563
		this.margin = {top: 40, right: 40, bottom: 40, left: 40};
		this.width = 500 - this.margin.left - this.margin.right;
		this.height = 500 - this.margin.top - this.margin.bottom;

		this.svg = d3.select("#demo")
					.append("svg")
					.attr("width", this.width + this.margin.left + this.margin.right)
					.attr("height", this.height + this.margin.top + this.margin.bottom)
				.append("g")
					.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
					
		

		this.xScale = d3.scale.linear()
						.domain([d3.min(this.dataset, function(d){return d.x}), d3.max(this.dataset, function(d){return d.x})])
						.range([0, this.width]);

		this.yScale = d3.scale.linear()
						.domain([d3.min(this.dataset, function(d){return d.y}), d3.max(this.dataset, function(d){return d.y})])
						.range([this.height, 0]);





		this.xAxis = d3.svg.axis()
						.scale(this.xScale)
						.orient("bottom")
						.innerTickSize(-this.height)

		this.yAxis = d3.svg.axis()
						.scale(this.yScale)
						.orient("left")
						.innerTickSize(-this.width)

		this.svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + this.height + ")")
		    .call(this.xAxis);
		this.svg.append("g").attr("class", "y axis")
		    .call(this.yAxis);


		//axis labels
		this.svg.append("text")
		    .attr("class", "x label")
		    .attr("text-anchor", "end")
		    .attr("x", this.width/2)
		    .attr("y", this.height + 30)
		    .text("x");

		this.svg.append("text")
		    .attr("class", "y label")
		    .attr("text-anchor", "end")
		    .attr("x", -20)
		    .attr("y", this.height/2)
		    .text("y");

		this.trendLine = this.svg.append("line").attr("class", "trendline").attr("stroke", "#1abc9c");

		this.update();

	},

	update: function(e){

		this.dataset = d3.csv.parse(this.ui.dataPoints.value, function(d){ //data is always read as a string - need to cast to numbers
			return {
				x: +d.x,
				y: +d.y
			}
		});


		//update domains of scales
		this.xScale.domain(d3.extent(this.dataset, function(d){return d.x}));
		this.yScale.domain(d3.extent(this.dataset, function(d){return d.y}));

		//Update x-axis
		this.svg.select(".x.axis")
		    .transition()
		    .duration(500)
		    .call(this.xAxis);

		//Update y-axis
		this.svg.select(".y.axis")
		    .transition()
		    .duration(500)
		    .call(this.yAxis);

		var circles = this.svg.selectAll("circle")
						.data(this.dataset);


						circles.enter()
						.append("circle")
							.attr("r", 4)
							.attr("fill", "#F90");
						//update
						circles
						.transition()
						.duration(500)
						.attr("cx", function(d){
							return this.xScale(d.x);
						}.bind(this))
						.attr("cy", function(d){
							return this.yScale(d.y);
						}.bind(this))

						//remove ones no longer needed 
						circles.exit().remove();
		
		this.xbar = d3.mean(this.dataset, function(d){
			return d.x;
		});
		this.ybar = d3.mean(this.dataset, function(d){
			return d.y;
		});
		this.xxbar = d3.mean(this.dataset, function(d){
			return d.x * d.x;
		});
		this.xybar = d3.mean(this.dataset, function(d){
			return d.x * d.y;
		});

		this.regression = this.calcRegression(this.xbar, this.ybar, this.xybar, this.xxbar);

		this.m = this.regression.gradient;
		this.c = this.regression.intercept;


		this.trendLine.transition().duration(500).attr({
			x1:this.xScale(d3.min(this.dataset, function(d){
				return d.x;
			})),
			x2:this.xScale(d3.max(this.dataset, function(d){
				return d.x;
			})),
			y1:this.yScale(d3.min(this.dataset, function(d){
				return d.x;
			}) * this.m + this.c),
			y2:this.yScale(d3.max(this.dataset, function(d){
				return d.x;
			}) * this.m + this.c),
		})


		this.ui.gradient.value = this.m;
		this.ui.c.value = this.c;
		this.ui.rSquared.value = this.calcRSquared(this.dataset, this.ybar, this.m, this.c);
		this.updateDisplays();

	},

	updateDisplays: function(){
		$("#gradient-interface input").val(this.ui.gradient.value);
		$("#c-interface input").val(this.ui.c.value);
		$("#rSquared-interface input").val(this.ui.rSquared.value);
	},

	calcMean: function(data){
		var sum = 0;
		for (var i = 0 ; i < data.length ; i++){
			sum += data[i];
		}

		return sum / data.length;
	},

	multiplyArrays: function(array1, array2){
		var array3 = [];
		for (var i = 0 ; i < array1.length ; i++){
			array3[i] = array1[i] * array2[i];
		}

		return array3;
	},

	calcRegression: function(xbar, ybar, xybar, xxbar){
		var gradient = (xbar * ybar - xybar) / (xbar*xbar - xxbar); 
		var intercept = ybar - gradient*xbar; 
		return {
			gradient: gradient,
			intercept: intercept  
		}
	},

	calcRSquared: function(data, ybar, m, c){
		var squaredErrorFromLine = 0;
		var squaredErrorFromMean = 0;
		for (var i = 0 ; i < data.length ; i++){
			squaredErrorFromLine += Math.pow(data[i].y - (data[i].x * m + c), 2);
			squaredErrorFromMean += Math.pow(data[i].y - ybar, 2);
		}

		return 1 - squaredErrorFromLine/squaredErrorFromMean;
	},

	drawLine: function(xMin, xMax, numberOfPoints, gradient, yIntercept){
		var xRange = xMax - xMin;
		var xStep = xRange / numberOfPoints;


		var lineDataX = [];
		var lineDataY = [];
		var i = 0;
		for (var x = xMin ; x <= xMax ; x += xStep, i++){
			lineDataX[i] = x;
			lineDataY[i] = x * gradient + yIntercept;
		}
		console.log(xRange, lineDataX, lineDataY);


		this.graph.plot(lineDataX, lineDataY,'blue', false, true);

	},

	parseUserData: function(){
		var dataString = this.ui.dataPoints.value.replace(/\(/g,"[").replace(/\)/g,"]");
		return JSON.parse("[" + dataString + "]");
	}
});