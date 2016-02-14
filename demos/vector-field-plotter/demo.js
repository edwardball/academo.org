

	var demo = new Demo({
		ui: {
			iExpression: {
				title: "\\( \\hat{i} \\) component",
				value: "a*x + b*y",
				type: "userInputString"
			},
			jExpression: {
				title: "\\( \\hat{j} \\) component",
				value: "c*x + d*y",
				type: "userInputString"
			},
			calculate: {
				title: "Update expression",
				type: "button"
			},
			a: {
				title: "\\( a \\)",
				value: 1,
				range: [-3, 3],
				resolution: 0.01
			},
			b: {
				title: "\\( b \\)",
				value: 1,
				range: [-3, 3],
				resolution: 0.01
			},
			c: {
				title: "\\( c \\)",
				value: 1,
				range: [-3, 3],
				resolution: 0.01
			},
			d: {
				title: "\\( d \\)",
				value: 1,
				range: [-3, 3],
				resolution: 0.01
			},
		},

		init: function(){
			$("#c").appendTo("#demo");
			this.canvas = document.getElementById('c');
			this.ctx = this.canvas.getContext("2d");
			this.graph = new Graph(this.ctx, -10,+10,-10,+10,250,250,500,500);
			this.graph.drawgrid(2,1,2,1);

			xdata = [];
			ydata = [];
			idata = [];
			jdata = [];

			for (x = -10 ; x <= 10 ; x+=1 ){
				for (y = -10 ; y <= +10 ; y+=1){
					xdata.push(x);
					ydata.push(y);

					//vector field
					idata.push(x*this.ui.a.value + y*this.ui.b.value);
					jdata.push(x*this.ui.c.value + y*this.ui.d.value);
					
				}
			}
			pDots = true;
			pLine = false;
			this.graph.plotVectorField(xdata, ydata, idata, jdata,'red', pDots, pLine);

		},

		update: function(e){
			try{
				this.iExpr = Parser.parse(this.ui.iExpression.value);
				this.jExpr = Parser.parse(this.ui.jExpression.value);
			} catch (e) {
				alert("Sorry, it looks like there's something wrong with the mathematical expression you entered. Please try again.");
			}


			xdata = [];
			ydata = [];
			idata = [];
			jdata = [];
			stepSize  = 1;

			for (x = -10 ; x <= 10 ; x+=stepSize ){
				for (y = -10 ; y <= +10 ; y+=stepSize){
					xdata.push(x);
					ydata.push(y);

					//vector field
					// idata.push(x*this.ui.a.value + y*this.ui.b.value);
					// jdata.push(x*this.ui.c.value + y*this.ui.d.value);
					idata.push(this.iExpr.evaluate({
						x:x,
						y:y,
						a:this.ui.a.value,
						b:this.ui.b.value,
						c:this.ui.c.value,
						d:this.ui.d.value,
					}));
					jdata.push(this.jExpr.evaluate({
						x:x,
						y:y,
						a:this.ui.a.value,
						b:this.ui.b.value,
						c:this.ui.c.value,
						d:this.ui.d.value,
					}));
				}
			}
			pDots = true;
			pLine = false;
			this.ctx.clearRect(0,0,500,500);
			this.graph.drawgrid(2,1,2,1);
			this.graph.plotVectorField(xdata, ydata, idata, jdata,'red', pDots, pLine);
		},

		pythag: function(a,b){
			return Math.sqrt(a*a + b*b);
		},
	});



