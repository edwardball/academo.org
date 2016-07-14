
	var demo = new Demo({
		ui: {
			v1: {
				title: "Vector 1 (blue)",
				value: "(3,-1,4)",
				type: "userInputString"
			},
			v2: {
				title: "Vector 2 (red)",
				value: "(-2,3,1)",
				type: "userInputString"
			},
			v3: {
				title: "Vector 3 (optional) (orange)",
				value: "(0,0,0)",
				type: "userInputString"
			},
			showResultant: {
				title: "Show resultant, v1+v2 (Purple)",
				value: true
			},
			showDifference: {
				title: "Show difference, v1 - v2 (Turquoise)",
				value: true
			},
			showCrossProduct: {
				title: "Show cross product, v1 &times v2 (Green)",
				value: true
			},
			calculate: {
				title: "Draw",
				type: "button"
			}
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
		v1:null,
		v2:null,
		v3:null,

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

		update: function(e){

			this.v1 = this.ui.v1.value.substring(1, this.ui.v1.value.length-1).split(","); 
			this.v2 = this.ui.v2.value.substring(1, this.ui.v2.value.length-1).split(",");
			this.v3 = this.ui.v3.value.substring(1, this.ui.v3.value.length-1).split(",");

			this.vCross = [];
			this.vCross[0] = this.v1[1] * this.v2[2] - this.v1[2] * this.v2[1]; 
			this.vCross[1] = this.v1[2] * this.v2[0] - this.v1[0] * this.v2[2];
			this.vCross[2] = this.v1[0] * this.v2[1] - this.v1[1] * this.v2[0]; 
			this.vResultant = [];
			this.vResultant[0] = 1*this.v1[0] + 1*this.v2[0];
			this.vResultant[1] = 1*this.v1[1] + 1*this.v2[1];
			this.vResultant[2] = 1*this.v1[2] + 1*this.v2[2];

			this.vDifference = [];
			this.vDifference[0] = 1*this.v1[0] - 1*this.v2[0];
			this.vDifference[1] = 1*this.v1[1] - 1*this.v2[1];
			this.vDifference[2] = 1*this.v1[2] - 1*this.v2[2];

			var error = 0;

			for (i = 0 ; i < 3 ; i++){
				if (!this.isNumber(this.v1[i]) || !this.isNumber(this.v2[i]) || !this.isNumber(this.v3[i]) || !this.isNumber(this.vCross[i]) || !this.isNumber(this.vResultant[i]) || !this.isNumber(this.vDifference[i])){
					alert("There is a problem with your input, please try again")
					this.data = new vis.DataSet();
					this.data.add({id:0,x:0,y:0,z:0,style:0});
					this.data.add({id:1,x:0,y:0,z:0,style:0});
					this.data.add({id:2,x:0,y:0,z:0,style:0});
					this.data.add({id:3,x:0,y:0,z:0,style:0});
					this.data.add({id:4,x:0,y:0,z:0,style:0});
					this.data.add({id:5,x:0,y:0,z:0,style:0});
					this.data.add({id:6,x:0,y:0,z:0,style:0});
					this.graph3d.setData(this.data);
					error++;
				} 
			}

			if (error === 0){
				this.threeDPlot();
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


			min = Math.min(this.v1[0], this.v1[1], this.v1[2], this.v2[0], this.v2[1], this.v2[2], this.v3[0], this.v3[1], this.v3[2], this.vCross[0], this.vCross[1], this.vCross[2], this.vResultant[0], this.vResultant[1], this.vResultant[2], this.vDifference[0], this.vDifference[1], this.vDifference[2]);
			max = Math.max(this.v1[0], this.v1[1], this.v1[2], this.v2[0], this.v2[1], this.v2[2], this.v3[0], this.v3[1], this.v3[2], this.vCross[0], this.vCross[1], this.vCross[2], this.vResultant[0], this.vResultant[1], this.vResultant[2], this.vDifference[0], this.vDifference[1], this.vDifference[2]);

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
			// this.graph3d.setCameraPosition(this.cameraPosition);

			this.data = new vis.DataSet();
			this.data.add({id:0,x:0,y:0,z:0,style:0});
			this.data.add({id:1,x:this.v1[0],y:this.v1[1],z:this.v1[2]});
			this.data.add({id:2,x:this.v2[0],y:this.v2[1],z:this.v2[2]});
			// this.data.add({id:6,x:this.v3[0],y:this.v3[1],z:this.v3[2]});

			if (this.ui.showResultant.value == true){
				this.data.add({id:4,x:this.vResultant[0],y:this.vResultant[1],z:this.vResultant[2]});
			} else {
				this.data.add({id:4,x:0,y:0,z:0});
			}
			if (this.ui.showDifference.value == true){
				this.data.add({id:5,x:this.vDifference[0],y:this.vDifference[1],z:this.vDifference[2]});
			} else {
				this.data.add({id:5,x:0,y:0,z:0});
			}
			if (this.ui.showCrossProduct.value == true){
				this.data.add({id:3,x:this.vCross[0],y:this.vCross[1],z:this.vCross[2]});
			} else {
				this.data.add({id:3,x:0,y:0,z:0});
			}

			// vector 3
			this.data.add({id:6,x:this.v3[0],y:this.v3[1],z:this.v3[2]});

			this.graph3d.setData(this.data);

		}
	});


