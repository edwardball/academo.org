/*
+---------------------------------------------------------+
| Edward Ball, Frances Ruiz, and Michael Ruiz             |
+---------------------------------------------------------|
| License:                                                |
| Creative Commons Attribution-NonCommerial 4.0 Unported  |
| http://creativecommons.org/licenses/by-nc/4.0/legalcode |
+---------------------------------------------------------+
| You are free to (for noncommercial use):                |
|                                                         |
| Share — copy and redistribute the material in any       |
|         medium or format                                |
| Adapt — remix, transform, and build upon the material   |
|                                                         |
| The licensor cannot revoke these freedoms as long as    |
| you follow the license terms.                           |
|                                                         |
| Attribution — You must give appropriate credit, include |
| this license, and indicate if changes were made. You    |
| may do so in any reasonable manner, but not in any way  |
| that suggests the licensor endorses you or your use.    |
|                                                         |
| Sample Web Credit Line:                                 |
|    Courtesy Edward Ball, Frances and Michael Ruiz       |
|                                                         |
| NonCommercial — You may not use the material for        |
|   commercial purposes.                                  |
|                                                         |
| No additional restrictions — You may not apply legal    |
| terms or technological measures that legally restrict   |
| others from doing anything the license permits.         |
+---------------------------------------------------------+

Note that a secure server (HTTPS) is needed to run the
program. If you wish to run the program from your desktop
you will need a local server such as WAMP (PC) or MAMP (Mac).

The reason is due to Browser Security issues since we need
to access the user's microphone.

*/

