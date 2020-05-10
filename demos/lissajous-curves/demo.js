var demo = new Demo({
	ui: {
		m: {
			title: "\\( a \\)",
			value: 7,
			range: [1, 20],
			resolution: 1	
		},
		n: {
			title: "\\( b \\)",
			value: 6,
			range: [1, 20],
			resolution: 1
		},
		phi: {
			title: "\\( \\phi \\)",
			units: "Pi Radians",
			value: 0,
			range: [0, 2],
			resolution: 0.01
		},
		animate: {
			title: "Animate \\( \\phi \\)",
			value: true
		},
		radiusX: {
			title: "\\( A \\)",
			value: 100,
			range: [1, 200],
			resolution: 1,
			units: "px"			
		},
		radiusY: {
			title: "\\( B \\)",
			value: 100,
			range: [1, 200],
			resolution: 1,
			units: "px"			
		}
	},

	width: $("#demo").width(),
	height: $("#demo").width() * 0.7,

	animateID: null,
	t:0,

	init: function(){
		$("#demo").append($(".js-curve"));
		$(".js-curve").attr("width", this.width + "px").attr("height", this.height + "px");
		this.update();
		this.animate();
	},

	update: function(e){

		if (e == "animate"){
			if (this.ui.animate.value){
				this.animate();
			} else {
				window.cancelAnimationFrame(this.animateID);
			}
		}

		m = this.ui.m.value;
		n = this.ui.n.value;

		var commonFactor = this.gcd(m,n);

		m /= commonFactor;
		n /= commonFactor;


		// if (n % 2 == 1 && m % 2 == 1){
			// var period = Math.PI * m;
		// } else {
			var period = Math.PI * 2;
		// }

		var numberOfPoints = Math.ceil(period * 100);
		var angleStep = period / numberOfPoints;
		var startPoint = this.curve(m,n, this.ui.radiusX.value, this.ui.radiusY.value, 0);
		var pathData = 'M' + startPoint.x + "," + startPoint.y + " ";
		// for (var i = angleStep ; i <= period ; i+=angleStep){
		for (var i = 1 ; i <= numberOfPoints ; i++){
			var nextPoint = this.curve(m,n, this.ui.radiusX.value, this.ui.radiusY.value, i*angleStep);
			pathData += 'L' + nextPoint.x + "," + nextPoint.y*-1 + " "; // multiply y coordinate by -1 to make sure increase in y goes up on chart instead of down.
		}
		$(".js-curve-path").attr("d", pathData);
		$(".js-curve-path").attr("transform", 'translate('+this.width/2+' '+this.height/2+')');
	},

	curve: function(a, b, rx, ry, theta, degrees){
		if (degrees === true){
			theta *= 180 / Math.PI;
		}
		var x = rx * Math.sin(a * theta + this.ui.phi.value * Math.PI);
		var y = ry * Math.sin(b * theta);

		return {x:x, y:y};
	},

	animate: function(){
		// console.log(this.t);
		this.ui.phi.value += 0.001;
		this.ui.phi.value %= 2;
		$("#phi-interface").val(this.ui.phi.value);
	    this.animateID = window.requestAnimationFrame(this.animate.bind(this));
        this.update();
	},

	//http://stackoverflow.com/questions/17445231/js-how-to-find-the-greatest-common-divisor
	gcd: function(a, b) {
	    if ( ! b) {
	        return a;
	    }

	    return this.gcd(b, a % b);
	}
});