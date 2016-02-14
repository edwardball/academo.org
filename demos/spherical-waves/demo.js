
	var demo = new Demo({
		ui: {
			// t: {
			// 	title: "t",
			// 	value: 0,
			// 	range: [1, 10],
			// 	resolution: 0.01
			// },
			k: {
				title: "k",
				value: 10,
				range: [1, 20],
				resolution: 0.01
			},
			w: {
				title: "<span style='text-transform:none;'>&omega;</span>",
				value: 2,
				range: [0, 10],
				resolution: 0.01
			},
			amplitude: {
				title: "Amplitude",
				value: 50,
				range: [0, 100],
				resolution: 0.1
			},
			pm:{
				title: "Cosine argument",
				value: -1,
				values: [["(&omega;t - kr)", -1],["(&omega;t + kr)",1]]
			},
			animate: {
				title: "Animate",
				value: false
			},
			resolution: {
				title: "resolution",
				value: 3,
				range: [1,3],
				resolution: 1,
				step: 1
			}
		},

		resolution: 1,
		width: 400,
		height: 200,
		animateID: null,
		t:0,
		data: null,

		init: function(){
			$("#demo").append("<canvas id='c'></canvas>");
			$("#demo").append($("#visualization"));
			canvas = document.getElementById('c');
			canvas.width = this.width;
			canvas.height = this.height;
			this.context = canvas.getContext('2d');
			// this.render();
			this.render();
			// Instantiate our graph object.
			var container = document.getElementById('visualization');
			// this.data = new vis.DataSet();
			// this.data.add({id:0,x:0,y:0,z:0,style:0});
			var options = {
			    width:  '500px',
			    height: '552px',
			    style: 'surface',
			    showPerspective: true,
			    showGrid: true,
			    showShadow: false,
			    keepAspectRatio: true,
			    verticalRatio: 0.5,
			    zMin: -1000,
			    zMax: 1000
			};
			// this.graph3d = new vis.Graph3d(container, this.data, options);
			// this.threeDPlot();


		},

		render: function(){

			
			for (x = -this.width/2; x< this.width/2 ; x+=this.ui.resolution.value){
				for (y = -this.height/2 ; y < this.height/2 ; y+=this.ui.resolution.value){

					r = Math.sqrt(x*x + y*y)/50 ;
					// theta = Math.atan2(y/x);
					// psi = scaleConstant * (2 - (r/this.ui.a0.value)) * Math.exp(-r/(2*this.ui.a0.value));
					u = (this.ui.amplitude.value/r) * Math.cos(this.ui.w.value*this.t + this.ui.k.value*r*this.ui.pm.value);

					//basic demonstratin of Huygens' principle
					// r = Math.sqrt((y-20)*(y-20) + x*x)/50;
					// u += (this.ui.amplitude.value/r) * Math.cos(this.ui.w.value*this.t - this.ui.k.value*r);
					// r = Math.sqrt((y-10)*(y-10) + x*x)/50;
					// u += (this.ui.amplitude.value/r) * Math.cos(this.ui.w.value*this.t - this.ui.k.value*r);
					// r = Math.sqrt((y+10)*(y+10) + x*x)/50;
					// u += (this.ui.amplitude.value/r) * Math.cos(this.ui.w.value*this.t - this.ui.k.value*r);
					// r = Math.sqrt((y+20)*(y+20) + x*x)/50;
					// u += (this.ui.amplitude.value/r) * Math.cos(this.ui.w.value*this.t - this.ui.k.value*r);

					if (u > 0){
						color = "hsl(0,50%,"+Math.round(Math.abs(u))+"%)";
					} else {
						color = "hsl(200,50%,"+Math.round(Math.abs(u))+"%)";
					}
					this.context.fillStyle = color;
					this.context.fillRect(x+this.width/2 -1 ,y+this.height/2 -1,this.ui.resolution.value,this.ui.resolution.value);

				}
			}
		},


		update: function(e){
			// this.threeDPlot();

			this.context.fillStyle = "black";
			this.context.fillRect(0,0,this.width,this.height);
			this.render();
			if (e == "animate"){
				console.log(this.ui.animate.value);
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

			// console.log("3d plot");

			// Create and populate a data table.
			    
			    // create some nice looking data with sin/cos
			    var counter = 0;
			    var steps = 50;  // number of datapoints will be steps*steps
			    var axisMax = 314;
			    var axisStep = axisMax / steps;
			    for (var x = -50 ; x < 50 ; x+=3) {
			        for (var y = -50; y < 50; y+=3) {
			        	r = Math.sqrt(x*x + y*y)/50 ;
			        	// theta = Math.atan2(y/x);
			        	// psi = scaleConstant * (2 - (r/this.ui.a0.value)) * Math.exp(-r/(2*this.ui.a0.value));
			        	var value = (this.ui.amplitude.value/r) * Math.cos(this.ui.w.value*this.t + this.ui.k.value*r*this.ui.pm.value);

			        	// r = Math.sqrt((y-10)*(y-10) + x*x)/50;
			        	// u += (this.ui.amplitude.value/r) * Math.cos(this.ui.w.value*this.t - this.ui.k.value*r);
			        	if (x == 0 && y == 0){
			        		value = 10;
				            

			        	} else {

			        	}
				            this.data.add({id:counter++,x:x,y:y,z:value,style:value});
			            // var value = (Math.sin(x/50) * Math.cos(y/50) * 50 + 50);
			        }
			    }

			            // data.add({id:1,x:1,y:1,z:value,style:value});


			    
			    this.graph3d.setData(this.data);
		}
	});


