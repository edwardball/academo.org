var demo = new Demo({
	ui: {
		expression: {
				title: "Expression",
				value: "x^2 + 1",
				type: "userInputString",
				prepend: "y = "
			},
		numberOfTraps: {
			title: "Number of Trapezoids",
			value: 4,
			type: "userInputNumerical",
			
		},
		start: {
			title: "Start",
			value: 0,
			type: "userInputNumerical",
			prepend: "y = "
		},
		end: {
			title: "End",
			value: 2,
			type: "userInputNumerical",
			prepend: "y = "
		},
		button: {
			title: "Update",
			type: "button"
		}
	},

	calculateTrendline: function(){
		this.trendline = [];

		for (var i = this.ui.start.value ; i <= this.ui.end.value ; i+=this.h/100){
  			this.trendline.push({
    			x: i, 
    			y: this.expr.evaluate({x:i})
  			})
		}

		console.log("updated trendline:", this.trendline);
	},

	calculateTrapezia: function(){
		this.datasetTrapezium = [];
		// for (var i = this.ui.start.value ; i <= this.ui.end.value ; i += this.h){
		for (var i = 0 ; i <= this.ui.numberOfTraps.value ; i++){
  			this.datasetTrapezium.push({
    			x: this.ui.start.value + i*this.h, 
    			y: this.expr.evaluate({x:(this.ui.start.value + i*this.h)})
  			})
  		}


	},

	findMinimum: function(){
		this.minimum = Infinity;
		for (var i = 0 ; i < this.datasetTrapezium.length ; i++){
			if (this.datasetTrapezium[i].y < this.minimum){
				this.minimum = this.datasetTrapezium[i].y;
			}
		}

	},

	findMaximum: function(){
		this.maximum = 0;
		for (var i = 0 ; i < this.datasetTrapezium.length ; i++){
			if (this.datasetTrapezium[i].y > this.maximum){
				this.maximum = this.datasetTrapezium[i].y;
			}
		}

	},

	updateChart: function(){

	  this.h = (this.ui.end.value - this.ui.start.value) / this.ui.numberOfTraps.value;

	  this.calculateTrendline();
	  this.calculateTrapezia();
	  this.findMinimum();
	  this.findMaximum();
	  this.myChart.options.scales.y.min = this.minimum > 0 ? 0 : this.minimum;
      this.myChart.options.scales.y.max = this.maximum < 0 ? 0 : this.maximum;

      this.myChart.data.datasets[0].data = this.trendline;

      this.myChart.data.datasets[1].data = this.datasetTrapezium;

      this.myChart.update();
	},

	updateTable: function(){
		$(".js-trapezium-table tbody").empty();
    	_this = this;
		this.datasetTrapezium.forEach(function(value, index){
			if ((index == 0) || (index == _this.datasetTrapezium.length - 1)){
  				_this.TotaltrapeziumArea += value.y;  
			} else {
    			_this.TotaltrapeziumArea += 2 * value.y;
			}
  
	  	if (index < _this.datasetTrapezium.length - 1){
	  		var rowHTML = "<tr><td>Trapezium "; 
	  		rowHTML += (index + 1);
	  		rowHTML += "</td><td>0.5 &times;  (";
	  		rowHTML +=  value.y.toFixed(3);
	  		rowHTML += " + ";
	  		rowHTML += (_this.datasetTrapezium[index+1].y).toFixed(3);
	  		rowHTML += ") &times; ";
	  		rowHTML += (_this.h).toFixed(3);
	  		rowHTML += "</td><td>";
			rowHTML += (0.5 * (value.y + _this.datasetTrapezium[index+1].y) * (_this.h)).toFixed(3); 
	  		rowHTML += "</td></tr>";
	    	$(".js-trapezium-table tbody").append(rowHTML)
	  	}
  
	})

    $(".js-trapezium-table tbody").append("<tr><td colspan='2' style='text-align:right;'><strong>Sum of all Trapezium areas</strong></td><td><strong>"+(this.TotaltrapeziumArea*0.5*this.h).toFixed(3)+"</strong></td></tr>")
	},

	parseExpression: function(){
		var enteredExpression = this.ui.expression.value.trim();
		try{
			this.node = math.parse(enteredExpression); 
			this.expr = this.node.compile();
		} catch(e) {
			alert("Sorry, we didn't recognise the expression you entered. Please try again.")
		}
	},

	init: function(){
		this.h = (this.ui.end.value - this.ui.start.value)/this.ui.numberOfTraps.value;
		$(".js-trapezium-width").html(this.h.toFixed(3));

		this.parseExpression();


		this.calculateTrendline();
		this.calculateTrapezia();
		this.findMinimum();
		this.findMaximum();


		this.TotaltrapeziumArea = 0;

    	this.updateTable();
    	// this.update();



const data = {
  datasets: [{
    showLine: true,
    data: this.trendline,
    pointRadius: 0,
    borderColor: "#0f5be5",
  },{
    showLine: true,
    data: this.datasetTrapezium,
    backgroundColor: 'rgb(255, 99, 132, 0.5)',
    pointBackgroundColor: "red",
    pointRadius: 4,
    fill: true,
  }],
};


const config = {
  type: 'scatter',
  data: data,
  plugins: [{
    /* https://stackoverflow.com/questions/60199180/chart-js-draw-y-axis-only-up-to-point */
    afterDraw: chart => {
      console.log("afterdraw", chart);
      var ctx = chart.ctx; 
      var xAxis = chart.scales['x'];
      var yAxis = chart.scales['y'];
      
       for (var i = this.ui.start.value ; i <= this.ui.end.value ; i += this.h){
         var x = xAxis.getPixelForValue(i);             
         var yTop = yAxis.getPixelForValue(this.expr.evaluate({x:i}));  
         ctx.save();
         ctx.setLineDash([10, 5]);
         ctx.strokeStyle = '#888888';
         // ctx.strokeStyle = '#000';
         // ctx.lineWidth = 2;
         ctx.beginPath();
         ctx.moveTo(x, yAxis.getPixelForValue(0));             
         ctx.lineTo(x, yTop);
         ctx.stroke();
         ctx.restore();
       }    
    }
  }],
  options: {
  	clip: false,/*stops points getting cut off near edge*/
  	animation: false,
    plugins: {
      legend: {display: false},
      tooltip: {
        filter: function (tooltipItem) { 
          return tooltipItem.datasetIndex === 1
        }
      }
    },
    scales: {
      y: {
      	min: this.minimum > 0 ? 0 : this.minimum,
      	max: this.max < 0 ? 0 : this.maximum,
        title: {
          text: "y",          
          display: true,
        }
      },
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
            text: "x",          
            display: true,
        }
      }
    }
  }
};



var chartCanvasWrapper = document.createElement("div");
chartCanvasWrapper.id = "myChartWrapper";
    var chartCanvas = document.createElement("canvas");

    chartCanvas.id = "myChart";
    $("#demo").append(chartCanvasWrapper);
    $("#myChartWrapper").append(chartCanvas);

ctx2 = document.getElementById("myChart").getContext("2d");
this.myChart = new Chart(ctx2, config);



	},

	update: function(e){
		this.TotaltrapeziumArea = 0;
		$(".js-trapezium-width").html(this.h.toFixed(3));
		this.parseExpression();
		this.updateChart();
		this.updateTable();
		this.findMinimum();
	},
    

});