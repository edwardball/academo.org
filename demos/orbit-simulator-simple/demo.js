var demo = new Demo({
	ui: {
		speed: {
			title: "Initial horizontal speed",
			value: 100,
			range: [0, 200],
			resolution: 1,
			units: "pixels/second"
			
		},
		animate: {
		    title: "Animate",
		    type: "button"
		},
		reset: {
		    title: "Reset Moon",
		    type: "button"
		},
		zoom: {
			title: "Zoom In/Out",
			value: 1,
			range: [1,5],
			resolution: 0.1,
			input: "hidden"
		},
		// trail: {
		// 	title: "Show Trail?",
		// 	value: true
		// }
	},
	// vx:0,
	vx: 298.23,
	vx: 100.23,
	mass: 50,

	vy: 0,
	x: $("#demo").width()/3,
	x: 0,
	y:0,
	y:$("#demo").width() * 0.67 /3,
	angle:0,
	t: 0,
	t0: 0,
	isDragging: false,
	explosionSpriteIndex:0,
	explosionIntervalRef: null,
	jsTrailData: [],
	savedPosition: {},
	savedVelocity: {},

	init: function(){

		var width = $("#demo").width(); 
		var height = width * 0.67; 
		$(".js-orbit-demo").attr("width", width).attr("height", height);
		$("#demo").append($(".js-orbit-demo"));
		$("#demo").append($(".js-explosion"));

		$(".js-system-wrapper").attr("transform", "translate("+ (width/2) +" "+(height/2) +")");
		$(".js-planet, .js-planet-shadow").attr("cx", this.x).attr("cy", this.y);
		// d='M"+this.x+","+this.y+"l10,10'
		this.update();
		angle = Math.atan2(this.vy,this.ui.speed.value);
		modulus = Math.sqrt(Math.pow(this.ui.speed.value,2)+Math.pow(this.vy,2))
		$(".js-drag-line").attr("d", "M0,0l"+modulus+",0l0,-5l10,5l-10,5,l0,-5").attr("transform", "translate("+this.x +" "+this.y+") rotate("+angle*180/Math.PI+")");
		

		this.jsTrailData.push([this.x, this.y]);

		// $("#demo .js-system-wrapper").append();
		// $("#demo .js-system-wrapper").append('');
		  // .attr('class', 'link dragline hidden')
		  // .attr('d', '');

	_this = this;

	// $(".js-planet, .js-drag-line, #marker").on("mousedown touchstart", function(e){
	// 	e.preventDefault();
	// 	_this.isDragging = true;
	// 	// alert("dragging");
	// })

	// $("#demo svg").touchstart(function(e){
	// 	e.preventDefault();
	// 	return false;
	// })

	

	// $(".js-orbit-demo").mousedown(function(e){
	// 	// console.log(e, e.layerX);
	// 	if (!_this.isDragging){
	// 		var eoffsetX = (e.offsetX || e.clientX - $(e.target).offset().left + window.pageXOffset );
	// 		var eoffsetY = (e.offsetY || e.clientY - $(e.target).offset().top + window.pageYOffset );
	// 		_this.x = (eoffsetX-width/2)*(_this.ui.zoom.value);
	// 		_this.y = (eoffsetY-height/2)*(_this.ui.zoom.value);
	// 		$(".js-planet, .js-planet-shadow").attr('cy', _this.y).attr('cx', _this.x);
	// 		angle = Math.atan2(_this.vy,_this.ui.speed.value);
	// 		modulus = Math.sqrt(Math.pow(_this.vy,2) + Math.pow(_this.ui.speed.value,2))
	// 		$(".js-drag-line").attr("d", "M0,0l"+modulus+",0l0,-5l10,5l-10,5,l0,-5").attr("transform", "translate("+_this.x +" "+_this.y+") rotate("+angle*180/Math.PI+")");
	// 		$(".js-trail").attr("d", "");
	// 		_this.jsTrailData = [];
	// 		_this.jsTrailData.push([_this.x, _this.y]);
	// 	}

	// })

	  // $("#demo, .js-planet, .js-drag-line").on("mousemove touchmove", function(e){
	  // 	if (_this.isDragging){
	  // 		if (typeof window.ontouchmove != "undefined"){
	  // 			var eoffsetX = e.originalEvent.touches[0].pageX - $( ".js-orbit-demo" ).offset().left
	  // 			var eoffsetY = e.originalEvent.touches[0].pageY - $( ".js-orbit-demo" ).offset().top
	  // 		} else {
		 //  		var eoffsetX = (e.offsetX || e.clientX - $( ".js-orbit-demo" ).offset().left + window.pageXOffset );
		 //  		var eoffsetY = (e.offsetY || e.clientY - $( ".js-orbit-demo" ).offset().top + window.pageYOffset );
	  			
	  // 		}
	  // 		zoom = _this.ui.zoom.value;
		 //  	angle = Math.atan2((eoffsetY-height/2 - _this.y/zoom),(eoffsetX-width/2 - _this.x/zoom));
		 //  	modulus = zoom* Math.sqrt(Math.pow((eoffsetY-height/2 - _this.y/zoom),2) + Math.pow((eoffsetX-width/2 - _this.x/zoom),2))
		 //  	$(".js-drag-line").attr("d", "M0,0l"+modulus+",0l0,-5l10,5l-10,5,l0,-5").attr("transform", "translate("+_this.x +" "+_this.y+") rotate("+angle*180/Math.PI+")");
		 //  	// _this.ui.speed.value = (eoffsetX-width/2) - _this.x;
		 //  	// _this.vy = (eoffsetY-height/2 - _this.y);
		 //  	_this.ui.speed.value = modulus*Math.cos(angle);
		 //  	_this.vy = modulus*Math.sin(angle);

		 //  }
	  // })
	},

	explode: function(){
		$(".js-explosion").css("display", "block");
		this.explosionIntervalRef = setInterval(this.moveExplosionSprite, 40);

	},

	moveExplosionSprite: function(){
		if (demo.explosionSpriteIndex < 20){
			x  = demo.explosionSpriteIndex % 5;
			y  = Math.floor(demo.explosionSpriteIndex / 5);
			$(".js-explosion").css("background-position", -x*96 + "px " + -y*96 + "px");
			demo.explosionSpriteIndex += 1;
		} else {
			window.clearTimeout(demo.explosionIntervalRef);
			demo.explosionSpriteIndex = 0;
			$(".js-explosion").css("display", "none");
		}

	},

	animate: function(){
	    this.animateID = window.requestAnimationFrame(this.animate.bind(this));
	    // if (this.animateCounter % this.animateFPS == 0){
	        // this.animateCounter = 0;
	        this.update();
	    // }
	},

	force: function(distance){
		distanceAbs = Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y,2));
		return {x:-20000 * this.mass * 1.85 * distance.x / Math.pow(distanceAbs,3), y:-20000* this.mass*1.85 * distance.y / Math.pow(distanceAbs,3)}
	},

	render: function(){
		$(".js-planet, .js-planet-shadow").attr('cy', this.y).attr('cx', this.x);
	},

	update: function(e){


		

		if (e == "animate"){
		    this.savedVelocity.x = this.ui.speed.value;
		    this.savedVelocity.y = this.vy;
		    this.savedPosition.x = this.x;
		    this.savedPosition.y = this.y;
		    this.animate();
		    this.t0 = new Date().getTime();
		    $(".js-drag-line").css("display", "none");
		   $("#animate-interface button").attr("disabled", true);
		   $("#speed-interface").css("pointer-events", "none").css("opacity", "0.25");

		}

		if (e == "zoom"){
			$(".js-drag-line").attr("stroke-width", 4 + 5*(this.ui.zoom.value-1))
			var width = $("#demo").width(); 
			var height = width * 0.67; 
			$(".js-explosion").css("transform", "scale("+(1/this.ui.zoom.value)+")")
			$(".js-system-wrapper").attr("transform", "translate("+ (width/2) +" "+(height/2) +") scale("+(1/this.ui.zoom.value)+")")
		} else if (e == "reset"){
			$("#speed-interface").css("pointer-events", "auto").css("opacity", "1");
			$("#animate-interface button").attr("disabled", false);
			$(".js-planet, .js-planet-shadow").css("display", "block");
			window.cancelAnimationFrame(this.animateID);
			this.ui.speed.value = this.savedVelocity.x;
			this.vy = this.savedVelocity.y;
			this.y = this.savedPosition.y;
			this.x = this.savedPosition.x;
			$(".js-planet, .js-planet-shadow").attr('cy', this.y).attr('cx', this.x);
			$(".js-drag-line").attr("transform", "translate("+_this.x +" "+_this.y+")");
			angle = Math.atan2(this.vy,this.ui.speed.value);
			modulus = Math.sqrt(Math.pow(this.vy,2) + Math.pow(this.ui.speed.value,2))
			$(".js-drag-line").attr("d", "M0,0l"+modulus+",0l0,-5l10,5l-10,5,l0,-5").attr("transform", "translate("+_this.x +" "+_this.y+") rotate("+angle*180/Math.PI+")");

			$(".js-trail").attr("d", "");
			this.jsTrailData = [];
			this.jsTrailData.push([this.x, this.y]);
		    $(".js-drag-line").css("display", "block");


		} else if (e == "trail"){
			if (this.ui.trail.value){
				$(".js-trail").attr("opacity", 1);
			} else {
				$(".js-trail").attr("opacity", 0);
			}
		} else if (e == 'mass'){

		} else if (e == 'speed'){
			modulus = Math.sqrt(Math.pow(this.vy,2) + Math.pow(this.ui.speed.value,2))
			$(".js-drag-line").attr("d", "M0,0l"+modulus+",0l0,-5l10,5l-10,5,l0,-5").attr("transform", "translate("+this.x +" "+this.y+")");

		} else {

		t1 = new Date().getTime();
		dt = 0.001 * (t1 - this.t0);
		dt = dt > 0.2 ? 0 : dt;

		var distance = {};
		distance.x = this.x
		distance.y = this.y;


		var force = this.force(distance);
		var fx = force.x;//-1000 * 1.85 * distance.x / Math.pow(distanceAbs,3);
		var fy = force.y;//-1000 * 1.85 * distance.y / Math.pow(distanceAbs,3);

		p1x = this.x;
		v1x = this.ui.speed.value;
		a1x = fx;

		p1y = this.y;
		v1y = this.vy;
		a1y = fy;

		p2x = p1x + v1x * (dt/2);
		p2y = p1y + v1y * (dt/2);

		
		v2x = v1x + a1x * (dt/2);
		var force = this.force({x:p2x, y:p2y});
		var fx = force.x;//-1000 * 1.85 * distance.x / Math.pow(distanceAbs,3);
		var fy = force.y;//-1000 * 1.85 * distance.y / Math.pow(distanceAbs,3);
		a2x = fx;

		v2y = v1y + a1y * (dt/2);
		a2y = fy;

		p3x = p1x + v2x * (dt/2);
		p3y = p1y + v2y * (dt/2);
		var force = this.force({x:p3x, y:p3y});
		var fx = force.x;//-1000 * 1.85 * distance.x / Math.pow(distanceAbs,3);
		var fy = force.y;//-1000 * 1.85 * distance.y / Math.pow(distanceAbs,3);
		a3x = fx;
		a3y = fy;

		v3x = v1x + a2x * (dt/2);
		v3y = v1y + a2y * (dt/2);


		p4x = p1x + v3x * (dt);
		p4y = p1y + v3y * (dt);
		var force = this.force({x:p4x, y:p4y});
		var fx = force.x;//-1000 * 1.85 * distance.x / Math.pow(distanceAbs,3);
		var fy = force.y;//-1000 * 1.85 * distance.y / Math.pow(distanceAbs,3);
		a4x = fx;
		a4y = fy;

		v4x = v1x + a3x * (dt);
		v4y = v1y + a3y * (dt);






		this.x = this.x + (v1x + 2*v2x + 2*v3x + v4x)*dt/6;
		this.y = this.y + (v1y + 2*v2y + 2*v3y + v4y)*dt/6;

		this.ui.speed.value = this.ui.speed.value + (a1x + 2*a2x + 2*a3x + a4x)*dt/6;
		this.vy = this.vy + (a1y + 2*a2y + 2*a3y + a4y)*dt/6;

		this.jsTrailData.push([this.x, this.y]);
		if (this.jsTrailData.length > 100000){
			this.jsTrailData.shift();
		}
		var trailString = "M";
		 trailString += this.jsTrailData[0][0] + "," + this.jsTrailData[0][1] + " ";
		 var step = this.mass > 200 ? 1 : 3;
		for (var i = 1 ; i < this.jsTrailData.length ; i+=step){
			trailString += "L" + this.jsTrailData[i][0] + "," + this.jsTrailData[i][1] + " ";
		}

		$(".js-trail").attr("d", trailString);

		this.render();
		//collision detection
		//planet radius = 10, sun radius  =30

		var distance = Math.sqrt(this.x*this.x + this.y*this.y);
		if (distance < 40){
			angle = Math.atan2(this.y, this.x);
			$(".js-explosion").css("margin-top", -48+24*Math.sin(angle)*(1/this.ui.zoom.value)).css("margin-left", -48+24*Math.cos(angle)*(1/this.ui.zoom.value))
			this.explode();
			$(".js-planet, .js-planet-shadow").css("display", "none");
			window.cancelAnimationFrame(this.animateID);
		} else {
		}


		this.t0 = t1;



	}

	}
});