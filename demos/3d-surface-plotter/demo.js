
	var demo = new Demo({
		ui: {
			expression: {
				title: "Expression",
				value: "x*x - y*y",
				type: "userInputString",
				prepend: "z = "
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
			if (window.location.search != ""){
				var decodedURL = this.decodeURL();
				this.ui.expression.value = decodedURL.expression;
				$("#expression-interface input").val(this.ui.expression.value);

				this.ui.xRange.value = decodedURL.xRange;
				$("#xRange-interface input").val(this.ui.xRange.value);

				this.ui.yRange.value = decodedURL.yRange;
				$("#yRange-interface input").val(this.ui.yRange.value);

				this.ui.resolution.value = decodedURL.resolution;
				$("#resolution-interface input").val(this.ui.resolution.value);
			}
			this.update();


		},

		updateURL: function(){
			var data = {
				expression: this.ui.expression.value.replace(/ /g,''), // strip white space because $.param encodes it as +
				xRange: this.ui.xRange.value,
				yRange: this.ui.yRange.value,
				resolution: this.ui.resolution.value
			}
			if (history.pushState) {
			    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + $.param(data);
			    window.history.pushState({path:newurl},'',newurl);
			}
		},

		decodeURL: function(){
			// taken from Stack Overflow http://stackoverflow.com/questions/1131630/the-param-inverse-function-in-javascript-jquery
			var query = window.location.search.slice(1);
			var query_string = {};
			var vars = query.split("&");
			for (var i=0;i<vars.length;i++) {
				var pair = vars[i].split("=");
				pair[0] = decodeURIComponent(pair[0]);
				pair[1] = decodeURIComponent(pair[1]);
				// If first entry with this name
				if (typeof query_string[pair[0]] === "undefined") {
					query_string[pair[0]] = pair[1];
					// If second entry with this name
				} else if (typeof query_string[pair[0]] === "string") {
					var arr = [ query_string[pair[0]], pair[1] ];
					query_string[pair[0]] = arr;
				// If third or later entry with this name
				} else {
					query_string[pair[0]].push(pair[1]);
				}
			}
			return query_string;
		},

		isNumber: function(n) {
		  return !isNaN(parseFloat(n)) && isFinite(n);
		},


		update: function(e){
			if (e == "calculate"){
				this.updateURL();
			}
			try{
				var enteredExpression = this.ui.expression.value.trim();

				// need to account for inequalities
				// first remove "if". This syntax was part of older format. eg (if x > y, x, y)
				// New format needs to be like so
				// x > y ? x : y
				enteredExpression = enteredExpression.replace("if", "");
				//next replace first comma with "?"
				enteredExpression = enteredExpression.replace(",", "?");

				if (enteredExpression.indexOf("?") > -1){
				//finally replace last comma with ":"
					if (enteredExpression.indexOf(",") > -1){
						enteredExpression = enteredExpression.replace(",", ":");
					} else {
						// this means we don't have a second expression. So remove last bracket, add null and re-add it.
						enteredExpression = enteredExpression.slice(0, -1);
						enteredExpression += ": null)";
					}
				}
				
				this.node = math.parse(enteredExpression); 
				this.expr = this.node.compile();
				this.threeDPlot();
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
						var value =  this.expr.eval({x:x, y:y});
						if (value == null){
							// don't plot anything
						} else {
							// Display real value.
							value = math.re(value);

							if (typeof value == "undefined"){

							} else if (isNaN(value)){
								nanCount++;
							} else {
								this.data.add({id:counter++,x:x,y:y,z:value,style:value, group: 1});
							}
						}
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


