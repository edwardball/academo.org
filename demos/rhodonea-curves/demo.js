var demo = new Demo({
	ui: {
		m: {
			title: "\\( m \\)",
			value: 7,
			range: [1, 20],
			resolution: 1	
		},
		n: {
			title: "\\( n \\)",
			value: 6,
			range: [1, 20],
			resolution: 1
		},
		radius: {
			title: "\\( A \\)",
			value: 100,
			range: [1, 200],
			resolution: 1,
			units: "px"		
		}
	},

	width: $("#demo").width(),
	height: $("#demo").width() * 0.7,

	init: function(){
		$("#demo").append($(".js-rose"));
		$(".js-rose").attr("width", this.width + "px").attr("height", this.height + "px");
		this.update();
	},

	update: function(e){

		m = this.ui.m.value;
		n = this.ui.n.value;

		var commonFactor = this.gcd(m,n);

		m /= commonFactor;
		n /= commonFactor;


		var k = m / n;
		if (n % 2 == 1 && m % 2 == 1){
			var period = Math.PI * n;
		} else {
			var period = Math.PI * n * 2;
		}

		var numberOfPoints = Math.ceil(period * 100);
		var angleStep = period / numberOfPoints;
		var startPoint = this.rose(k, this.ui.radius.value, 0);
		var pathData = 'M' + startPoint.x + "," + startPoint.y + " ";
		// for (var i = angleStep ; i <= period ; i+=angleStep){
		for (var i = 1 ; i <= numberOfPoints ; i++){
			var nextPoint = this.rose(k, this.ui.radius.value, i*angleStep);
			pathData += 'L' + nextPoint.x + "," + nextPoint.y + " ";
		}
		$(".js-rose-path").attr("d", pathData);
		$(".js-rose-path").attr("transform", 'translate('+this.width/2+' '+this.height/2+')');
	},

	rose: function(k, r, theta, degrees){
		if (degrees === true){
			theta *= 180 / Math.PI;
		}
		var x = r * Math.cos(k * theta)*Math.cos(theta);
		var y = r * Math.cos(k * theta)*Math.sin(theta);

		return {x:x, y:y};
	},

	//http://stackoverflow.com/questions/17445231/js-how-to-find-the-greatest-common-divisor
	gcd: function(a, b) {
	    if ( ! b) {
	        return a;
	    }

	    return this.gcd(b, a % b);
	}
});