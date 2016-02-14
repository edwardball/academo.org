(function(){

	var demo = new Demo({
		ui: {

		},

		startFreq: 261.626,
		ratio: 1.037155044, //12th:1.059463094, 19th: 1.037155044
		// ratio: 1.059463094, //12th:1.059463094, 19th: 1.037155044
		keysDown: {},
		keyMap:{
			192:0,
			65:1,
			90:2,
			83:3,
			88:4,
			67:5,
			70:6,
			86:7,
			71:8,
			66:9,
			72:10,
			78:11,
			77:12,
			75:13,
			188:14,
			76:15,
			190:16,
			191:17,
			222:18,
			16:19

		},
		keyMap:{ //19 tet
			// 81:0,
			// 65:1,
			// 87:2,
			// 90:3,
			// 83:4,
			// 69:5,
			// 88:6,
			// 68:7,
			// 67:8,
			// 70:9,
			// 84:10,
			// 86:11,
			// 71:12,
			// 89:13,
			// 66:14,
			// 72:15,
			// 85:16,
			// 78:17,
			// 74:18,
			// 77:19
			90:0,
			83:1,
			69:2,
			88:3,
			68:4,
			82:5,
			67:6,
			70:7,
			86:8,
			71:9,
			89:10,
			66:11,
			72:12,
			85:13,
			78:14,
			74:15,
			73:16,
			77:17,
			75:18,
			188:19

		},

		init: function(){
			$("svg").appendTo("#demo");
			_this = this;

			//The following was inspired by Stuart Memo: https://github.com/stuartmemo/qwerty-hancock

			// window.AudioContext = window.AudioContext || window.webkitAudioContext;

						if (typeof AudioContext == "undefined"){
					        $(".preamble").append("<div class='alert'>To use this demo, please upgrade your browser to the latest version of Chrome or Firefox.</div>");
						} else {
							           var context = new AudioContext();

							           masterGain = context.createGain();
							           nodes = [];

							           masterGain.gain.value = 0.1;
							           masterGain.connect(context.destination); 

							           $(document).keydown(function(e){
							           	console.log(e.which);
							           	if (e.which in _this.keysDown){

							           	} else {


								           	_this.keysDown[e.which] = true;
								           	var key = '';
								           	var key = _this.keyMap[e.which];
								           	$("rect[data-key='"+key+"']").mousedown();
							           }
							           });

							           $(document).keyup(function(e){
							           	delete _this.keysDown[e.which];
							           	var key = _this.keyMap[e.which];
							           	
							           	$("rect[data-key='"+key+"']").attr("class", "").mouseup();
							           });

							           $("rect").mousedown(function(){
							           	$(this).attr("class", "hover")
							               var oscillator = context.createOscillator();
							               oscillator.type = 'sine';
							               oscillator.frequency.value = Math.pow(_this.ratio, $(this).data("key")) * _this.startFreq;
							               oscillator.connect(masterGain);
							               oscillator.start(0);

							               nodes.push(oscillator);
							           });

							           $("rect").mouseup(function(){
							           	var new_nodes = [];
							           	$(this).attr("class", "")


							           	for (var i = 0; i < nodes.length; i++) {
							           	    if (Math.round(nodes[i].frequency.value) === Math.round(Math.pow(_this.ratio, $(this).data("key")) * _this.startFreq)) {
							           	        nodes[i].stop(0);
							           	        nodes[i].disconnect();
							           	    } else {
							           	        new_nodes.push(nodes[i]);
							           	    }
							           	}

							           	nodes = new_nodes;
							           });
						}

			           

		},

		update: function(e){

		}
	});

})();

