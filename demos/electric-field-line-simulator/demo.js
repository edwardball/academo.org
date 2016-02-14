	//http://stackoverflow.com/questions/18719775/parsing-and-converting-exponential-values-to-decimal-in-javascript
	Number.prototype.noExponents= function(){
	    var data= String(this).split(/[eE]/);
	    if(data.length== 1) return data[0]; 

	    var  z= '', sign= this<0? '-':'',
	    str= data[0].replace('.', ''),
	    mag= Number(data[1])+ 1;

	    if(mag<0){
	        z= sign + '0.';
	        while(mag++) z += '0';
	        return z + str.replace(/^\-/,'');
	    }
	    mag -= str.length;  
	    while(mag--) z += '0';
	    return str + z;
	}
	var n=4.65661287307739E-10 ;
	n.noExponents()

	/*  returned value: (String)
	0.000000000465661287307739
	*/	

	var demo = new Demo({
		ui: {
			charge1: {
				title: "Charge 1",
				value: 2,
				range: [-5,5],
				color: "#5bccf6",
				resolution: 1
			},
			charge2: {
				title: "Charge 2",
				value: -1,
				range: [-5,5],
				color: "#5bccf6",
				resolution: 1
			}
		},

		pointChargeRadius: 10,
		linesPerCharge: 10,
		charge1: {
			x: -100,
			y: 0,
			q:1
		},
		charge2: {
			x: 100,
			y: 0,
			q:-1
		},

		init: function(){
			$("#demo").append($("#js-point-charge-demo"));

			this.canvas = document.getElementById("js-point-charge-demo"); 
			this.ctx = this.canvas.getContext("2d");
			this.mouse = utils.captureMouse(this.canvas);
			this.isMouseDown = false;
			_this = this;

			this.canvas.addEventListener('mousedown', function () {
			        if (utils.containsPoint({x:_this.charge2.x + 250,y:_this.charge2.y+250,radius:_this.pointChargeRadius}, _this.mouse.x, _this.mouse.y)) {
			          _this.isMouseDown = true;
			          _this.canvas.addEventListener('mouseup', _this.onMouseUp, false);
			          _this.canvas.addEventListener('mousemove', _this.onMouseMove, false);
			        }
			      }, false);

			this.update();
		},

		onMouseUp: function() {
			demo.isMouseDown = false;
			demo.canvas.removeEventListener('mouseup', demo.onMouseUp, false);
			demo.canvas.removeEventListener('mousemove', demo.onMouseMove, false);
		},
		      
		onMouseMove: function (event) {
			demo.charge2.x = demo.mouse.x - 250;
			demo.charge2.y = demo.mouse.y - 250;
			demo.update();
		},

		update: function(e){

			this.ctx.clearRect(0,0,500,500);

			if (this.ui.charge1.value * this.ui.charge2.value < 0){
				//opposite charges, lines only needed from one charge
				if (Math.abs(this.ui.charge1.value) >= Math.abs(this.ui.charge2.value)){
					//field Lines need to start at charge 1
					var startingLocation = {
						x: this.charge1.x,
						y: this.charge1.y
					}

					var endLocation = {
						x: this.charge2.x,
						y: this.charge2.y
					}

					if (this.ui.charge1.value < 0){
						sign = -1;
					} else {
						sign = +1;
					}

					var fieldLineCount = Math.abs(this.ui.charge1.value) * this.linesPerCharge;
					var angleIncrement = 2 * Math.PI / fieldLineCount;
					for (var angle = 0, maxAngle = 2*Math.PI ; angle < maxAngle ; angle += angleIncrement){
						
						var fieldLineStart = {x: startingLocation.x + this.pointChargeRadius * Math.sin(angle), y: startingLocation.y + this.pointChargeRadius * Math.cos(angle)}
						var endLocation = {x:this.charge2.x,y:this.charge2.y};
						this.calcPathData(sign, fieldLineStart, endLocation);

					}
				} else {
					//field Lines need to start at charge 2
					var startingLocation = {
						x: this.charge2.x,
						y: this.charge2.y
					}

					var endLocation = {
						x: this.charge1.x,
						y: this.charge1.y
					}

					if (this.ui.charge2.value < 0){
						sign = -1;
					} else {
						sign = +1;
					}

					var fieldLineCount = Math.abs(this.ui.charge2.value) * this.linesPerCharge;
					var angleIncrement = 2 * Math.PI / fieldLineCount;
					for (var angle = 0, maxAngle = 2*Math.PI ; angle < maxAngle ; angle += angleIncrement){
						
						var fieldLineStart = {x: startingLocation.x + this.pointChargeRadius * Math.sin(angle), y: startingLocation.y + this.pointChargeRadius * Math.cos(angle)}
						var endLocation = {x:this.charge1.x,y:this.charge1.y};
						this.calcPathData(sign, fieldLineStart, endLocation);

					}
				}


				
			} else if (this.ui.charge1.value * this.ui.charge2.value > 0){
				//like charges, lines needed from both
				if (this.ui.charge1.value < 0){
					sign = -1;
				} else {
					sign = +1;
				}
				//first charge
				var fieldLineCount = Math.abs(this.ui.charge1.value) * this.linesPerCharge;

				var angleIncrement = 2 * Math.PI / fieldLineCount;
				
				var startingLocation = {
					x: this.charge1.x,
					y: this.charge1.y
				}

				var endLocation = {
					x: this.charge2.x,
					y: this.charge2.y
				}

				for (var angle = 0, maxAngle = 2*Math.PI ; angle < maxAngle ; angle += angleIncrement){
					if (angle==0.3141592653589793){

					}					
					var fieldLineStart = {x: startingLocation.x + this.pointChargeRadius * Math.sin(angle), y: startingLocation.y + this.pointChargeRadius * Math.cos(angle)}
					var endLocation = {x:this.charge2.x,y:this.charge2.y};
					this.calcPathData(sign, fieldLineStart, endLocation);

				}


				//second charge
				var fieldLineCount = Math.abs(this.ui.charge2.value) * this.linesPerCharge;
				var angleIncrement = 2 * Math.PI / fieldLineCount;


				var startingLocation = {
					x: this.charge2.x,
					y: this.charge2.y
				}
				
				var endLocation = {
					x: this.charge1.x,
					y: this.charge1.y
				}

				for (var angle = 0, maxAngle = 2*Math.PI ; angle < maxAngle ; angle += angleIncrement){
					var fieldLineStart = {x: startingLocation.x + this.pointChargeRadius * Math.sin(angle), y: startingLocation.y + this.pointChargeRadius * Math.cos(angle)}
					var endLocation = {x:this.charge2.x,y:this.charge2.y};
					this.calcPathData(sign, fieldLineStart, endLocation);
				}
			} else {
				//at least one charge is zero, lines needed from non-zero one.
				if (this.ui.charge1.value == 0 && this.ui.charge2.value == 0){
					//no lines needed

				} else if (this.ui.charge1.value == 0){
					//lines needed around 2
					var startingLocation = {
						x: this.charge2.x,
						y: this.charge2.y
					}

					var endLocation = {
						x: 500,
						y: 500
					}

					if (this.ui.charge2.value < 0){
						sign = -1;
					} else {
						sign = +1;
					}

					var fieldLineCount = Math.abs(this.ui.charge2.value) * this.linesPerCharge;
					var angleIncrement = 2 * Math.PI / fieldLineCount;
					for (var angle = 0, maxAngle = 2*Math.PI ; angle < maxAngle ; angle += angleIncrement){
						
						var fieldLineStart = {x: startingLocation.x + this.pointChargeRadius * Math.sin(angle), y: startingLocation.y + this.pointChargeRadius * Math.cos(angle)}
						this.calcPathData(sign, fieldLineStart, endLocation);

					}
				} else {
					// lines needed around 1
					var startingLocation = {
						x: this.charge1.x,
						y: this.charge1.y
					}

					var endLocation = {
						x: 500,
						y: 500
					}

					if (this.ui.charge1.value < 0){
						sign = -1;
					} else {
						sign = +1;
					}

					var fieldLineCount = Math.abs(this.ui.charge1.value) * this.linesPerCharge;
					var angleIncrement = 2 * Math.PI / fieldLineCount;
					for (var angle = 0, maxAngle = 2*Math.PI ; angle < maxAngle ; angle += angleIncrement){
						
						var fieldLineStart = {x: startingLocation.x + this.pointChargeRadius * Math.sin(angle), y: startingLocation.y + this.pointChargeRadius * Math.cos(angle)}
						this.calcPathData(sign, fieldLineStart, endLocation);

					}
				}

			}


			//Draw circles for the charges
			this.ctx.translate(250,250);
			this.ctx.beginPath();
			this.ctx.arc(this.charge1.x, this.charge1.y, this.pointChargeRadius, 0, 2*Math.PI);
			this.ctx.fillStyle = this.chargeColor(this.ui.charge1.value);
			this.ctx.fill();
			this.ctx.beginPath();
			this.ctx.arc(this.charge2.x, this.charge2.y, this.pointChargeRadius, 0, 2*Math.PI);
			this.ctx.fillStyle = this.chargeColor(this.ui.charge2.value);
			this.ctx.fill();
			this.ctx.translate(-250,-250);

		},

		chargeColor: function(q){
			if (q > 0){
				return "red";
			} else if (q < 0){
				return "blue";
			} else {
				return "#333";
			}
		},

		calcPathData: function(sign,startingLocation, endLocation){
			this.ctx.translate(250,250);
			this.ctx.beginPath();
			this.ctx.strokeStyle="#999";
			this.ctx.moveTo(startingLocation.x,startingLocation.y);

			currentLocation = startingLocation;
			var endLine = false;

			D = 0;

			counter = 0;

			while(endLine == false){
				counter++;

				if (counter > 1500){
					//stop getting stuck in infinite loop!
					break;
				}

				if (this.ui.charge1.value*this.ui.charge2.value > 0){
					dD = 1;
					//Like charges therefore all field lines will go to infinity, cut off after 100 iterations;
					// if (counter > 250){
					if (Math.abs(currentLocation.x) > 250 || Math.abs(currentLocation.y) > 250){
						// console.log(currentLocation);
						break;
					}
				} else {

					if (Math.abs(currentLocation.x) > 2000 || Math.abs(currentLocation.y) > 2000){
						dD = 400;
					}else if (Math.abs(currentLocation.x) > 1000 || Math.abs(currentLocation.y) > 1000){
						dD = 200;
					} else if (Math.abs(currentLocation.x) > 500 || Math.abs(currentLocation.y) > 500){
						dD = 100;

					} else if (this.insideCircle(currentLocation, endLocation) ) {
						// console.log("End Line! Hit circle");
						break;
						endLine = true
					}else {
						dD = 10;
					}
				}

				// if (Math.abs(currentLocation.x) > 100000 || Math.abs(currentLocation.y) > 100000){
				if (Math.abs(currentLocation.x) > 50000 || Math.abs(currentLocation.y) > 50000){
					endLine = true;
					// console.log("Out of bounds");
					break;
				}
					
					
				currentField = this.calcField(currentLocation.x, currentLocation.y);
				currentFieldStrength = this.pythag(currentField.x, currentField.y);
				dy = dD * currentField.y / currentFieldStrength
				dx = dD * currentField.x / currentFieldStrength;
				currentLocation.x = currentLocation.x + dx*sign;
				currentLocation.y = currentLocation.y + dy*sign;

				this.ctx.lineTo(currentLocation.x.noExponents(), currentLocation.y.noExponents());

				//arrow subroutine
				D += dD;

				if (D > 100){
					D = 0;
					currentFieldLineAngle = Math.atan2(dy, dx);
					arrowLength = 5;
					arrowInclination = 0.5; //in rads
					this.ctx.lineTo(currentLocation.x.noExponents()-arrowLength*Math.cos(arrowInclination + currentFieldLineAngle), currentLocation.y.noExponents()*1-arrowLength*Math.sin(arrowInclination + currentFieldLineAngle));
					this.ctx.lineTo(currentLocation.x.noExponents(), currentLocation.y.noExponents());
					this.ctx.lineTo(currentLocation.x.noExponents()-arrowLength*Math.cos(arrowInclination - currentFieldLineAngle), currentLocation.y.noExponents()*1+arrowLength*Math.sin(arrowInclination - currentFieldLineAngle));
					this.ctx.lineTo(currentLocation.x.noExponents(), currentLocation.y.noExponents());
				}

			}

			this.ctx.stroke();

			this.ctx.translate(-250,-250);

		},

		pythag: function(a,b){
			return Math.sqrt(a*a + b*b);
		},

		insideCircle: function(pointLocation, circleLocation){
			var d = this.pythag(pointLocation.x - circleLocation.x, pointLocation.y - circleLocation.y);
			return d < this.pointChargeRadius;
		},

		calcField: function(x, y){
			var pointChargeLocation = {x:-100,y:0};
			var r = {x:x-pointChargeLocation.x , y:y - pointChargeLocation.y};
			$(".js-charge-1").attr("cx", pointChargeLocation.x).attr("cy", pointChargeLocation.y);
			var k = .1;
			var charge = this.ui.charge1.value;
			var coeff = charge / (k*Math.pow(this.pythag(r.x,r.y), 3))
			var field = [];
			field[0] = {x: r.x*coeff,y:r.y*coeff};

			var charge = this.ui.charge2.value;
			var pointChargeLocation = {x:this.charge2.x,y:this.charge2.y};
			$(".js-charge-2").attr("cx", pointChargeLocation.x).attr("cy", pointChargeLocation.y);
			var r = {x:x-pointChargeLocation.x , y:y - pointChargeLocation.y};
			var coeff = charge / (k*Math.pow(this.pythag(r.x,r.y), 3))
			field[1] = {x: r.x*coeff,y:r.y*coeff};



			return {x: field[0].x*1 + field[1].x*1, y:field[0].y*1 + field[1].y*1}
		}
	});