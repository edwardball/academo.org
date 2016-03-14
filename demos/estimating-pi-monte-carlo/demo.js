var demo = new Demo({
	ui: {
		addOne: {
			title: "Add points one-by-one",
			type: "button"
		},
		animate: {
			title: "Animate",
			value: false,
		},
		speed: {
			title: "Speed",
			value: 1,
			range: [5, 100],
			resolution: 1,
			input: "hidden",
		},
		reset: {
			title: "Reset",
			type: "button"
		},
	},

	animateID: null,
	totalPoints: 0,
	innerPoints: 0,
	radius: 250,

	init: function(){
		$('<canvas>').attr({
			id: "my-canvas",
		    height: "500px",
		    width: "500px",
		}).css({
			width: "100%",
			"max-width": "500px",
			"max-height": "500px",
			"height": "100%",
			"margin": "0 auto",
			"display": "block",
			"border": "solid 1px #CCC"
		}).appendTo('#demo');

		this.scale = d3.scale.linear()
                    .domain([-1, 1])
                    .range([0, 500]);

        this.canvas = document.getElementById("my-canvas");
		this.context = this.canvas.getContext("2d");
		this.initCanvas();
		$("#ui-container").prepend("<div class='interface' id='js-points-data'></div>");
		$("#js-points-data").append("Total Number of points: <span class='js-total-points'>0</span><br />");
		$("#js-points-data").append("Points within circle: <span class='js-inner-points'>0</span><br />");
		$("#js-points-data").append("Pi estimation: <span class='js-pi-estimation'></span><br />");
		

	},

	initCanvas: function(){
		this.context.clearRect(0,0,500,500);
		this.context.strokeStyle = "#999";
		this.context.beginPath();
		this.context.arc(this.scale(0), this.scale(0), this.radius, 0, 2 * Math.PI);
		this.context.stroke();
	},

	animate: function(){
		this.animateID = window.requestAnimationFrame(this.animate.bind(this));
		this.update();
	},

	reset: function(){
		this.totalPoints = 0;
		this.innerPoints = 0;
		this.updateDisplay();
	},

	updateDisplay: function(){
		$(".js-inner-points").html(this.innerPoints);
		$(".js-total-points").html(this.totalPoints);
		var piEstimate = (4 * this.innerPoints / this.totalPoints).toFixed(5);
		if (this.totalPoints == 0){
			piEstimate = "";
		}
		$(".js-pi-estimation").html(piEstimate);
	},

	update: function(e){
		if (e == "speed"){

		} else if (e == "animate" && this.ui.animate.value == true) {
			this.animate();
		} else if (e == "animate" && this.ui.animate.value == false) {
			window.cancelAnimationFrame(this.animateID);
		} else if (e == "reset") {
			this.initCanvas();
			this.reset();
		} else {
			if (e == "addOne"){
				var numberToAdd = 1;
			} else {
				var numberToAdd = this.ui.speed.value;
			}
			for (var i = 0 ; i < numberToAdd ; i++){
				var randomX = Math.random() * 2 - 1;
				var randomY = Math.random() * 2 - 1;
				this.context.beginPath();
				if (Math.pow(this.scale(randomX) - this.scale(0), 2) + Math.pow(this.scale(randomY) - this.scale(0), 2) > Math.pow(this.radius, 2)){
					this.context.fillStyle = "blue";
				} else {
					this.context.fillStyle = "red";
					this.innerPoints++;
				}
				this.context.fillRect(this.scale(randomX),this.scale(randomY),1,1);
				this.totalPoints++;
				this.updateDisplay();
			}
		}
	}
});