function Oscilloscope(id, userSettings){

	this.selector = id;

	if (typeof userSettings == "undefined"){
		var userSettings = {};
	}

	var _this = this;

	var AudioContext = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);

	$(window).on("mousemove click scroll", function(){
		if (_this.audioContext.state !== 'running' ){
			_this.audioContext.resume();
		}
	});

	$('body').on("click", "#userInterfaceInitializer", function(){
		$(this).hide();
		console.log("test");
		if (_this.audioContext.state !== 'running' ){
			_this.audioContext.resume();
		}
	});

	this.demo = document.getElementById(this.selector.substring(1)); // use substring to remove initial #

	this.audioContext = new AudioContext();
	this.gainNode = this.audioContext.createGain();
	this.analyser = this.audioContext.createAnalyser();

	// could be confusing, but this is the gain on the oscilloscope, different to the gainNode affecting input gainNode
	this.gainNode.gain.value = 1;


	this.analyser.smoothingTimeConstant = .9;
	// this.analyser.fftSize = 4096;
	try {
		this.analyser.fftSize = 8192;
	} catch(err) {
		// we are in a browser with limited fft size
		this.analyser.fftSize = 2048;
	}
	this.gainNode.connect(this.analyser);
	// frequencyBinCount is readonly and set to fftSize/2;
	this.timeDomain = new Uint8Array(this.analyser.frequencyBinCount);
	this.streaming = false;
	this.sampleRate = this.audioContext.sampleRate;
	this.numSamples = this.analyser.frequencyBinCount;

	this.animateId;
	this.previousTranslate = {x:0, y:0};

	this.playingFile = false;
	this.audio = new Audio();
	this.audio.controls = true;
	this.fileStream = this.audioContext.createMediaElementSource(this.audio);

	this.isRunning = false;

	this.horizontalScale = 4;
	this.freezeValue = false;
	this.gridLinesStatus = "on";

	this.padding = {
		top:50,
		right: 30,
		bottom: 180,
		left:40
	}

	this.graphGain = 2;

	this.userInterface = [
		{
	        title: "Time (ms)",
	        property: "horizontalScale",
	        options: [
	        	{
					//title: "0.25 ms",
					//value: 0.05
	        //	},{
					//title: "0.5 ms",
					//value: 0.1
	        //	},{
					title: "1 ms",
					value: 0.2
	         	},{
					title: "2 ms",
					value: 0.4
	        	},{
					title: "5 ms",
					value: 1
	        	},{
					title: "10 ms",
					value: 2
	        	},{
					title: "20 ms",
					value: 4,
					selected: true
	        	},{
					title: "50 ms",
					value: 10
	        	}
	        ]
	       },{
	        title: "Refresh Rate",
	        property: "refreshRate",
	        options: [{
					title: "Slow",
					value: 128,
					selected: true
	        	},{
					title: "Fast",
					value: 64
	        	},]
		    },{
	        title: "Sensitivity",
	        property: "sensitivity",
	        options: [{
					title: "Low",
					value: 1
	        	},{
					title: "Medium",
					value: 2,
					selected: true
	        	},{
	        		title: "High",
					value: 4,
	        	},{
	        		title: "Very High",
					value: 16,
	        	}
	        ]
	    },{
	        title: "Grid",
	        property: "gridLinesStatus",
	        options: [{
					title: "On",
					value: "on",
					selected: true
	        	},{
					title: "Off",
					value: "off"
	        	},]
	    },{
	        title: "Mic",
	        property: "micInput",
	        options: [{
					title: "On",
					value: "on",
	        	},{
					title: "Off",
					value: "off",
					selected: true
	        	},]
	    },{
	        title: "Freeze live input",
	        property: "freezeValue",
	        options: [{
					title: "True",
					value: true
	        	},{
					title: "False",
					value: false,
					selected: true
	        	},]
	    }
       ];


	this.mapRange = function(from, to, s) {
		return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
	};

	this.init = function(){
		this.setupCanvases();
		this.insertStyles();
		this.createMarkup();
		this.createFileInput();
    this.initialiseFileUploader();
		this.initialiseDropdownBox();
		this.setupAudioElementEvents();
		this.createGrid();

		$("#ui-container-osc input, #ui-container-osc select").on("change", function(){
			if ($(this).attr("name") == "horizontalScale"){
				_this.horizontalScale = $(this).val();
				_this.createGrid();
				_this.drawData();
			}
			if ($(this).attr("name") == "freezeValue"){
				if ($(this).prop("checked") == true){
					_this.freezeValue = true;
					window.cancelAnimationFrame(_this.animateId);
					_this.animateId = undefined;
					_this.drawData();
				} else {
					_this.freezeValue = false;
					_this.animateId = requestAnimationFrame(_this.animate.bind(_this));

				}
			}
			if ($(this).attr("name") == "gridLines"){
				if ($(this).prop("checked") == true){
					_this.gridLinesStatus = "on";
				} else {
					_this.gridLinesStatus = "off";
				}
				_this.createGrid();
			}

			if ($(this).attr("name") == "refreshRate"){
				timeoutDuration = $(this).val();
			}

			if ($(this).attr("name") == "sensitivity"){
				_this.graphGain = $(this).val();
				_this.drawData();
			}


			if ($(this).attr("name") === "micInput"){
				if ($(this).prop("checked") == true){
					_this.mediaStreamSource.connect(_this.gainNode);
					_this.streaming = true;
					_this.animateId = requestAnimationFrame(_this.animate.bind(_this));
				} else {
					_this.streaming = false;
					_this.mediaStreamSource.disconnect();
					window.cancelAnimationFrame(_this.animateId);
					_this.animateId = undefined;
				}
			}
		});
	};

	this.insertStyles = function(){
		var style = "<style>";
		//style += this.selector + " {position:relative;background: #5db1a2; width: ";
		style += this.selector + " {position:relative;background: #5db1a2; width: ";
		style += (this.c2.width + this.padding.right + this.padding.left);
		style += "px;height:";
		style += (this.c2.height + this.padding.top + this.padding.bottom - 40);
		style += "px}";
		style += this.selector + " canvas{position: absolute;display: block;}";
		style += this.selector + " #ui-container-osc{position:absolute;bottom:-15px;left:0;width: 100%;padding:20px 20px 20px 32px;box-sizing: border-box;z-index:1;font-family:arial;font-size:12px}";
		style += this.selector + " .interface{display: inline-block;}";
		style += this.selector + " .checkbox{display: inline-block;}";
		style += this.selector + " label{padding-right:10px;margin-bottom: 10px;}";
		style += this.selector + " audio{display: block;margin-top:5px;}";
		style += this.selector + " select[name='audioFile']{width:120px;}";
		style += this.selector + " canvas{top:" + this.padding.top + "px;left:" + this.padding.left + "px}";
		style += this.selector + " #c3{top:" + (this.padding.top - 40) + "px;left:" + (this.padding.left - 20) + "px}";
		style += this.selector + " #c{background:white}";
		style += this.selector + " .dropdown {float: left;height:25px;border-right: solid 1px white;padding: 0 10px 0px;margin-bottom:5px}";
		style += this.selector + " #audio-file{margin-top:10px;}";
		style += this.selector + " audio{float:right;width:260px;}";
		style += this.selector + " #audioDropdown{margin-bottom:20px;border-right:none;} #audioDropdown audio {padding-left:10px;height:26px;width:235px} #audioDropdown input {margin-left: 10px;margin-top:10px;}";
		style += this.selector + " #userInterfaceInitializer:after{content: \"Click here to launch the oscilloscope\";color: white;font-family: sans-serif;text-transform: uppercase;text-align: center;width: 100%;position: absolute;top: 50%;transform: translateY(-50%);letter-spacing: 1px;cursor: pointer;}"
		style += "</style>";
		$(style).appendTo("head");
	}

	this.initialiseFileUploader = function(){
		this.fileInput = $("#audio-file");
		$("#upload").click(function(){
			$("#audio-file").click();
		})
		this.fileInput.on("change", function(e) {
			_this.audio.pause();
			//window.cancelAnimationFrame(animationID);
			//see http://lostechies.com/derickbailey/2013/09/23/getting-audio-file-information-with-htmls-file-api-and-audio-element/
			var file = e.currentTarget.files[0];
			var objectUrl = URL.createObjectURL(file);
			_this.audio.src = objectUrl;

			$("select[name='audioFile']")
				.append($("<option></option>")
				.text(file.name)
				.attr("value", objectUrl)
				.attr("selected", "true")); 
		});
	};

	this.setupCanvases = function(){
		this.c = document.createElement("canvas"); // for gridlines
		this.c2 = document.createElement("canvas"); // for animated line
		this.c3 = document.createElement("canvas"); // for axis labels etc
		this.c.setAttribute("id", "c"); 
		this.c3.setAttribute("id", "c3"); 
		var w = window;
		screenHeight = w.innerHeight;
		screenWidth = w.innerWidth;
		this.c.width = 500;
		this.c.height = 200;
		this.c2.width = 500;
		this.c3.width = this.c2.width + 55; // needs 50 so labels don't get cut off
		this.c2.height = 262;
		this.c2.height = 200;
		this.c3.height = this.c2.height + 40 + 40;

		this.demo.appendChild(this.c);
		this.demo.appendChild(this.c2);
		this.demo.appendChild(this.c3);

		// need to create a div for the user to interact with so the audio context can start
		var userInterfaceInitializer = document.createElement('div');
		userInterfaceInitializer.style.cssText = "position: absolute;width: 100%;height: 100%;background: rgb(0,0,0,0.75);z-index: 100;";
		userInterfaceInitializer.setAttribute("id", "userInterfaceInitializer");

		this.demo.appendChild(userInterfaceInitializer)

		midPoint = {x: this.c.width/2, y: this.c.height/2};

		this.ctx = this.c.getContext("2d");
		this.ctx2 = this.c2.getContext("2d");
		this.ctx3 = this.c3.getContext("2d");
	}

	this.createMarkup = function(){
		$(this.selector).append($('<div class="clearfix" id="ui-container-osc"></div>'));
		for (var i = 0 ; i < this.userInterface.length ; i++){
			//add checkbox for gridlines, dropdown for everything else
			if(this.userInterface[i].property == "gridLinesStatus" || this.userInterface[i].property == "micInput" || this.userInterface[i].property == "freezeValue"){
				
			if(this.userInterface[i].property == "gridLinesStatus"){
					$("#ui-container-osc").append($("<div class='dropdown'><label for='gridlines-toggle'>"+this.userInterface[i].title+"</label><input name='gridLines' id='gridlines-toggle' type='checkbox' checked/></div>"));
				} else if (this.userInterface[i].property == "freezeValue"){
					$("#ui-container-osc").append($("<div class='dropdown'><label for='freeze-value'>"+this.userInterface[i].title+"</label><input name='freezeValue' id='freeze-value' type='checkbox' /></div>"));
				} else {
					$("#ui-container-osc").append($("<div class='dropdown'><label for='mic-toggle'>"+this.userInterface[i].title+"</label><input name='micInput' id='mic-toggle' type='checkbox' /></div>"));
				}
			} else {
				$("#ui-container-osc").append($(this.createDropdownHTML(this.userInterface[i])));
			}
		}
		$("#ui-container-osc .dropdown:last").css("border-right", "none");
	}

		this.createDropdownHTML = function(settings){
		var title = settings.title;
		var property = settings.property;
		var options = settings.options;
		var html = "<div class='dropdown'>";
		if(title)
			html += "<label for='"+property+"'>"+title+"</label>";
		html += "<select autocomplete='off' name='"+property+"'>";
		for (var i = 0 ; i < options.length ; i++){
			var selected = options[i].selected === true ? "selected" : "";
			html += "<option "+ selected +" value='"+options[i].value+"'>"+options[i].title+"</option>"
		}
		return html + "</select></div>";
	};
	
	this.initialiseDropdownBox = function(){

		$(this.selector + " select[name='audioFile']").on("change", function(){
			_this.audio.pause();
			_this.audio.src = $(this).val();
		});
		_this.audio.src = $(this.selector + " select[name='audioFile']" + " option:selected").val();
	};

	this.update = function(el){

		if (el == 'inputType'){
			this.streaming = true;
		} else if (el == 'inputType' ){
			this.streaming = false;
			window.cancelAnimationFrame(this.animateId);
			this.animateId = undefined;
			this.drawData();
		} else if (streaming == true && this.userInterface.freeze.value == false){
			this.animate();
		} else {
			this.drawData();
		}
	}
	
	this.createFileInput = function(){
		var audioFileSettings = {
			title: null,
			property: "audioFile",
			options: [{
					title: "Baby",
					value: "../oscilloscope-sounds/baby.mp3",
					selected: true
				},{
					title: "Baby 'Ok'",
					value: "../oscilloscope-sounds/baby_OK.mp3",
				},{
		 			title: "Banging",
					value: "../oscilloscope-sounds/banging.mp3",
				},{
		 			title: "Bassoon: www.philharmonia.co.uk&nbsp;",
					value: "../oscilloscope-sounds/phil_bassoon.mp3",
				},{
					title: "Bell: UNC Asheville, J. Todd&nbsp;",
					value: "../oscilloscope-sounds/bell.mp3",
				},{
					title: "Birds",
					value: "../oscilloscope-sounds/birds.mp3",
				},{
					title: "Chimes: Regi Blackburn&nbsp;",
					value: "../oscilloscope-sounds/chimes.mp3",
				},{
					title: "Dogs: Owners Bob & Julie Roepnack ",
					value: "../oscilloscope-sounds/dogs.mp3",
				},{
					title: "Exotic Bird: Greensboro Science Center&nbsp;",
					value: "../oscilloscope-sounds/exotic_bird.mp3",
				},{
					title: "Flute: Isabel Ferber",
					value: "../oscilloscope-sounds/flute.mp3",
				},{
					title: "French Horn: www.philharmonia.co.uk&nbsp;",
					value: "../oscilloscope-sounds/phil_french_horn.mp3",
				},{
					title: "Funny Voices: Daniel Simon&nbsp;",
					value: "../oscilloscope-sounds/funny_voices_daniel_simon.mp3",
				},{
					title: "Hey: M. Alyssa Meadows",
					value: "../oscilloscope-sounds/hey.mp3",
				},{
					title: "Jet: Dave Isenor",
					value: "../oscilloscope-sounds/jet.mp3",
				},{
					title: "Lion: Little Rock Zoo",
					value: "../oscilloscope-sounds/lion.mp3",
				},{
					title: "Major Scale: Ana C. Scott&nbsp;",
					value: "../oscilloscope-sounds/major_scale.mp3",
				},{
					title: "Miter Saw: Joe Gosnell",
					value: "../oscilloscope-sounds/miter_saw.mp3",
				},{
		 			title: "Oboe: www.philharmonia.co.uk&nbsp;",
					value: "../oscilloscope-sounds/phil_oboe.mp3",
				},{
					title: "Orchestra: Allan Dennis & mya.org&nbsp;",
					value: "../oscilloscope-sounds/orchestra.mp3",
				},{
					title: "Saxophone: James Berlyn",
					value: "../oscilloscope-sounds/saxophone.mp3",
				},{
					title: "Scream: Madeleine Boone",
					value: "../oscilloscope-sounds/scream.mp3",
				},{
					title: "Siamangs: Omaha, NE Zoo",
					value: "../oscilloscope-sounds/siamangs.mp3",
				},{
					title: "Sirens: BluelightTV&nbsp;",
					value: "../oscilloscope-sounds/sirens.mp3",
				},{
					title: "Soprano",
					value: "../oscilloscope-sounds/soprano.mp3",
				},{
					title: "Sweeping Sine",
					value: "../oscilloscope-sounds/sweep.mp3",
				},{
					title: "Theremin: Casey Robinson",
					value: "../oscilloscope-sounds/theremin.mp3",
				},{
					title: "Thunder: rhondle",
					value: "../oscilloscope-sounds/thunder.mp3",
				},{
					title: "Tom-Toms: www.philharmonia.co.uk&nbsp;",
					value: "../oscilloscope-sounds/phil_tom_toms.mp3",
				},{
					title: "Train",
					value: "../oscilloscope-sounds/train.mp3",
				},{
					title: "Trombone: www.philharmonia.co.uk&nbsp;",
					value: "../oscilloscope-sounds/phil_trombone.mp3",
				},{
					title: "Tuba: Bud Holmes 24 Harmonics&nbsp;",
					value: "../oscilloscope-sounds/tuba.mp3",
				},{
					title: "Vibrato Sound",
					value: "../oscilloscope-sounds/vibrato.mp3",
        },{
					title: "Viola: www.philharmonia.co.uk&nbsp;",
					value: "../oscilloscope-sounds/phil_viola.mp3",
				},{
					title: "Violin: Willy Michel",
					value: "../oscilloscope-sounds/violin.mp3",
				},{
					title: "Vowels: M. J. Ruiz",
					value: "../oscilloscope-sounds/vowels.mp3",
				},{
		 			title: "Waterfall: Looking Glass, NC&nbsp;",
					value: "../oscilloscope-sounds/waterfall.mp3",
				}]
		}
		$("#ui-container-osc").prepend($('<div class="dropdown" id="audioDropdown"></div>'));
		$("#audioDropdown").prepend($(this.createDropdownHTML(audioFileSettings)).find("select"));
		$("#audioDropdown").append("<input id='audio-file' type='file' name='file' style='display:none'>").append("<input id='upload' type='button' value='Choose file...'>");
		$("#audioDropdown").append(this.audio);
	}

	this.setupAudioElementEvents = function(){


		this.audio.onplay = function(){
			if (_this.streaming){
				_this.mediaStreamSource.disconnect(_this.gainNode);
			}
			_this.fileStream.connect(_this.gainNode);
			_this.fileStream.connect(_this.audioContext.destination);
			_this.streaming = false;
			_this.playingFile = true;
			if (!_this.animateId){
				_this.animateId = window.requestAnimationFrame(_this.animate.bind(_this));
			}
		};

		this.audio.addEventListener('ended', function(){
			_this.fileStream.disconnect();
			window.cancelAnimationFrame(_this.animateId);
			_this.animateId = undefined;
		});

		this.audio.addEventListener('pause', function(){
			_this.fileStream.disconnect();
			window.cancelAnimationFrame(_this.animateId);
			_this.animateId = undefined;
		});
	}

	this.gotStream = function(stream){

	    _this.mediaStreamSource = _this.audioContext.createMediaStreamSource(stream);
	    _this.mediaStreamSource.connect(_this.gainNode);
	    _this.streaming = true;

	}

	this.animate = function(){

	    this.drawData();

	    if (_this.animateId){
			if (this.streaming == true && this.freezeValue == false){
				this.analyser.getByteTimeDomainData(this.timeDomain);
				window.requestAnimationFrame(this.animate.bind(this));
			} else if (this.playingFile == true){
				this.analyser.getByteTimeDomainData(this.timeDomain);
				window.requestAnimationFrame(this.animate.bind(this));
			}
		}

	}

	this.clearGrid = function(){
		this.ctx.clearRect(0, 0, this.c.width, this.c.height);
		this.ctx3.clearRect(0, 0, this.c3.width, this.c3.height);
	}

	this.createGrid = function(){
		this.clearGrid(this.ctx);
		this.ctx3.textAlign = "center";
		this.ctx3.font = "20px Arial";
		this.ctx3.fillText("Oscilloscope", this.c3.width/2, 20);
		this.ctx3.font = "14px Arial";

		this.ctx3.fillText("1", 5, 40 + 5)
		this.ctx3.fillText("0", 5, this.c3.height/2 + 5)
		this.ctx3.fillText("-1", 5, this.c3.height - 40 + 5)

		this.ctx.beginPath();
		this.ctx.moveTo(0, midPoint.y);
		this.ctx.lineTo(this.c.width, midPoint.y);
		
		this.ctx.strokeStyle = "blue";
		
		this.ctx.lineWidth = '1';
		this.ctx.globalCompositeOperation = 'source-over';
		this.ctx.stroke();
		this.ctx.closePath();

		this.ctx.beginPath();
		gridLineX = midPoint.x - 100;

		this.ctx.lineWidth = '1';

		var dashesX = 0;
		var secondsLabel = 0;

		var labelCounter = 1;
		while (dashesX <= this.c.width){
			if (labelCounter%5 == 1){
				this.ctx.strokeStyle = 'blue';
				this.ctx3.fillText((Math.round(secondsLabel*100)/100).toString() + " ms", dashesX + 25, this.c3.height - 20)
			} else {
				this.ctx.strokeStyle = 'cyan';
			}

			if (this.gridLinesStatus === "on"){
				this.ctx.moveTo(dashesX, 0);
				this.ctx.lineTo(dashesX, this.c2.height);
				this.ctx.stroke();
				this.ctx.closePath();
				this.ctx.beginPath();
			}
			labelCounter++;

			dashesX += 20;

			secondsLabel += (this.horizontalScale / 5.0); // there are 5 subdivisions per divison
		}

		dashesY = midPoint.y - 20;
		this.ctx.strokeStyle = 'cyan';

		while (dashesY >= 0){
			if (this.gridLinesStatus === "on") {
				this.ctx.moveTo(0, dashesY);
				this.ctx.lineTo(this.c2.width, dashesY);
				this.ctx.stroke();
				this.ctx.closePath();
				this.ctx.beginPath();
			}
			dashesY -= 20;
		}

		dashesY = midPoint.y + 20;

		while (dashesY <= this.c.height){
			if (this.gridLinesStatus === "on") {
				this.ctx.moveTo(0, dashesY);		
				this.ctx.lineTo(this.c2.width, dashesY);
				this.ctx.stroke();
				this.ctx.closePath();
				this.ctx.beginPath();
			}
			dashesY += 20;
		}
	}

	this.drawData = function(){

		this.ctx2.translate(-this.previousTranslate.x, -this.previousTranslate.y);
		this.ctx2.clearRect(0, 0, this.c.width, this.c.height);
		this.ctx2.beginPath();
		this.ctx2.strokeStyle = '#befde5';
		this.ctx2.lineWidth = 1;

		for (var i = -this.analyser.frequencyBinCount/2; i <= this.analyser.frequencyBinCount/2; i++) {
			index = i+this.analyser.frequencyBinCount/2;

			if (this.streaming == true || this.playingFile == true){

				var height = this.c.height * this.timeDomain[i] / 256;
				var offset = this.c.width * (this.analyser.frequencyBinCount/(this.analyser.frequencyBinCount-1)) * i/this.analyser.frequencyBinCount;

				// analyser.getByteTimeDomainData(timeDomain);

				var xc = i * (this.c.width/this.analyser.frequencyBinCount);
				// var yc = ui.gain.value * ((timeDomain[index] / 255) - 0.5)*200/(ui.volts.value);
				// var yc = 1 * ((this.timeDomain[index] / 255) - 0.5)*200/(1);
				var yc = this.graphGain * ((this.timeDomain[index] / 255) - 0.5)*200/(1);

				yc += this.c.height/2;

				// apply dc offset
				//yc = ui.dc_offset.value*-1 + yc;

				xc = this.mapRange([0, 0.001*this.horizontalScale], [0, 100 * (this.numSamples/this.sampleRate) / c.width], xc);
				// xc = this.mapRange([0, 0.001*this.horizontalScale],

    //            [0, 100 * (this.numSamples/this.sampleRate) / c.width], xc);

				// shift graph to middle of oscilloscpe
				// uncomment this if we want the data to be centered around the middle
				xc += this.c.width/2;

				this.ctx2.lineTo(xc, yc);

			} 

		}

		this.ctx2.strokeStyle = (typeof (userSettings.lineColor) != "undefined")
                            ? userSettings.lineColor : "red";
		this.ctx2.lineWidth = (typeof (userSettings.lineWidth) != "undefined")
                          ? userSettings.lineWidth : 1;
		this.ctx2.stroke();

	}

	var timeoutDuration = 128;
	(function() {
	    var lastTime = 0;
	    var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
	                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }
	 
	    // if (!window.requestAnimationFrame)
	        window.requestAnimationFrame = function(callback, element) {
	            var currTime = new Date().getTime();
	            // var timeToCall = Math.max(0, 16 - (currTime - lastTime));
	            var timeToCall = Math.max(0, timeoutDuration - (currTime - lastTime));
	            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
	              timeToCall);
	            lastTime = currTime + timeToCall;
	            return id;
	        };
	 
	    if (!window.cancelAnimationFrame)
	        window.cancelAnimationFrame = function(id) {
	            clearTimeout(id);
	        };
	}());



	this.init();

	if (navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)){
		navigator.getUserMedia( {audio:true}, _this.gotStream, function(error) {
			console.log("Capture error: ", error.code);
		});
	} else {
		$("#mic-toggle, label[for=mic-toggle]").css("opacity", 0.3).attr("disabled", true)
		$("#inputType-interface option[value=1]").attr("disabled", true);
		$("#oscilloscope").after("<p>Microphone input is unavailble in this browser. Please try again using the latest version of Chrome or Firefox.</p>");
	};

}