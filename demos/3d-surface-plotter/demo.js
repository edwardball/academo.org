
	var demo = new Demo({
		ui: {
			expression: {
				title: "Expression",
				value: "x*x - y*y",
				type: "userInputString"
			},
			xRange: {
				title: "x Range (min, max)",
				value: "-50, 50",
				type: "userInputString"
			},
			yRange: {
				title: "y Range (min, max)",
				value: "-50, 50",
				type: "userInputString"
			},
			resolution: {
				title: "Resolution",
				value: 25,
				range: [1, 100],
				resolution: 1,
				input: "hidden"
			},
			calculate: {
				title: "Calculate",
				type: "button"
			}
		},

		resolution: 1,
		width: 400,
		height: 200,
		animateID: null,
		t:0,
		data: null,

		init: function(){
			$("#demo").append($("#visualization"));

			// Instantiate our graph object.
			var container = document.getElementById('visualization');
			this.data = new vis.DataSet();
			this.data.add({id:0,x:0,y:0,z:0,style:0});
			var options = {
			    // width:  '500px',
			    width:  $("#demo").width()+'px',
			    height: $("#demo").width()*0.67+'px',
			    // height: '552px',
			    style: 'surface',
			    showPerspective: true,
			    showGrid: true,
			    showShadow: false,
			    keepAspectRatio: true,
			    verticalRatio: 0.5,
			    tooltip: true,
			    // zMin: -1000,
			    // zMax: 1000
			};
			this.graph3d = new vis.Graph3d(container, this.data, options);
			// this.threeDPlot();
			this.update();


		},

		isNumber: function(n) {
		  return !isNaN(parseFloat(n)) && isFinite(n);
		},


		update: function(e){
			try{
				this.expr = Parser.parse(this.ui.expression.value);
				// if (this.expr.variables().sort().toString() == "x,y") {
					this.threeDPlot();
				// } else {
				// 	alert("Please enter an equation in terms of x and y");
				// }
			} catch (e) {
				alert("Sorry, it looks like there's something wrong with the mathematical expression you entered. Please try again.");
				this.data = new vis.DataSet();
				this.data.add({id:0,x:0,y:0,z:0,style:0});
				this.graph3d.setData(this.data);
			}
			

			// this.render();
			if (e == "animate"){
				if (this.ui.animate.value){
					this.animate();
				} else {
					window.cancelAnimationFrame(this.animateID);
				}
			}

		},

		animate: function(){
			// console.log(this.t);
			this.t += 0.05;
		    this.animateID = window.requestAnimationFrame(this.animate.bind(this));
	        this.update();
		},

		threeDPlot: function(){
			this.data = new vis.DataSet();
			    
			var counter = 0;
			var steps = 50;  // number of datapoints will be steps*steps
			var axisMax = 314;
			var axisStep = axisMax / steps;
			// var numberOfSteps = 25;
			var numberOfSteps = this.ui.resolution.value;
			xRange = this.ui.xRange.value.split(",");
			yRange = this.ui.yRange.value.split(",");
			xRange[0] = parseFloat(xRange[0]);
			xRange[1] = parseFloat(xRange[1]);
			yRange[0] = parseFloat(yRange[0]);
			yRange[1] = parseFloat(yRange[1]);
			xInterval = (xRange[1] - xRange[0]) / numberOfSteps;
			yInterval = (yRange[1] - yRange[0]) / numberOfSteps;
			rangeError = 0;
			if (this.isNumber(xInterval) && xInterval > 0){

			} else {
				rangeError++;;
				alert("There is a problem with the x range");
			}
			if (this.isNumber(yInterval) && yInterval > 0){

			} else {
				rangeError++;
				alert("There is a problem with the y range");	
			}
			nanCount = 0;
			if (rangeError == 0){
				for (var x = xRange[0] ; x <= xRange[1] ; x+=xInterval) {
					for (var y = yRange[0]; y <= yRange[1]; y+=yInterval) {
						// if (x > y){
							r = Math.sqrt(x*x + y*y)/50 ;
							var value = this.expr.evaluate({x:x, y:y});
							if (typeof value == "undefined"){

							} else if (isNaN(value)){
								nanCount++;
								// console.log(value, x, y);
							} else {
								this.data.add({id:counter++,x:x,y:y,z:value,style:value});
							}
							
						// }
					}
				}
				this.graph3d.setData(this.data);
			}

			if (nanCount > 0){
				alert('Your expression has resulted in some mathematical errors. Please try again');
				this.data = new vis.DataSet();
				this.data.add({id:0,x:0,y:0,z:0,style:0});
				this.graph3d.setData(this.data);
			}
		}
	});


