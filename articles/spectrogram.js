// Start of request animation frame shim //
(function() {
	var lastTime = 0;
	var vendors = ['webkit', 'moz'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame =
		window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
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
// End of request animation frame shim //

$(document).ready(function(){
    if (navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)){
        navigator.getUserMedia( {audio:true}, gotStream,function(error) {
            console.log("Capture error: ", error.code);
          });
    } else {
    	$("#mic-toggle").attr("disabled", true);
    };

});

var streaming = false;

function gotStream(stream) {
    // Create an AudioNode from the stream.
    window.mediaStreamSource = spectrogram.context.createMediaStreamSource(stream);    
}


var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
var animationID;

var audio = new Audio();
audio.controls = true;


audio.addEventListener('play', function(){
	window.cancelAnimationFrame(animationID);
	streaming = false;
	$("#mic-toggle").prop("checked", false).attr("checked", false);
	spectrogram.running = true;
	spectrogram.render();
  if (window.mediaStreamSource)
    window.mediaStreamSource.disconnect();
});



audio.addEventListener('ended', function(){
	spectrogram.running = false;
	window.cancelAnimationFrame(animationID);
	spectrogram.audioPlayCount++;
});

audio.addEventListener('pause', function(){
	if (streaming == false){
		spectrogram.running = false;
		window.cancelAnimationFrame(animationID);
	}
});

document.body.appendChild(audio);

function Spectrogram(settings){

	//initialise with defaults or values from settings object
	this.selector = typeof settings.selector === "undefined" ? "#spectrogram" : settings.selector;
	this.labelColor = typeof settings.labelColor === "undefined" ? "#FFF" : settings.labelColor;
	this.backgroundColor = typeof settings.backgroundColor === "undefined" ? "#48a" : settings.backgroundColor;
	this.backgroundImage = typeof settings.backgroundImage === "undefined" ? null : settings.backgroundImage;
    this.alternateLabels = typeof settings.alternateLabels === "undefined" ? true : settings.alternateLabels; // only applies for linear scale. Log scale shows first three and last label
    this.font = typeof settings.font === "undefined" ? "12px times" : settings.font;
    this.gridLines = typeof settings.gridLines === "undefined" ? true : settings.gridLines;
    this.padding = typeof settings.padding === "undefined" ? {top: 20, right: 20, bottom: 150, left: 75} : settings.padding;    
    this.showLabels = typeof settings.showLabels === "undefined" ? true : settings.showLabels;
    this.fftsize = typeof settings.fftsize === "undefined" ? Math.pow(2,12) : settings.fftsize; // This determines the resolution of the spectrogram.  must be a power of 2. Eg 512, 1024, 2048, 4096 etc
    this.smoothingTimeConstant = typeof settings.smoothingTimeConstant === "undefined" ? 0 : settings.smoothingTimeConstant;
    this.width = typeof settings.width === "undefined" ? 540 : settings.width;
    this.height = typeof settings.height === "undefined" ? 250 : settings.height;
    this.sampleLength = typeof settings.sampleLength === "undefined" ? 5 : settings.sampleLength;
    this.frequencyTicks = typeof settings.frequencyTicks === "undefined" ? 11 : settings.frequencyTicks;
    this.tempCanvas = document.createElement('canvas');
    this.scrolling = true;
    
    this.scrollDirection = typeof settings.scrollDirection === "undefined" ? 1 : settings.scrollDirection;


    if (typeof settings.userInterface === "undefined"){
    	this.userInterface = [{
			title: "Frequency",
			property: "frequencyRange",
			options: [{
				title: "0 - 1 kHz",
				value: 1000
			},{
				title: "0 - 5 kHz",
				value: 5000,
				selected: true,
			},{
				title: "0 - 10 kHz",
				value: 10000
			}],
		},{
			title: "Time (s)",
			property: "timeRange",
			options: [{
				title: "0 - 3 s",
				value: 3
			},{
				title: "0 - 5 s",
				value: 5,
				selected: true,
			},{
				title: "0 - 8 s",
				value: 8
			},{
				title: "0 - 10 s",
				value: 10
			}],	
		},{
			title: "Freq. Scale",
			property: "scaleType",
			options: [{
				title: "Linear",
				value: "linear",
				selected: true,
			},{
				title: "Logarithmic",
				value: "logarithmic"
			}],	
		},{
			title: "Color",
			property: "colorScheme",
			options: [{
				title: "Blue",
				value: "blue",
			},{
				title: "Green",
				value: "green"
			},{
				title: "Red",
				value: "red",
				selected: true,
			}],
		},{
			title: "Brightness",
			property: "brightness",
			options: [{
				title: "Low",
				value: 1,
			},{
				title: "Normal",
				value: 1.5,
				selected: true,
			},{
				title: "High",
				value: 2,
			}],	
		},{
			title: "Grid",
			property: "gridLines",
			options: [{
				title: "On",
				value: true,
				selected: true
			},{
				title: "Off",
				value: false
			}],
		},{
			title: "Mic",
			property: "micInput",
			options: [{
				title: "On",
				value: true
			},{
				title: "Off",
				value: false,
				selected: true
			}],
		}]
    } else {
    	this.userInterface = settings.userInterface;
    }

    
    //The following properties are used internally by the spectrogram. You shouldn't need to change these
    var _this = this;
	this.context = new AudioContext();
    this.colorArray = [];
    this.currentX;
    this.previousX;
    this.xWidth;
    this.data = [];
    this.dataTimes = [];
    this.running = false;
    this.audioPlayCount = 0;
    this.brightness = 1;
    this.log = false;
    this.oldTime = 0;
    this.scrollingProgress = 0;
    this.nyquist = this.context.sampleRate/2;
    
    this.colorSchemes = {
    	"blue": ["#000000","#000088","#0000aa","#0000ff", "#0088ff", "#00aaff", "#00ffff", "ccffcc", "ffffcc", "ffffff"],
    	"green": ["#000000","#002200","#004400","#008800", "#00aa00", "#00cc00", "#00ff00", "#00ffff", "ccffcc", "ffffcc"],
    	"red": ["#000000","#4B009F","#6800FB","#8300FF", "#9B129D", "#AF2500", "#BF3B00", "#CE5800", "#DF8400", "#F0BC00", "#FFFC00"]
    }

    this.resetScrolling = function(){
        this.scrollingProgress = 0;
    }

    $(window).on("mousemove click scroll", function(){
		if (_this.context.state !== 'running' ){
			_this.context.resume();
		}
	});


    this.init = function(){

    	this.insertStyles();
    	this.createMarkup();
    	this.canvas = document.getElementById("canvas");
    	this.yAxis = document.getElementById("yAxis");
    	this.ctx = this.canvas.getContext('2d');
    	this.initialiseFileUploader();
    	this.initialiseDropdownBox();
    	this.initialiseDrawGraphButton();

    	this.input = this.context.createMediaElementSource(audio);
    	this.analyser = this.context.createAnalyser();
    	this.analyser.smoothingTimeConstant = this.smoothingTimeConstant;
    	this.analyser.fftSize = this.fftsize;
    	this.freqDomain = new Uint8Array(this.analyser.frequencyBinCount);
    	this.maxIndex = (this.maxFreq / this.nyquist) * this.analyser.frequencyBinCount;

    	// Connect graph.
    	this.input.connect(this.analyser);
    	this.input.connect(this.context.destination);
    	
    	
	    this.parseColorArray();
       	this.renderAxes();
       	this.render();
       	this.blankSlate();

	    //////// Load sound from buffer
	    // this.buffer;

	    // _this = this;
	    // var request = new XMLHttpRequest();
	    // request.open('GET', "/demos/spectrum-analyzer/wave1.mp3", true);
	    // request.responseType = 'arraybuffer';

	    // // Decode asynchronously
	    // request.onload = function() {
	    //   this.context.decodeAudioData(request.response, function(theBuffer) {
	    //     _this.buffer = theBuffer;
	    //     console.log("buffer loaded");
	    //   }, function(){
	    //     //on error
	    //   });
	    // }
	    // request.send();

	    /////////

	};

	this.blankSlate = function(){
		this.ctx.fillStyle = "black";
		this.ctx.fillRect(0,0,this.width,this.height);
    this.resetScrolling();
	};

	this.parseColorArray = function(){
		this.colorArray = [];
		for (var i = 0 ; i < this.hexColorArray.length ; i++){
			this.colorArray[i] = this.hexToRgb(this.hexColorArray[i]);
		}
	};

	this.createMarkup = function(){    	
		// Create and insert all the necessary HTML elements
		$(this.selector)
			.append($('<canvas id="canvas"></canvas>'))
			.append($('<canvas id="yAxis"></canvas>'))
			.append($('<div id="spectrogram-ui-container"></div>'))
		$("#canvas").css({
			"left": this.padding.left,
			"top": this.padding.top,
		});
	
		var audioFileSettings = {
			title: null,
			property: "audioFile",
			options: settings.audioFiles
		}
		$("#spectrogram-ui-container").append($(this.createDropdownHTML(audioFileSettings)));

		for (var i = 0 ; i < this.userInterface.length ; i++){
			//add checkbox for gridlines, dropdown for everything else
			if(this.userInterface[i].property == "gridLines" || this.userInterface[i].property == "micInput"){
				for (var j = 0 ; j < 2 ; j++){
					if (this.userInterface[i].options[j].selected === true){
						if (this.userInterface[i].options[j].value == true){
							var checked = "checked";
						} else {
							var checked = "";
						}
					}
				}
				
				if(this.userInterface[i].property == "gridLines"){
					$("#spectrogram-ui-container").append($("<div class='dropdown'><label for='gridlines-toggle'>"+this.userInterface[i].title+"</label><input name='gridLines' id='gridlines-toggle' type='checkbox' "+checked+"/></div>"));
				} else {
					$("#spectrogram-ui-container").append($("<div class='dropdown'><label for='mic-toggle'>"+this.userInterface[i].title+"</label><input name='micInput' id='mic-toggle' type='checkbox' "+checked+"/></div>"));
				}
			} else {
				$("#spectrogram-ui-container").append($(this.createDropdownHTML(this.userInterface[i])));
			}
		}
		
		$("#spectrogram-ui-container .dropdown:first")
			.append("<input id='audio-file' type='file' name='file'>")
			.append("<input id='upload' type='button' value='Choose File...' style='margin-left: 10px;'>")
			.append($("audio"));
		
		$("#spectrogram-ui-container audio").attr("id", "audio-element");		
		$("#spectrogram-ui-container audio").css("vertical-align", "middle");
		$("#spectrogram-ui-container audio").css("margin-left", "10px");
		$("#spectrogram-ui-container audio").css("height", "26px");
		$("#spectrogram-ui-container audio").css("width", "300px");
		
		$("#spectrogram-ui-container .dropdown:first").css("border-right", "none");
		$("#spectrogram-ui-container .dropdown:last").css("border-right", "none");
		
		$("#spectrogram-ui-container .dropdown:first select").attr("id", "audio-select");
		$("#audio-select").css("width", "120px");
	};

	this.insertStyles = function(){
		var style = "<style>";
		style += "canvas{position: absolute;}";
		if(this.backgroundImage)
			style += "#spectrogram{background: url('"+this.backgroundImage+"'); background-size:cover;}";
		else
			style += "#spectrogram{background: "+this.backgroundColor+";}";
		
		style += ".demo audio{width: 100%;}";
		style += this.selector + "{position:relative;}";
		style += this.selector + " #spectrogram-ui-container{position:absolute;bottom:20px;left:40px;color:"+this.labelColor+";}";
		style += this.selector + " label{margin-bottom:10px;display:block;font:"+this.font+";}";
		style += this.selector + " input[type=file]{display:none}";
		style += ".dropdown {float: left;height:40px;border-right: solid 1px "+this.labelColor+";padding: 0 9px 10px;}";
		style += "</style>"
		$(style).appendTo("head");
	},

	this.initialiseFileUploader = function(){
		this.fileInput = $("#audio-file");
		$("#upload").click(function(){
			$("#audio-file").click();
		})
		this.fileInput.on("change", function(e) {
			audio.pause();
			window.cancelAnimationFrame(animationID);
			//see http://lostechies.com/derickbailey/2013/09/23/getting-audio-file-information-with-htmls-file-api-and-audio-element/
			var file = e.currentTarget.files[0];
			var objectUrl = URL.createObjectURL(file);
			audio.src = objectUrl;
			_this.data = [];
			_this.dataTimes = [];
			_this.audioPlayCount = 0;
			_this.blankSlate();
			
			$("#audio-select")
				.append($("<option></option>")
				.text(file.name)
				.attr("value", objectUrl)
				.attr("selected", "true")); 
		});
	};

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
			audio.pause();
			window.cancelAnimationFrame(animationID);
			_this.blankSlate();
			audio.src = $(this).val();
			_this.data = [];
			_this.dataTimes = [];
			_this.audioPlayCount = 0;
		});
		audio.src = $(this.selector + " select[name='audioFile']" + " option:selected").val();

		this.hexColorArray = this.colorSchemes[$(this.selector + " select[name='colorScheme']").val()];
		this.parseColorArray();

		this.maxFreq = $(this.selector + " select[name='frequencyRange']").val();
		this.brightness = $(this.selector + " select[name='brightness']").val();
		this.log = $(this.selector + " select[name='scaleType']").val() === "logarithmic" ? true : false;
		this.sampleLength = $(this.selector + " select[name='timeRange']").val();
		// this.speed = Math.ceil(this.width/this.sampleLength/60);
		this.speed = this.width/this.sampleLength/60;

		$(this.selector + " select, " + this.selector + " input").on("change", function(){
			if ($(this).attr("name") == "colorScheme"){
				_this.hexColorArray = _this.colorSchemes[$(this).val()];
				_this.parseColorArray();
			} else if ($(this).attr("name") == "frequencyRange"){
				_this.maxFreq = $(this).val();
				_this.maxIndex = (_this.maxFreq / _this.nyquist) * _this.analyser.frequencyBinCount;
				_this.blankSlate();
			} else if ($(this).attr("name") == "brightness"){
				_this.brightness = $(this).val();
			} else if ($(this).attr("name") == "gridLines"){
				_this.gridLines = $(this).prop("checked") === true ? true : false;
			} else if ($(this).attr("name") == "scaleType"){
				_this.log = $(this).val() === "logarithmic" ? true : false;
				_this.blankSlate();
			} else if ($(this).attr("name") == "gridLines"){
				_this.gridLines = $(this).prop("checked") === true ? true : false;
			} else if ($(this).attr("name") == "timeRange"){
				_this.blankSlate();
				_this.sampleLength = $(this).val();
				// _this.speed = Math.ceil(_this.width/_this.sampleLength/60);
				_this.speed = _this.width/_this.sampleLength/60;
			} else if ($(this).attr("name") == "micInput"){
				if (streaming !== true){
					window.cancelAnimationFrame(animationID);
					window.mediaStreamSource.connect(spectrogram.analyser);
					_this.currentTime2 = _this.context.currentTime;
					_this.currentX2 = Math.ceil(_this.context.currentTime * _this.width/_this.sampleLength);
				    streaming = true;
					_this.oldTime = _this.context.currentTime;
					audio.pause();
				    _this.running = true;
					_this.render();
				} else {
					streaming = false;
					if (typeof window.mediaStreamSource === 'object'){
						window.mediaStreamSource.disconnect();
					}
					_this.running = false;
					window.cancelAnimationFrame(animationID);
				}
			}

			_this.rerenderData();
		});
	};

	this.initialiseDrawGraphButton = function(){
		var selector = this.selector;
		$(this.selector + " #play").click(function(){
			if(_this.scrolling != true)
				_this.blankSlate();
			audio.src = $(selector + " select[name='audioFile']" + " option:selected").val();
			audio.play();
			_this.oldTime = _this.context.currentTime;
			_this.previousTime = 0;
		});

		$(this.selector).on("click", "#play-your-own", function(){
			_this.blankSlate();
			//code to load data from file
			audio.pause();
			window.cancelAnimationFrame(animationID);
			// 	//see http://lostechies.com/derickbailey/2013/09/23/getting-audio-file-information-with-htmls-file-api-and-audio-element/
			var file = document.getElementById("audio-file").files[0]
			var objectUrl = URL.createObjectURL(file);
			audio.src = objectUrl;
			_this.data = [];
			_this.dataTimes = [];
			_this.audioPlayCount = 0;
			audio.play();
		});
	};


	this.renderAxes = function(){
	    
	    $(this.selector).width(this.width + this.padding.left + this.padding.right)
		    .height(this.height + this.padding.bottom + this.padding.top)
		    .css("background-color", this.backgroundColor);

    	this.canvas.width = this.width;
    	this.yAxis.width = this.width + this.padding.left + this.padding.right;
    	this.canvas.height = this.height;
    	this.yAxis.height = this.height + this.padding.bottom + this.padding.top;
	};


	this.render = function() {
	    this.renderFreqDomain();
    	this.renderAxesLabels();
    	if (this.running == true){
		    animationID = requestAnimationFrame(this.render.bind(this));
    	}
	};

	this.renderColumn = function(x, columnWidth, dataArray){

		var binWidthFreq = this.nyquist / this.analyser.frequencyBinCount;
		var binWidthHeight = Math.ceil((binWidthFreq/this.maxFreq)*this.height);

		for (var i = 0; i <= this.maxIndex; i++) {

			this.ctx.fillStyle = this.getFullColor(dataArray[i]);

			if (this.log == true){
				var y = this.height - this.height*(Math.log(i*binWidthFreq)/Math.log(this.maxFreq));
				if (i == 0 || i ==1){
					var binWidthHeight = Math.ceil(this.height * Math.log(binWidthFreq)/Math.log(this.maxFreq));
				} else {
					var binWidthHeight = Math.ceil(this.height * (Math.log(i*binWidthFreq) - Math.log((i-1)*binWidthFreq))/Math.log(this.maxFreq));
				}
			} else {
				var y = this.height - this.height*(i/this.maxIndex);
			}

			this.ctx.fillRect(x, y, columnWidth, binWidthHeight);
		}
	}

	this.renderFreqDomain = function() {


		this.analyser.getByteFrequencyData(this.freqDomain);

		// see http://stackoverflow.com/questions/7486085/copying-array-by-value-in-javascript for why this is necessary
		if (this.audioPlayCount == 0){
			this.data.push(new Uint8Array(this.freqDomain));
		}

		var binWidthFreq = this.nyquist / this.analyser.frequencyBinCount;
		var binWidthHeight = Math.ceil((binWidthFreq/this.maxFreq)*this.height);

		if (this.scrolling != true){


			if ($("#audio-element").length > 0){
				this.previousX = this.currentX;
				this.currentX = Math.ceil(document.getElementById("audio-element").currentTime * this.width/this.sampleLength);
				if (this.audioPlayCount == 0){
					this.dataTimes.push(document.getElementById("audio-element").currentTime);
				}
				this.xWidth = this.currentX - this.previousX;
			}

			this.renderColumn(this.currentX-this.xWidth, this.xWidth, this.freqDomain);




		} else { //we have scrolling
			// does this fix jump??
			this.previousX2 = this.currentX2;
			this.currentX2 = Math.ceil(this.context.currentTime * this.width/this.sampleLength);
			// console.log(this.previousX2, this.currentX2);
			this.scrollingProgress += this.speed;
			this.tempCanvas.width = this.width;
			this.tempCanvas.height = this.height;
			var tempCtx = this.tempCanvas.getContext('2d');
			// needs to be declared every time cause it gets reset
			 this.ctx.imageSmoothingEnabled = false; // prevents antialiasing which creates too much blurriness when scrolling
			this.ctx.mozImageSmoothingEnabled = false;
			this.ctx.oImageSmoothingEnabled = false;
			this.ctx.webkitImageSmoothingEnabled = false;
			tempCtx.imageSmoothingEnabled = false;
			tempCtx.mozImageSmoothingEnabled = false;
			tempCtx.oImageSmoothingEnabled = false;
			tempCtx.webkitImageSmoothingEnabled = false;
			tempCtx.drawImage(this.canvas, 0, 0, this.width, this.height);


			if (this.scrollDirection == 1 && this.scrollingProgress < this.width){
				var x = this.scrollingProgress;
			} else if (this.scrollDirection == 1) {
				var x = this.width - this.speed;
			} else {
				var x = 0;
			}

			this.renderColumn(x, this.speed, this.freqDomain);
			
			var d = new Date();
			var milliseconds = d.getTime();

			this.previousX = this.currentX;
			this.currentX = Math.ceil(document.getElementById("audio-element").currentTime * this.width/this.sampleLength);
			this.xWidth = this.currentX - this.previousX;

			// console.log(this.speed);
			if (this.scrollingProgress >= this.width){
				if (streaming === true){
					
					// this.previousX2 = this.currentX2;
					// this.currentX2 = Math.ceil(this.context.currentTime * this.width/this.sampleLength);
					this.currentWidth = this.currentX2 - this.previousX2;

				
					this.ctx.translate(-this.currentWidth*this.scrollDirection, 0);
					this.ctx.drawImage(this.tempCanvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
					this.ctx.setTransform(1, 0, 0, 1, 0, 0);
				} else {
					// Translate the canvas.
					this.ctx.translate(-this.xWidth*this.scrollDirection, 0);
					// Draw the copied image.
					this.ctx.drawImage(this.tempCanvas, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
					// Reset the transformation matrix.
					this.ctx.setTransform(1, 0, 0, 1, 0, 0);
					
				}
			}
		}
	};

	this.rerenderData = function(){
		this.renderAxesLabels();

		for (var j = 0 ; j < this.dataTimes.length ; j++){
			this.currentX = Math.ceil(this.dataTimes[j] * this.width/this.sampleLength);
			if (j == 0){
				this.previousX = 0;
			} else {
				this.previousX = Math.ceil(this.dataTimes[j-1] * this.width/this.sampleLength);
			}
			this.xWidth = this.currentX - this.previousX;
			this.renderColumn(this.currentX-this.xWidth, this.xWidth, this.data[j]);

		}
	};

	this.renderAxesLabels = function() {
		this.yAxis.width = this.width + this.padding.left + this.padding.right;
		this.yAxis.height = this.height + this.padding.bottom + this.padding.top;
		var ctx = this.yAxis.getContext('2d');
		var startFreq = 0;

		var step = (this.maxFreq - startFreq) / (this.frequencyTicks-1);
		var yLabelOffset = 5;
		// Render the vertical frequency axis.
		for (var i = 0; i < this.frequencyTicks; i++) {
			var freq = startFreq + (step * i);
			// Get the y coordinate from the current label.
			var index = this.freqToIndex(freq);
			if (this.log == false){
				var y = this.padding.top + this.height - this.height*(freq/this.maxFreq);
			} else {
				if (freq == 0){
					var y = this.padding.top + this.height;
				} else {
					var y = this.padding.top + this.height - this.height*(Math.log(freq)/Math.log(this.maxFreq));
				}
			}
			var x = 60;
			var label = this.formatFreq(freq);

			ctx.font = this.font;
			ctx.fillStyle = this.labelColor;

			
			if (this.log == false && this.alternateLabels == true && i % 2 == 1) {

			} else {
				if (this.log == true && i > 2 && i < this.frequencyTicks -1){
					
				} else {
					ctx.textAlign = 'right';
					ctx.fillText(label, x, y + yLabelOffset);
				}
			}

			if (this.gridLines == true){
				ctx.fillRect(this.padding.left, y, this.width, 1); 
			}
			
		}

		if (this.gridLines == false) {
			ctx.beginPath();
			ctx.moveTo(this.padding.left,this.padding.top);
			ctx.lineTo(this.padding.left + this.width,this.padding.top);
			ctx.lineTo(this.padding.left + this.width,this.padding.top+this.height);
			ctx.lineTo(this.padding.left,this.padding.top+this.height);
			ctx.lineTo(this.padding.left,this.padding.top);
			ctx.strokeStyle = this.labelColor;
			ctx.stroke(); 
		}

		ctx.textAlign = 'center';

		for (var i = 0; i <= Math.ceil(this.sampleLength); i++) {
			var label = i + " s";
			var x = this.padding.left + i*this.width/Math.ceil(this.sampleLength)
			ctx.fillText(label, x, this.height + 40);
			if (this.gridLines == true){
				ctx.fillRect(x, this.padding.top, 1, this.height); 
			}
		}

	};

	this.formatFreq = function(freq) {
	    return (freq/1000).toFixed(1) + " kHz";
	};

	this.freqToIndex = function(frequency) {
		return Math.round(frequency/this.nyquist * this.getFFTBinCount());
	};

	this.getFFTBinCount = function() {
		return this.fftsize / 2;
	};

	this.interpolateColor = function(x, colorArray){
		var binCount = colorArray.length-1;
		var binSize = 1.0/(binCount);
		var binIndex = Math.floor(x / binSize); //this tells us the index of the bin that x lies inside
		var fractionIntoBin = (x - (binSize * binIndex))/binSize; //this tells us how far into
		var colorStart = colorArray[binIndex];
		var colorStop = colorArray[binIndex+1];
		var xColor = {};
		if (x >= 1){
			xColor.r = colorArray[binCount][0];
			xColor.g = colorArray[binCount][1];
			xColor.b = colorArray[binCount][2];
		} else {
			xColor.r = colorStart[0] + fractionIntoBin *(colorStop[0] - colorStart[0])
			xColor.g = colorStart[1] + fractionIntoBin *(colorStop[1] - colorStart[1])
			xColor.b = colorStart[2] + fractionIntoBin *(colorStop[2] - colorStart[2])
		}
		return xColor;
	};

	this.rgbObjectToString = function(rgbObject){
		return "rgb(" + parseInt(rgbObject.r) +", "+parseInt(rgbObject.g) +"," + parseInt(rgbObject.b)+")";
	};

	this.hexToRgb = function(hex) {
		var red   = parseInt(hex.substring(1, 3),16);
		var green = parseInt(hex.substring(3, 5),16);
		var blue  = parseInt(hex.substring(5, 7),16);
		return [red, green, blue];
	};

	this.getFullColor = function(value) {
	    var color = this.interpolateColor(this.brightness*value/255, this.colorArray);
	    return this.rgbObjectToString(color);

	};

	this.init();

};