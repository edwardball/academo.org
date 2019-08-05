
	var demo = new Demo({
		ui: {
			calculate: {
				title: "Draw",
				type: "button"
			},
			v1: {
				title: "Vector v1 (Blue)",
				value: "(3,-1,4)",
				type: "userInputString"
			},
			v2: {
				title: "Vector v2 (Red)",
				value: "(-2,3,1)",
				type: "userInputString"
			},
			showResultant: {
				title: "Show resultant, v1 + v2 (Purple)",
				value: false
			},
			showDifference: {
				title: "Show difference, v1 - v2 (Turquoise)",
				value: false
			},
			showCrossProduct: {
				title: "Show cross product, v1 &times v2 (Green)",
				value: false
			},
			addVector: {
				title: "Add a Vector",
				type: "button"
			},
			addExpression: {
				title: "Add an Expression",
				type: "button"
			},
		},

		cameraPosition:{
			horizontal: 1,
			vertical: 0.5,
			distance: 1.7
		},

		resolution: 1,
		width: 400,
		height: 200,
		animateID: null,
		t:0,
		data: null,
		vVectorsCount: 2,
		eVectorsCount: 0,
		totalVectorsCount: 5,
		vecList: ['0', 'v1', 'v2', 'vResultant', 'vDifference', 'vCross'],

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
			    style: 'line',
			    showPerspective: true,
			    showGrid: true,
			    // showGrid: false,
			    showShadow: false,
			    keepAspectRatio: true,
			    verticalRatio: 1,
			    tooltip: true,
			    zMin: -5,
			    zMax: 5,
			    yMin: -5,
			    yMax: 5,
			    xMin: -5,
			    xMax: 5,
			};
			this.graph3d = new vis.Graph3d(container);
			this.graph3d.setOptions(options);

			_this = this;
			this.graph3d.on('cameraPositionChange', function(e){
				// console.log(e);
				_this.cameraPosition = {
					horizontal: e.horizontal,
					vertical: e.vertical,
					distance: e.distance
				}
			})

			// this.threeDPlot();
			this.update();


		},

		isNumber: function(n) {
		  return !isNaN(parseFloat(n)) && isFinite(n);
		},

		validateVector: function(vecName) {
			if (this[vecName] === undefined) {
				return 1;
			} else {
				return 0;
			}
		},

		// the expression evaluator
		evaluateExp: function(exp) {
			let expError = 0;
			let vecError = 0;

			if (exp.includes("+")) { // add
				expError += 1;
				let comps = exp.split("+");
				if (comps.length > 2) {
					expError += 1;
				} else {
					vecError += this.validateVector(comps[0].trim());
					vecError += this.validateVector(comps[1].trim());
					if (vecError == 0) return this.sum(this[comps[0].trim()], this[comps[1].trim()]);
				}
			}
			if (exp.includes("-")) { // diff
				expError += 1;
				let comps = exp.split("-");
				if (comps.length > 2) {
					expError += 1;
				} else {
					vecError += this.validateVector(comps[0].trim());
					vecError += this.validateVector(comps[1].trim());
					if (vecError == 0) return this.diff(this[comps[0].trim()], this[comps[1].trim()]);
				}
			}
			if (exp.includes("x")) { // cross
				expError += 1;
				let comps = exp.split("x");
				if (comps.length > 2) {
					expError += 1;
				} else {
					vecError += this.validateVector(comps[0].trim());
					vecError += this.validateVector(comps[1].trim());
					if (vecError == 0) return this.cross(this[comps[0].trim()], this[comps[1].trim()]);
				}
			}
			if (expError == 0) {
				alert("Did not find an operator ('+', '-' or 'x') while evaluating the expression "+exp);
			}
			if (expError > 1) {
				alert("Found too many operators ('+', '-' or 'x') while evaluating the expression "+exp);
			}
			if (vecError > 0) {
				alert("Error evaluating the expression "+exp);
			}


			return [0,0,0];
		},

		sum: function(v1, v2) {
			let vSum = [];
			vSum[0] = 1*v1[0] + 1*v2[0];
			vSum[1] = 1*v1[1] + 1*v2[1];
			vSum[2] = 1*v1[2] + 1*v2[2];
			return vSum;
		},

		diff: function(v1, v2) {
			let vDiff = [];
			vDiff[0] = 1*v1[0] - 1*v2[0];
			vDiff[1] = 1*v1[1] - 1*v2[1];
			vDiff[2] = 1*v1[2] - 1*v2[2];
			return vDiff;
		},

		cross: function(v1, v2) {
			let vCross = [];
			vCross[0] = v1[1] * v2[2] - v1[2] * v2[1];
			vCross[1] = v1[2] * v2[0] - v1[0] * v2[2];
			vCross[2] = v1[0] * v2[1] - v1[1] * v2[0];
			return vCross;
		},

		update: function(e){

			if (e == "addVector") {
				// increment the counter variables
				this.vVectorsCount += 1;
				this.totalVectorsCount += 1;

				// Pick the Color
				let vecColorName = Colors.nameMaps[Colors.colors[this.totalVectorsCount]];

				// get the vector name
				let vecName = "v" + this.vVectorsCount;

				// add the vectors to the UI
				this.ui[vecName] = {
										title: "Vector " + vecName + " (" + vecColorName + ")",
										value: "(1,2,3)",
										type: "userInputString"
									};
				this.addUIElement(vecName);

				// push it to the intermediate variable and push name to list for record
				this[vecName] = [1,2,3];
				this.vecList.push(vecName);
			}

			else if (e == "addExpression") {
				// increment the counter variables
				this.eVectorsCount += 1;
				this.totalVectorsCount += 1;

				// Pick the Color
				let vecColorName = Colors.nameMaps[Colors.colors[this.totalVectorsCount]];

				// get the vector name
				let vecName = "e" + this.eVectorsCount;

				// add the vectors to the UI
				this.ui[vecName] = {
										title: "Expression " + vecName + " (" + vecColorName + ")",
										value: "v1 x v2",
										type: "userInputString"
									};
				this.addUIElement(vecName);
				
				// push it to the intermediate variable and push name to list for record
				this[vecName] = this.evaluateExp('v1 x v2');
				this.vecList.push(vecName);
			}


			// update vector values
			for (var i=1; i<=this.vVectorsCount; i++) {
				let vecName = "v" + i;
				this[vecName] = this.ui[vecName].value.trim().slice(1, -1).split(",");
			}

			// update expression values
			for (var i=1; i<=this.eVectorsCount; i++) {
				let vecName = "e" + i;
				this[vecName] = this.evaluateExp(this.ui[vecName].value);
			}

			this.vCross = this.cross(this['v1'],this['v2']);
			this.vResultant = this.sum(this['v1'],this['v2']);
			this.vDifference = this.diff(this['v1'],this['v2']);

			var error = 0;
			// validation of all the vectors
			for (i = 0 ; i < 3 ; i++){
				for (var j=1; j<this.vecList.length; j++) {
					let vecName = this.vecList[j];
					if (!this.isNumber(this[vecName][i])) {
						error++;
					}
				}
			}

			if (error === 0){
				this.threeDPlot();
			} else {
				alert("There is a problem with your input, please try again");
			}
		},

		animate: function(){
			// console.log(this.t);
			this.t += 0.05;
		    this.animateID = window.requestAnimationFrame(this.animate.bind(this));
	        this.update();
		},

		isNumber: function(n) {
		  return !isNaN(parseFloat(n)) && isFinite(n);
		},

		threeDPlot: function(){

			let min = 0, max = 0;
			for (var i=1; i<this.vecList.length; i++) {
				let vecName = this.vecList[i];
				let vec = this[vecName];
				for (var j=0; j<vec.length; j++) {
					min = vec[j] < min ? vec[j] : min;
					max = vec[j] > max ? vec[j] : max;
				}
			}

			absMax = Math.max(max, Math.abs(min));

			options = {
				zMin: -absMax,
				zMax: absMax,
				yMin: -absMax,
				yMax: absMax,
				xMin: -absMax,
				xMax: absMax,
				cameraPosition: this.cameraPosition
			}

			this.graph3d.setOptions(options);

			this.data = new vis.DataSet();
			this.data.add({id:0,x:0,y:0,z:0,style:0});
			this.data.add({id:1,x:this.v1[0],y:this.v1[1],z:this.v1[2]});
			this.data.add({id:2,x:this.v2[0],y:this.v2[1],z:this.v2[2]});

			if (this.ui.showResultant.value == true){
				this.data.add({id:3,x:this.vResultant[0],y:this.vResultant[1],z:this.vResultant[2]});
			} else {
				this.data.add({id:3,x:0,y:0,z:0});
			}

			if (this.ui.showDifference.value == true){
				this.data.add({id:4,x:this.vDifference[0],y:this.vDifference[1],z:this.vDifference[2]});
			} else {
				this.data.add({id:4,x:0,y:0,z:0});
			}

			if (this.ui.showCrossProduct.value == true){
				this.data.add({id:5,x:this.vCross[0],y:this.vCross[1],z:this.vCross[2]});
			} else {
				this.data.add({id:5,x:0,y:0,z:0});
			}

			// let's now add the vectors and expressions
			for (var i=6; i<this.vecList.length; i++) {
				let vecName = this.vecList[i];
				let vec = this[vecName];
				this.data.add({id: this.vecList.indexOf(vecName), x: vec[0], y: vec[1], z: vec[2]});
			}
				
			this.graph3d.setData(this.data);

		}
	});


