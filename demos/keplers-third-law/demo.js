var demo = new Demo({
	ui: {
		mass: {
			title: "Mass of Star",
			value: 50,
			range: [10, 500],
			resolution: 1,
			// units: "Lunar Masses",
			color: "yellow"
		},
		r1: {
			title: "R1",
			value: 100,
			range: [50, 1000],
			resolution: 1,
			color: "#f60"
			// units: "Lunar Masses"
		},
		r2: {
			title: "R2",
			value: 200,
			range: [50, 1000],
			resolution: 1,
			color: "lightblue"
			// units: "Lunar Masses"
		},
		animate: {
		    title: "Animate",
		    type: "button"
		},
		reset: {
		    title: "Reset",
		    type: "button"
		},
		zoom: {
			title: "Zoom In/Out",
			value: 1,
			range: [1,5],
			resolution: 0.1,
			input: "hidden"
		}
	},
	w1:'',
	w2:'',
	theta1: 0,
	theta2:0,
	t: 0,
	t0: 0,

	init: function(){
		var width = $("#demo").width(); 
		var height = width * 0.67; 
		$(".js-orbit-demo").attr("width", width).attr("height", height);
		$("#demo").append($(".js-orbit-demo"));
		$("#demo").append($(".js-explosion"));

		$(".js-system-wrapper").attr("transform", "translate("+ (width/2) +" "+(height/2) +")");
		$(".js-planet, .js-planet-shadow").attr("cx", this.x).attr("cy", this.y);
		// d='M"+this.x+","+this.y+"l10,10'
		this.w1 = 100 * 1/Math.sqrt(Math.pow(this.ui.r1.value, 3) / this.ui.mass.value),
		this.w2 = 100 * 1/Math.sqrt(Math.pow(this.ui.r2.value, 3) / this.ui.mass.value),
		this.update();
		angle = Math.atan2(this.vy,this.vx);
		modulus = Math.sqrt(Math.pow(this.vx,2)+Math.pow(this.vy,2))
		
		

	_this = this;


	},


	animate: function(){
	    this.animateID = window.requestAnimationFrame(this.animate.bind(this));
	    // if (this.animateCounter % this.animateFPS == 0){
	        // this.animateCounter = 0;
	        this.update();
	    // }
	},


	render: function(){
		$(".js-planet, .js-planet-shadow").attr('cy', this.y1).attr('cx', this.x1);
		$(".js-planet-2, .js-planet-shadow-2").attr('cy', this.y2).attr('cx', this.x2);
	},

	update: function(e){

		this.w1 = 100 * 1/(Math.sqrt(Math.pow(this.ui.r1.value, 3) / this.ui.mass.value));
		this.w2 = 100 * 1/(Math.sqrt(Math.pow(this.ui.r2.value, 3) / this.ui.mass.value));

		if (e == "animate"){

		    this.animate();
		    this.t0 = new Date().getTime();

		   $("#animate-interface button").attr("disabled", true);

		}

		if (e == "zoom"){
			$(".js-drag-line").attr("stroke-width", 4 + 5*(this.ui.zoom.value-1))
			var width = $("#demo").width(); 
			var height = width * 0.67; 
			$(".js-explosion").css("transform", "scale("+(1/this.ui.zoom.value)+")")
			$(".js-system-wrapper").attr("transform", "translate("+ (width/2) +" "+(height/2) +") scale("+(1/this.ui.zoom.value)+")")
		} else if (e == "reset"){
			$("#animate-interface button").attr("disabled", false);
			
			window.cancelAnimationFrame(this.animateID);
			this.theta1 = this.theta2 = 0;
			this.x1 = this.ui.r1.value;
			this.y1 = 0;
			this.x2 = this.ui.r2.value;
			this.y2 = 0;
			this.render();


		} else if (e == 'mass'){

		} else if (e == 'r1' || e == 'r2'){
			this.x1 = this.ui.r1.value * Math.cos(this.theta1);
			this.y1 = this.ui.r1.value * Math.sin(this.theta1);

			this.x2 = this.ui.r2.value * Math.cos(this.theta2);
			this.y2 = this.ui.r2.value * Math.sin(this.theta2);

			this.render();
		} else {

		t1 = new Date().getTime();
		dt = 0.001 * (t1 - this.t0);
		dt = dt > 0.2 ? 0 : dt;

		this.theta1 = this.theta1 + this.w1 * dt;
		this.theta2 = this.theta2 + this.w2 * dt;


		this.x1 = this.ui.r1.value * Math.cos(this.theta1);
		this.y1 = this.ui.r1.value * Math.sin(this.theta1);

		this.x2 = this.ui.r2.value * Math.cos(this.theta2);
		this.y2 = this.ui.r2.value * Math.sin(this.theta2);

		this.render();


		this.t0 = t1;



	}

	}
});