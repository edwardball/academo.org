var AudioContext = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);

  var audioContext = new AudioContext();

  $(window).on("mousemove click scroll", function(){
    if (audioContext.state !== 'running' ){
      audioContext.resume();
    }
  });

var ui = {
    inputType: {
        title: "Presets",
        value: "none",
        values: [
          ["Choose a preset","none"],
          ["Lissajous","lissajous"],
          ["Hypotrochoid","hypotrochoid"], 
          ["Rhodonea","rhodonea"],
          ["Heart","heart"],
          ["Unicorn","unicorn"],
          ["Spinning Ballerina","ballerina"],
          ["Jumping Dolphin","dolphin"]
          ],
    },
    // playPause: {
    //   title: "Play/Pause preset",
    //   type: "button",
    // },
    volume: {
        title: "Volume",
        value: 0.1,
        range:[0,1],
        resolution:0.01,
        input: "hidden"
    },
    freq1: {
        title: "F1",
        value: 450,
        range:[1,1000],
        resolution:0.001,
        units: "Hz"
    },
    freq2: {
        title: "F2",
        value: 600,
        range:[1,1000],
        resolution:0.001,
        units: "Hz"
    },
    a: {
        title: "R",
        value: 6,
        range:[1,10],
        resolution:1,
    },
    b: {
        title: "r",
        value: 1,
        range:[1,10],
        resolution:1,
    },
    d: {
        title: "d",
        value: 7,
        range:[1,10],
        resolution:1,
    },
    k_numerator: {
        title: "k numerator",
        value: 5,
        range:[1,10],
        resolution:1,
    },
    k_denominator: {
        title: "k denominator",
        value: 6,
        range:[1,10],
        resolution:1,
    },
    gain: {
        title: "Oscilloscope gain",
        value: 5,
        range:[0,10],
        resolution:0.01,
        input: "hidden"
    },
    // invert: {
    //     title: "Invert",
    //     value: false,
    // },
    
    
    // dc_offset: {
    //     title: "Vertical Offset",
    //     value: 0,
    //     range:[-300,300],
    //     resolution:0.1,
    //     input: "hidden"
    // },
    
};


if (typeof getQueryVariable("embedded") != "undefined"){
  $("body").addClass("embedded");
  $("#ui-container").prepend("<h2 class='embed-title'><a href='https://academo.org/demos/virtual-oscilloscope/' target='_blank'>Academo.org</a></h2>")
}

if (typeof getQueryVariable("fullscreen") != "undefined"){
  $("body").addClass("embedded fullscreen");
  $("#ui-container").prepend("<h2 class='embed-title'><a href='https://academo.org/demos/virtual-oscilloscope/' target='_blank'>Academo.org</a></h2>")
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  } 
}





scaleFactor = 1;

var osc1 = audioContext.createOscillator();
var osc2 = audioContext.createOscillator();
function startLissajous(){
  disconnectOscs();

  delay = audioContext.createDelay();
  delayOsc2 = audioContext.createDelay();
  delayOsc4 = audioContext.createDelay();
  delayChannel2 = audioContext.createDelay();
  // delay3 = audioContext.createDelay();
  gain.gain.value = ui.volume.value;
  gain.connect(audioContext.destination);
  
  osc1 = audioContext.createOscillator();
  osc2 = audioContext.createOscillator();

  osc1.start(0);
  osc2.start(0);

  osc1.frequency.value = ui.freq1.value;

  osc2.frequency.value = ui.freq2.value;


  osc1.connect(merger, 0, 0);
  osc2.connect(delay);

  delay.connect(merger, 0, 1);
}


demo = document.getElementById('demo');
c = document.createElement("canvas"); // for gridlines
c2 = document.createElement("canvas"); // for animated line
var w = window;
screenHeight = w.innerHeight;
screenWidth = w.innerWidth;
// c.width = document.body.clientWidth;
c.width = demo.clientWidth;
c.height = document.body.clientHeight;
c.height = c.width * 0.67;
// c2.width = document.body.clientWidth;
c2.width = demo.clientWidth;
c2.height = document.body.clientHeight;
c2.height = c.height;
$("#demo").height(c.height + 20);
c.style.backgroundColor = "#5db1a2";
demo.appendChild(c);
demo.appendChild(c2);

midPoint = {x: c.width/2, y: c.height/2};

ctx = c.getContext("2d");
ctx2 = c2.getContext("2d");

function createGrid(ctx){
    ctx.beginPath();
    ctx.moveTo(0, midPoint.y);
    ctx.lineTo(c.width, midPoint.y);
    ctx.moveTo(midPoint.x, 0);
    ctx.lineTo(midPoint.x, c.height);
    ctx.strokeStyle = "#196156";
    ctx.lineWidth = '2';
    ctx.globalCompositeOperation = 'source-over';
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    gridLineX = midPoint.x - 100;
    ctx.lineWidth = '2';
    while (gridLineX >= 0){
      ctx.moveTo(gridLineX, 0);
      ctx.lineTo(gridLineX, c.height);
      gridLineX -= 100;
  }
  gridLineX = midPoint.x + 100;
  while (gridLineX <= c.width){
      ctx.moveTo(gridLineX, 0);
      ctx.lineTo(gridLineX, c.height);
      gridLineX += 100;
  }
  gridLineY = midPoint.y - 100;
  while (gridLineY >= 0){
      ctx.moveTo(0, gridLineY);
      ctx.lineTo(c.width, gridLineY);

      gridLineY -= 100;
  }
  gridLineY = midPoint.y + 100;
  while (gridLineY <= c.height){
      ctx.moveTo(0, gridLineY);
      ctx.lineTo(c.width, gridLineY);
      gridLineY += 100;
  }
  dashesX = midPoint.x - 20;
  while (dashesX >= 0){
      ctx.moveTo(dashesX, midPoint.y-5);
      ctx.lineTo(dashesX, midPoint.y+5);
      dashesX -= 20;
  }
  while (dashesX <= c.width){
      ctx.moveTo(dashesX, midPoint.y-5);
      ctx.lineTo(dashesX, midPoint.y+5);
      dashesX += 20;
  }
  dashesY = midPoint.y - 20;
  while (dashesY >= 0){
      ctx.moveTo(midPoint.x-5, dashesY);
      ctx.lineTo(midPoint.x+5, dashesY);
      dashesY -= 20;
  }
  dashesY = midPoint.y + 20;
  while (dashesY <= c.height){
      ctx.moveTo(midPoint.x-5, dashesY);
      ctx.lineTo(midPoint.x+5, dashesY);
      dashesY += 20;
  }

  ctx.stroke();

}

createGrid(ctx);

var isRunning = false;

var current_k_numerator = ui.k_numerator.value;
var current_k_denominator = ui.k_denominator.value;
var current_a = ui.a.value;
var current_b = ui.b.value;
var current_d = ui.d.value;

function update(el){

  if (el == 'inputType'){
    startLissajous();
  }

  if (el == 'inputType' && ui.inputType.value == "none"){
    disconnectOscs();
  }

  if (el == 'inputType' && ui.inputType.value == 1){
    streaming = true;
      animate();
      animateId = window.requestAnimationFrame(animate);

  } else if (el == "a" || el == "b" || el == "d"){
    if (ui.a.value != current_a || ui.b.value != current_b || ui.d.value != current_d){
      // updateHypotrochoid();
      startHypotrochoid();
      current_a = ui.a.value;
  current_b = ui.b.value;
    current_d = ui.d.value;
    }
  } else if (el == "k_numerator" || el == "k_denominator"){
    if (ui.k_numerator.value != current_k_numerator || ui.k_denominator.value != current_k_denominator){
      roseOsc1.stop();
  roseOsc1Mod.stop();
  roseOsc2.stop();
  roseOsc2Mod.stop();
      // bufferSource.stop();
      // startRose();
      startRoseCurveOscs();
      current_k_numerator = ui.k_numerator.value;
      current_k_denominator = ui.k_denominator.value;
    }
  } else if (el == "inputType" && ui.inputType.value == "hypotrochoid") {
    startHypotrochoid();
  } else if (el == "inputType" && ui.inputType.value == "lissajous") {
    startLissajous();
  } else if (el == "inputType" && ui.inputType.value == "rhodonea") {
    startRoseCurveOscs();
  } else if (el == "inputType" && ui.inputType.value == "heart") {
    disconnectOscs();
    startHeart();
  } else if (el == "inputType" && ui.inputType.value == "unicorn") {
    disconnectOscs();
    startUnicorn();
  } else if (el == "inputType" && ui.inputType.value == "ballerina") {
    disconnectOscs();
    startBallerina();
  } else if (el == "inputType" && ui.inputType.value == "dolphin") {
    disconnectOscs();
    startDolphin();
  } else {
    gain.gain.value = ui.volume.value;
    osc1.frequency.value = ui.freq1.value;
    osc2.frequency.value = ui.freq2.value;
    drawData();
  }

  updateUI();


}

function updateUI(){
  if (ui.inputType.value != "lissajous"){
    $("#freq1-interface, #freq2-interface").css("display", "none");
  } else {
    $("#freq1-interface, #freq2-interface").css("display", "block");
  }

  if (ui.inputType.value != "rhodonea"){
    $("#k_numerator-interface, #k_denominator-interface").css("display", "none");
  } else {
    $("#k_numerator-interface, #k_denominator-interface").css("display", "block");
  }

  if (ui.inputType.value != "hypotrochoid"){
    $("#a-interface, #b-interface, #d-interface").css("display", "none");
  } else {
    $("#a-interface, #b-interface, #d-interface").css("display", "block");
  }

  if (ui.inputType.value == "none"){
    $("#volume-interface, #freq1-interface, #freq2-interface,#a-interface, #b-interface, #d-interface").css("display", "none");
  }
  
}



  // var gainNode = audioContext.createGain() || audioContext.createGainNode();
  var gainNode = audioContext.createGain();
  var analyser = audioContext.createAnalyser();

  //confusing, gain on oscilloscope, different for gain affecting input
  // gainNode.gain.value = ui.gain.value;

  gainNode.gain.value = 3;


  analyser.smoothingTimeConstant = .9;
  // analyser.fftSize = 512;
  // analyser.fftSize = 1024;
  // analyser.fftSize = 4096;
  try {
    analyser.fftSize = 4096;
  } catch(e) {
    analyser.fftSize = 2048;
  }
  gainNode.connect(analyser);
  // frequencyBinCount is readonly and set to fftSize/2;
  var timeDomain = new Uint8Array(analyser.frequencyBinCount);
  var streaming = false;
  var sampleRate = audioContext.sampleRate;
  var numSamples = analyser.frequencyBinCount;


var gain,delay, delay2;
gain = audioContext.createGain();


var newOsc1 = audioContext.createOscillator();
var newOsc2 = audioContext.createOscillator();
var newOsc3 = audioContext.createOscillator();
var newOsc4 = audioContext.createOscillator();
var fundamentalFreq = 400;
var masterGain = audioContext.createGain();

var newGain1 = audioContext.createGain();
var newGain2 = audioContext.createGain();
var newGain3 = audioContext.createGain();
var newGain4 = audioContext.createGain();

var newDelay3 = audioContext.createDelay(100);
var newDelay4 = audioContext.createDelay(100);

var merger = audioContext.createChannelMerger(2);
var analyser = new StereoAnalyserNode(audioContext);

merger.connect(gain);
merger.connect(analyser);

gain.connect(audioContext.destination);
    // analyser.fftSize = 1024;

    var timeDomainL = new Float32Array(analyser.fftSize);
    var timeDomainR = new Float32Array(analyser.fftSize);


function calculateDelay(freq){
  var value = 0.25 * (1 / freq);
  while (value < 0){
    value += Math.abs((1/freq));
  }
  
  return value;

}

function updateHypotrochoid(){
    a = ui.a.value
    // b = 5/8//ui.b.value
    b = ui.b.value
    d = ui.d.value

    k = a - b // k is like (R - r)
    m = (a - b) / b // m is like (R - r)/r

    newOsc1.frequency.value = fundamentalFreq;
    newOsc2.frequency.value = fundamentalFreq * m;
    newOsc3.frequency.value = fundamentalFreq;
    newOsc4.frequency.value = fundamentalFreq * m;

    

    

    newGain1.gain.value = k;
    newGain2.gain.value = d;
    newGain3.gain.value = k;
    newGain4.gain.value = -d;

    newDelay3.delayTime.value = calculateDelay(newOsc3.frequency.value);
    newDelay4.delayTime.value = calculateDelay(newOsc4.frequency.value);
}

var bufferSource = audioContext.createBufferSource();


function startBallerina(){
  bufferSource = audioContext.createBufferSource();
  
  var bufferData = [];
var channels = 2;
var sampleRate = audioContext.sampleRate;
var sampleCount = parseInt(3.14159 * 2 / 0.001) * parseInt(3.14159 * 2 / 0.02);
var arrayBuffer = audioContext.createBuffer(channels, sampleCount, sampleRate);
var bufferDataL = arrayBuffer.getChannelData(0);
var bufferDataR = arrayBuffer.getChannelData(1);

var scaleFactor = 0.03;

var index = 0;

a = 10;

for (j = 0 ; j < 3.14159 * 2 ; j+=0.02){
for (var i = 0 ; i < 3.14159 * 2 ; i+=0.001){
  
  
  // Ballerina
  var t = i;
  var x = (-1/10) * Math.sin(22/23 - 95*t) - (1/21) * Math.sin(3/13 - 93 **t) - 1/25 * Math.sin(10/7 - 91*t) - 1/10 * Math.sin(1/43 - 90*t) - 1/6 * Math.sin(2/11 - 85*t) - 1/5 * Math.sin(13/9 - 83*t) - 1/14 * Math.sin(7/5 - 82*t) - 1/9 * Math.sin(5/14 - 76*t) - 1/5 * Math.sin(5/9 - 74*t) - 1/8 * Math.sin(1/32 - 71*t) - 1/26 * Math.sin(1/9 - 62*t) - 1/6 * Math.sin(10/11 - 59*t) - 5/16 * Math.sin(5/8 - 56*t) - 5/12 * Math.sin(9/8 - 55*t) - 4/11 * Math.sin(9/8 - 52*t) - 3/4 * Math.sin(14/9 - 41*t) - 15/11 * Math.sin(6/5 - 39*t) - 3/5 * Math.sin(1/7 - 35*t) - 1/6 * Math.sin(4/3 - 33*t) - 19/20 * Math.sin(8/7 - 31*t) - 13/11 * Math.sin(1/7 - 30*t) - 11/10 * Math.sin(7/11 - 29*t) - 11/9 * Math.sin(1/8 - 28*t) - 34/9 * Math.sin(32/31 - 20*t) - 524/15 * Math.sin(11/9 - 4*t) + 971/7 * Math.sin(t + 48/13) + 445/11 * Math.sin(2*t + 20/19) + 28 * Math.sin(3*t + 4/9) + 149/8 * Math.sin(5*t + 29/10) + 351/8 * Math.sin(6*t + 26/9) + 97/7 * Math.sin(7*t + 10/7) + 865/54 * Math.sin(8*t + 11/7) + 51/4 * Math.sin(9*t + 19/7) + 109/9 * Math.sin(10*t + 5/6) + 22/3 * Math.sin(11*t + 6/11) + 45/17 * Math.sin(12*t + 67/17) + 53/7 * Math.sin(13*t + 3/8) + 9/2 * Math.sin(14*t + 25/6) + 20/9 * Math.sin(15*t + 11/21) + 43/11 * Math.sin(16*t + 45/46) + 5/4 * Math.sin(17*t + 153/38) + 166/55 * Math.sin(18*t + 18/7) + 4/3 * Math.sin(19*t + 1/6) + 17/8 * Math.sin(21*t + 17/6) + 9/11 * Math.sin(22*t + 43/10) + 42/11 * Math.sin(23*t + 18/5) + 13/11 * Math.sin(24*t + 19/20) + 10/9 * Math.sin(25*t + 27/11) + 10/19 * Math.sin(26*t + 101/25) + 9/4 * Math.sin(27*t + 17/6) + 16/15 * Math.sin(32*t + 14/11) + 6/5 * Math.sin(34*t + 9/11) + 7/8 * Math.sin(36*t + 196/65) + 5/16 * Math.sin(37*t + 23/6) + 1/6 * Math.sin(38*t + 25/9) + 5/6 * Math.sin(40*t + 17/5) + 2/3 * Math.sin(42*t + 15/4) + 12/13 * Math.sin(43*t + 1/18) + 7/13 * Math.sin(44*t + 20/13) + 1/7 * Math.sin(45*t + 1/21) + 3/8 * Math.sin(46*t + 11/7) + 1/3 * Math.sin(47*t + 17/10) + 1/24 * Math.sin(48*t + 30/13) + 5/11 * Math.sin(49*t + 3) + 5/14 * Math.sin(50*t + 85/19) + 5/14 * Math.sin(51*t + 115/29) + 12/23 * Math.sin(53*t + 5/8) + 1/6 * Math.sin(54*t + 71/18) + 1/6 * Math.sin(57*t + 14/5) + 1/6 * Math.sin(58*t + 25/6) + 1/17 * Math.sin(60*t + 10/3) + 1/12 * Math.sin(61*t + 13/10) + 1/5 * Math.sin(63*t + 9/7) + 3/11 * Math.sin(64*t + 104/23) + 1/28 * Math.sin(65*t + 35/8) + 1/8 * Math.sin(66*t + 31/7) + 2/9 * Math.sin(67*t + 111/55) + 1/6 * Math.sin(68*t + 45/11) + 1/6 * Math.sin(69*t + 38/9) + 1/9 * Math.sin(70*t + 4/9) + 2/7 * Math.sin(72*t + 1/8) + 1/6 * Math.sin(73*t + 13/3) + 2/9 * Math.sin(75*t + 15/7) + 1/12 * Math.sin(77*t + 7/2) + 1/11 * Math.sin(78*t + 13/8) + 1/10 * Math.sin(79*t + 13/3) + 1/5 * Math.sin(80*t + 23/22) + 3/8 * Math.sin(81*t + 30/7) + 1/5 * Math.sin(84*t + 16/9) + 1/7 * Math.sin(86*t + 57/28) + 1/15 * Math.sin(87*t + 63/25) + 1/5 * Math.sin(88*t + 25/13) + 1/36 * Math.sin(89*t + 49/13) + 1/11 * Math.sin(92*t + 45/13) + 2/11 * Math.sin(94*t + 9/4)
  var y = -1/8 * Math.sin(1/3 - 91*t) - 1/14 * Math.sin(19/14 - 87*t) - 1/5 * Math.sin(1/8 - 82*t) - 2/9 * Math.sin(6/7 - 77*t) - 3/11 * Math.sin(9/8 - 74*t) - 3/7 * Math.sin(1/5 - 69*t) - 5/11 * Math.sin(6/5 - 65*t) - 1/12 * Math.sin(4/5 - 63*t) - 1/5 * Math.sin(1/2 - 61*t) - 4/9 * Math.sin(6/7 - 60*t) - 2/5 * Math.sin(8/7 - 59*t) - 3/5 * Math.sin(1/8 - 50*t) - 1/3 * Math.sin(1/5 - 46*t) - 13/12 * Math.sin(1/8 - 42*t) - 5/8 * Math.sin(10/13 - 41*t) - 1/4 * Math.sin(10/7 - 32*t) - 9/4 * Math.sin(6/7 - 23*t) - 9/4 * Math.sin(1/4 - 22*t) - 7/5 * Math.sin(3/13 - 20*t) - 106/21 * Math.sin(3/7 - 17*t) - 119/8 * Math.sin(5/7 - 9*t) - 95/4 * Math.sin(7/9 - 5*t) - 67/11 * Math.sin(15/11 - 4*t) - 381/8 * Math.sin(3/11 - 3*t) - 1831/6 * Math.sin(3/4 - t) + 1922/17 * Math.sin(2*t + 14/11) + 481/10 * Math.sin(6*t + 12/7) + 132/7 * Math.sin(7*t + 43/22) + 191/9 * Math.sin(8*t + 16/5) + 165/13 * Math.sin(10*t + 32/7) + 11 * Math.sin(11*t + 7/8) + 19/3 * Math.sin(12*t + 6/19) + 31/5 * Math.sin(13*t + 21/8) + 2/9 * Math.sin(14*t + 12/13) + 23/9 * Math.sin(15*t + 4/3) + 79/17 * Math.sin(16*t + 39/20) + 103/34 * Math.sin(18*t + 68/15) + 4/5 * Math.sin(19*t + 24/7) + 12/7 * Math.sin(21*t + 31/10) + 25/9 * Math.sin(24*t + 9/8) + 3/2 * Math.sin(25*t + 16/11) + 67/34 * Math.sin(26*t + 17/6) + 9/10 * Math.sin(27*t + 221/55) + 9/7 * Math.sin(28*t + 57/14) + 3/8 * Math.sin(29*t + 9/11) + 3/8 * Math.sin(30*t + 2) + 19/20 * Math.sin(31*t + 39/40) + 19/14 * Math.sin(33*t + 4/11) + 1/7 * Math.sin(34*t + 33/10) + 2/7 * Math.sin(35*t + 15/4) + 7/13 * Math.sin(36*t + 28/27) + 17/13 * Math.sin(37*t + 6/11) + Math.sin(38*t + 65/14) + 9/17 * Math.sin(39*t + 33/17) + 6/7 * Math.sin(40*t + 60/13) + 2/7 * Math.sin(43*t + 14/5) + 9/17 * Math.sin(44*t + 30/11) + 7/15 * Math.sin(45*t + 32/11) + 9/11 * Math.sin(47*t + 41/9) + 2/9 * Math.sin(48*t + 51/11) + 5/11 * Math.sin(49*t + 23/8) + 1/10 * Math.sin(51*t + 6/11) + 5/14 * Math.sin(52*t + 5/13) + 4/13 * Math.sin(53*t + 47/11) + 5/16 * Math.sin(54*t + 6/5) + 6/11 * Math.sin(55*t + 1/9) + 1/6 * Math.sin(56*t + 23/14) + 5/13 * Math.sin(57*t + 257/64) + 5/12 * Math.sin(58*t + 17/6) + 2/7 * Math.sin(62*t + 121/40) + 2/9 * Math.sin(64*t + 15/13) + 3/7 * Math.sin(66*t + 7/2) + 2/7 * Math.sin(67*t + 10/9) + 1/8 * Math.sin(68*t + 34/11) + 1/4 * Math.sin(70*t + 23/7) + 3/10 * Math.sin(71*t + 18/5) + 2/13 * Math.sin(72*t + 4/5) + 3/11 * Math.sin(73*t + 4/9) + 1/7 * Math.sin(75*t + 86/29) + 2/5 * Math.sin(76*t + 37/11) + 3/8 * Math.sin(78*t + 14/3) + 1/15 * Math.sin(79*t + 37/8) + 1/12 * Math.sin(80*t + 181/45) + 3/11 * Math.sin(81*t + 10/7) + 1/11 * Math.sin(83*t + 40/9) + 2/11 * Math.sin(84*t + 37/11) + 2/11 * Math.sin(85*t + 28/9) + 1/19 * Math.sin(86*t + 26/17) + 3/11 * Math.sin(88*t + 57/14) + 1/4 * Math.sin(89*t + 37/12) + 1/11 * Math.sin(90*t + 17/4) + 1/15 * Math.sin(92*t + 5/8) + 1/15 * Math.sin(93*t + 82/27) + 1/5 * Math.sin(94*t + 9/4) + 1/20 * Math.sin(95*t + 81/23) 


  //use the below for dynamic displays
  bufferDataL[index] = x * -0.1 * scaleFactor * Math.sin(j);
  bufferDataR[index] = y * -0.1 * scaleFactor;


  index++;
  
}
}




var bufferGain = audioContext.createGain();
bufferGain.gain.value = 0.5;
bufferSource.buffer = arrayBuffer;
bufferSource.loop = true;
bufferSource.playbackRate.value = 20
bufferSource.start();
bufferSource.connect(analyser);
bufferSource.connect(bufferGain);
bufferGain.connect(gain);

}


function startDolphin(){
  bufferSource = audioContext.createBufferSource();
  
  var bufferData = [];
var channels = 2;
var sampleRate = audioContext.sampleRate;
var sampleCount = parseInt(3.14159 * 2 / 0.002) * parseInt(3.14159 * 2 / 0.01);
var arrayBuffer = audioContext.createBuffer(channels, sampleCount, sampleRate);
var bufferDataL = arrayBuffer.getChannelData(0);
var bufferDataR = arrayBuffer.getChannelData(1);

var scaleFactor = 0.015;

var index = 0;

a = 10;

for (j = 0 ; j < 3.14159 * 2 ; j+=0.01){
for (var i = 0 ; i < 3.14159 * 2 ; i+=0.002){
  
  
  // Dolphin
  var t = i;
  var x = 4/23 * Math.sin(62/33 - 58 * t) + 8/11 * Math.sin(10/9 - 56 * t) + 17/24 * Math.sin(38/35 - 55 * t) + 30/89 * Math.sin(81/23 - 54 * t) + 3/17 * Math.sin(53/18 - 53 * t) + 21/38 * Math.sin(29/19 - 52 * t) + 11/35 * Math.sin(103/40 - 51 * t) + 7/16 * Math.sin(79/18 - 50 * t) + 4/15 * Math.sin(270/77 - 49 * t) + 19/35 * Math.sin(59/27 - 48 * t) + 37/43 * Math.sin(71/17 - 47 * t) + Math.sin(18/43 - 45 * t) + 21/26 * Math.sin(37/26 - 44 * t) + 27/19 * Math.sin(111/32 - 42 * t) + 8/39 * Math.sin(13/25 - 41 * t) + 23/30 * Math.sin(27/8 - 40 * t) + 23/21 * Math.sin(32/35 - 37 * t) + 18/37 * Math.sin(91/31 - 36 * t) + 45/22 * Math.sin(29/37 - 35 * t) + 56/45 * Math.sin(11/8 - 33 * t) + 4/7 * Math.sin(32/19 - 32 * t) + 54/23 * Math.sin(74/29 - 31 * t) + 28/19 * Math.sin(125/33 - 30 * t) + 19/9 * Math.sin(73/27 - 29 * t) + 16/17 * Math.sin(737/736 - 28 * t) + 52/33 * Math.sin(130/29 - 27 * t) + 41/23 * Math.sin(43/30 - 25 * t) + 29/20 * Math.sin(67/26 - 24 * t) + 64/25 * Math.sin(136/29 - 23 * t) + 162/37 * Math.sin(59/34 - 21 * t) + 871/435 * Math.sin(199/51 - 20 * t) + 61/42 * Math.sin(58/17 - 19 * t) + 159/25 * Math.sin(77/31 - 17 * t) + 241/15 * Math.sin(94/31 - 13 * t) + 259/18 * Math.sin(114/91 - 12 * t) + 356/57 * Math.sin(23/25 - 11 * t) + 2283/137 * Math.sin(23/25 - 10 * t) + 1267/45 * Math.sin(139/42 - 9 * t) + 613/26 * Math.sin(41/23 - 8 * t) + 189/16 * Math.sin(122/47 - 6 * t) + 385/6 * Math.sin(151/41 - 5 * t) + 2551/38 * Math.sin(106/35 - 4 * t) + 1997/18 * Math.sin(6/5 - 2 * t) + 43357/47 * Math.sin(81/26 - t) - 4699/35 * Math.sin(3 * t + 25/31) - 1029/34 * Math.sin(7 * t + 20/21) - 250/17 * Math.sin(14 * t + 7/40) - 140/17 * Math.sin(15 * t + 14/25) - 194/29 * Math.sin(16 * t + 29/44) - 277/52 * Math.sin(18 * t + 37/53) - 94/41 * Math.sin(22 * t + 33/31) - 57/28 * Math.sin(26 * t + 44/45) - 128/61 * Math.sin(34 * t + 11/14) - 111/95 * Math.sin(38 * t + 55/37) - 85/71 * Math.sin(39 * t + 4/45) - 25/29 * Math.sin(43 * t + 129/103) - 7/37 * Math.sin(46 * t + 9/20) - 17/32 * Math.sin(57 * t + 11/28) - 5/16 * Math.sin(59 * t + 32/39)
  var y = 5/11 * Math.sin(163/37 - 59 * t) + 7/22 * Math.sin(19/41 - 58 * t) + 30/41 * Math.sin(1 - 57 * t) + 37/29 * Math.sin(137/57 - 56 * t) + 5/7 * Math.sin(17/6 - 55 * t) + 11/39 * Math.sin(46/45 - 52 * t) + 25/28 * Math.sin(116/83 - 51 * t) + 25/34 * Math.sin(11/20 - 47 * t) + 8/27 * Math.sin(81/41 - 46 * t) + 44/39 * Math.sin(78/37 - 45 * t) + 11/25 * Math.sin(107/37 - 44 * t) + 7/20 * Math.sin(7/16 - 41 * t) + 30/31 * Math.sin(19/5 - 40 * t) + 37/27 * Math.sin(148/59 - 39 * t) + 44/39 * Math.sin(17/27 - 38 * t) + 13/11 * Math.sin(7/11 - 37 * t) + 28/33 * Math.sin(119/39 - 36 * t) + 27/13 * Math.sin(244/81 - 35 * t) + 13/23 * Math.sin(113/27 - 34 * t) + 47/38 * Math.sin(127/32 - 33 * t) + 155/59 * Math.sin(173/45 - 29 * t) + 105/37 * Math.sin(22/43 - 27 * t) + 106/27 * Math.sin(23/37 - 26 * t) + 97/41 * Math.sin(53/29 - 25 * t) + 83/45 * Math.sin(109/31 - 24 * t) + 81/31 * Math.sin(96/29 - 23 * t) + 56/37 * Math.sin(29/10 - 22 * t) + 44/13 * Math.sin(29/19 - 19 * t) + 18/5 * Math.sin(34/31 - 18 * t) + 163/51 * Math.sin(75/17 - 17 * t) + 152/31 * Math.sin(61/18 - 16 * t) + 146/19 * Math.sin(47/20 - 15 * t) + 353/35 * Math.sin(55/48 - 14 * t) + 355/28 * Math.sin(102/25 - 12 * t) + 1259/63 * Math.sin(71/18 - 11 * t) + 17/35 * Math.sin(125/52 - 10 * t) + 786/23 * Math.sin(23/26 - 6 * t) + 2470/41 * Math.sin(77/30 - 5 * t) + 2329/47 * Math.sin(47/21 - 4 * t) + 2527/33 * Math.sin(23/14 - 3 * t) + 9931/33 * Math.sin(51/35 - 2 * t) - 11506/19 * Math.sin(t + 56/67) - 2081/42 * Math.sin(7 * t + 9/28) - 537/14 * Math.sin(8 * t + 3/25) - 278/29 * Math.sin(9 * t + 23/33) - 107/15 * Math.sin(13 * t + 35/26) - 56/19 * Math.sin(20 * t + 5/9) - 5/9 * Math.sin(21 * t + 1/34) - 17/24 * Math.sin(28 * t + 36/23) - 21/11 * Math.sin(30 * t + 27/37) - 138/83 * Math.sin(31 * t + 1/7) - 10/17 * Math.sin(32 * t + 29/48) - 31/63 * Math.sin(42 * t + 27/28) - 4/27 * Math.sin(43 * t + 29/43) - 13/24 * Math.sin(48 * t + 5/21) - 4/7 * Math.sin(49 * t + 29/23) - 26/77 * Math.sin(50 * t + 29/27) - 19/14 * Math.sin(53 * t + 61/48) + 34/25 * Math.sin(54 * t + 37/26)


  bufferDataL[index] = (((x + 800 * 1.5) * Math.cos(j) - (y+800 * 1.5) * Math.sin(j)) - 800) * -0.1 * scaleFactor;
  bufferDataR[index] = (((y + 800 * 1.5) * Math.cos(j) + (x+800*1.5) * Math.sin(j)) - 800) * -0.1 * scaleFactor;


  index++;
  
}
}




var bufferGain = audioContext.createGain();
bufferGain.gain.value = 0.25;
bufferSource.buffer = arrayBuffer;
bufferSource.loop = true;
bufferSource.playbackRate.value = 20
bufferSource.start();
bufferSource.connect(analyser);
bufferSource.connect(bufferGain);
bufferGain.connect(gain);

}





function startUnicorn(){
bufferSource = audioContext.createBufferSource();
  
  var bufferData = [];
var channels = 2;
var sampleRate = audioContext.sampleRate;
// var sampleCount = parseInt(3.14159 * 2 / 0.001) * parseInt(3.14159 * 2 / 0.01);
var sampleCount = parseInt(3.14159 * 2 / 0.001) ;
var arrayBuffer = audioContext.createBuffer(channels, sampleCount, sampleRate);
var bufferDataL = arrayBuffer.getChannelData(0);
var bufferDataR = arrayBuffer.getChannelData(1);

var scaleFactor = 0.05;

var index = 0;

a = 10;
for (var i = 0 ; i < 3.14159 * 2 ; i+=0.001){
  
  t = i;
  // Unicorn
  var x = -12/25 * Math.sin(1/10 - 48 * t) - 72/13 * Math.sin(11/7 - 42 * t) - 8/3 * Math.sin(13/9 - 40 * t) - 13/12 * Math.sin(7/13 - 37 * t) - 73/18 * Math.sin(3/5 - 32 * t) - 68/9 * Math.sin(7/10 - 28 * t) - 19/4 * Math.sin(2/5 - 26 * t) - 96/5 * Math.sin(3/10 - 18 * t) - 4 * Math.sin(4/3 - 17 * t) - 171/7 * Math.sin(7/9 - 10 * t) - 243/5 * Math.sin(23/24 - 9 * t) - 54/5 * Math.sin(5/14 - 6 * t) - 478/7 * Math.sin(11/8 - 2 * t) + 5944/13 * Math.sin(t + 27/8) + 824/9 * Math.sin(3 * t + 12/11) + 1312/9 * Math.sin(4 * t + 47/12) + 1448/15 * Math.sin(5 * t + 9/5) + 667/16 * Math.sin(7 * t + 24/13) + 297/8 * Math.sin(8 * t + 27/7) + 419/21 * Math.sin(11 * t + 22/13) + 105/8 * Math.sin(12 * t + 31/9) + 117/7 * Math.sin(13 * t + 17/7) + 86/3 * Math.sin(14 * t + 29/7) + 18 * Math.sin(15 * t + 32/11) + 185/12 * Math.sin(16 * t + 17/8) + 124/13 * Math.sin(19 * t + 4) + 83/8 * Math.sin(20 * t + 3/7) + 37/3 * Math.sin(21 * t + 3/11) + 73/6 * Math.sin(22 * t + 27/10) + 148/11 * Math.sin(23 * t + 4/3) + 45/7 * Math.sin(24 * t + 25/11) + 12 * Math.sin(25 * t + 5/4) + 49/12 * Math.sin(27 * t + 11/7) + 79/9 * Math.sin(29 * t + 2) + 43/10 * Math.sin(30 * t + 3/2) + 26/7 * Math.sin(31 * t + 3/5) + 15/4 * Math.sin(33 * t + 1/16) + 46/13 * Math.sin(34 * t + 9/17) + 35/12 * Math.sin(35 * t + 39/11) + 57/10 * Math.sin(36 * t + 46/11) + 31/12 * Math.sin(38 * t + 31/9) + 71/13 * Math.sin(39 * t + 1/13) + 23/13 * Math.sin(41 * t + 16/7) + 62/25 * Math.sin(43 * t + 13/7) + 8/11 * Math.sin(44 * t + 19/14) + 30/11 * Math.sin(45 * t + 17/10) + 35/11 * Math.sin(46 * t + 9/10) + 7/4 * Math.sin(47 * t + 21/11) + 1/2 * Math.sin(49 * t + 11/4) + 14/13 * Math.sin(50 * t + 51/19) + 35/36 * Math.sin(51 * t + 29/10) + 21/10 * Math.sin(52 * t + 19/12) + 11/8 * Math.sin(53 * t + 17/5) + 15/7 * Math.sin(54 * t + 47/11) + 10/9 * Math.sin(55 * t + 3/8) + 11/5 * Math.sin(56 * t + 27/11) + 10/7 * Math.sin(57 * t + 40/13) + 13/19 * Math.sin(58 * t + 24/23) + 32/9 * Math.sin(59 * t + 21/13) + 9/5 * Math.sin(60 * t + 33/7) + 2303/18
  var y = -6/11 * Math.sin(7/5 - 55 * t) - 4/13 * Math.sin(5/4 - 52 * t) - 12/7 * Math.sin(5/9 - 49 * t) - 4/7 * Math.sin(7/12 - 47 * t) - 4 * Math.sin(3/8 - 42 * t) - 33/7 * Math.sin(1/2 - 32 * t) - 23/6 * Math.sin(5/4 - 22 * t) - 16/7 * Math.sin(4/7 - 21 * t) - 113/12 * Math.sin(6/5 - 20 * t) - 111/8 * Math.sin(5/9 - 19 * t) - 46/9 * Math.sin(4/5 - 17 * t) - 159/5 * Math.sin(13/9 - 5 * t) - 1768/7 * Math.sin(6/7 - t) + 1841/23 * Math.sin(2 * t + 49/13) + 398/11 * Math.sin(3 * t + 17/7) + 163/4 * Math.sin(4 * t + 29/15) + 485/11 * Math.sin(6 * t + 42/43) + 205/9 * Math.sin(7 * t + 17/6) + 873/19 * Math.sin(8 * t + 3/5) + 615/14 * Math.sin(9 * t + 20/11) + 397/7 * Math.sin(10 * t + 18/7) + 104/7 * Math.sin(11 * t + 32/9) + 53/6 * Math.sin(12 * t + 51/11) + 139/8 * Math.sin(13 * t + 23/5) + 262/9 * Math.sin(14 * t + 15/7) + 149/13 * Math.sin(15 * t + 11/3) + 55/8 * Math.sin(16 * t + 1/2) + 129/8 * Math.sin(18 * t + 4/5) + 140/13 * Math.sin(23 * t + 30/7) + 60/11 * Math.sin(24 * t + 14/5) + 15/4 * Math.sin(25 * t + 6/5) + 19/13 * Math.sin(26 * t + 17/4) + 34/11 * Math.sin(27 * t + 5/2) + 244/27 * Math.sin(28 * t + 44/13) + 91/9 * Math.sin(29 * t + 24/11) + 22/13 * Math.sin(30 * t + 29/8) + 79/13 * Math.sin(31 * t + 1/8) + 16/5 * Math.sin(33 * t + 57/13) + 7/6 * Math.sin(34 * t + 22/5) + 7/2 * Math.sin(35 * t + 17/8) + 17/10 * Math.sin(36 * t + 3/13) + 15/16 * Math.sin(37 * t + 15/4) + 79/17 * Math.sin(38 * t + 35/11) + 16/9 * Math.sin(39 * t + 1/18) + 23/12 * Math.sin(40 * t + 13/10) + 21/8 * Math.sin(41 * t + 9/5) + 33/10 * Math.sin(43 * t + 52/21) + 12/7 * Math.sin(44 * t + 17/8) + 56/19 * Math.sin(45 * t + 4) + 57/10 * Math.sin(46 * t + 17/7) + 29/8 * Math.sin(48 * t + 58/13) + 19/11 * Math.sin(50 * t + 40/11) + 23/11 * Math.sin(51 * t + 9/4) + 10/9 * Math.sin(53 * t + 17/8) + 13/10 * Math.sin(54 * t + 13/8) + 122/41 * Math.sin(56 * t + 116/39) + 16/9 * Math.sin(57 * t + 32/13) + Math.sin(58 * t + 53/12) + 13/6 * Math.sin(59 * t + 7/3) + 9/7 * Math.sin(60 * t + 2/3) - 399/8




  bufferDataL[index] = (x * -0.1 * scaleFactor) + 0.5;
  bufferDataR[index] = y * -0.1 * scaleFactor;


  index++;
  
  
}
// }




var bufferGain = audioContext.createGain();
bufferGain.gain.value = 0.1;
bufferSource.buffer = arrayBuffer;
bufferSource.loop = true;
bufferSource.playbackRate.value = 20
bufferSource.start();
bufferSource.connect(analyser);
bufferSource.connect(bufferGain);
bufferGain.connect(gain);
}

$(document).ready(function(){
  updateUI();
})

function startHeart(){
  disconnectOscs();
  bufferSource = audioContext.createBufferSource();
  
  var bufferData = [];
var channels = 2;
var sampleRate = audioContext.sampleRate;
// var sampleCount = parseInt(3.14159 * 2 / 0.001) * parseInt(3.14159 * 2 / 0.01);
var sampleCount = parseInt(3.14159 * 2 / 0.001) ;
var arrayBuffer = audioContext.createBuffer(channels, sampleCount, sampleRate);
var bufferDataL = arrayBuffer.getChannelData(0);
var bufferDataR = arrayBuffer.getChannelData(1);

var scaleFactor = 1;

var index = 0;

a = 10;

// for (j = 0 ; j < 3.14159 * 2 ; j+=0.01){
for (var i = 0 ; i < 3.14159 * 2 ; i+=0.001){
  
  // Heart
  var x = 16 * Math.pow(Math.sin(i), 3);
  var y = 13 * Math.cos(i) - 5 * Math.cos(2*i) - 2*Math.cos(3*i) - Math.cos(4*i);



  // Ballerina
  var t = i;
  // var x = (-1/10) * Math.sin(22/23 - 95*t) - (1/21) * Math.sin(3/13 - 93 **t) - 1/25 * Math.sin(10/7 - 91*t) - 1/10 * Math.sin(1/43 - 90*t) - 1/6 * Math.sin(2/11 - 85*t) - 1/5 * Math.sin(13/9 - 83*t) - 1/14 * Math.sin(7/5 - 82*t) - 1/9 * Math.sin(5/14 - 76*t) - 1/5 * Math.sin(5/9 - 74*t) - 1/8 * Math.sin(1/32 - 71*t) - 1/26 * Math.sin(1/9 - 62*t) - 1/6 * Math.sin(10/11 - 59*t) - 5/16 * Math.sin(5/8 - 56*t) - 5/12 * Math.sin(9/8 - 55*t) - 4/11 * Math.sin(9/8 - 52*t) - 3/4 * Math.sin(14/9 - 41*t) - 15/11 * Math.sin(6/5 - 39*t) - 3/5 * Math.sin(1/7 - 35*t) - 1/6 * Math.sin(4/3 - 33*t) - 19/20 * Math.sin(8/7 - 31*t) - 13/11 * Math.sin(1/7 - 30*t) - 11/10 * Math.sin(7/11 - 29*t) - 11/9 * Math.sin(1/8 - 28*t) - 34/9 * Math.sin(32/31 - 20*t) - 524/15 * Math.sin(11/9 - 4*t) + 971/7 * Math.sin(t + 48/13) + 445/11 * Math.sin(2*t + 20/19) + 28 * Math.sin(3*t + 4/9) + 149/8 * Math.sin(5*t + 29/10) + 351/8 * Math.sin(6*t + 26/9) + 97/7 * Math.sin(7*t + 10/7) + 865/54 * Math.sin(8*t + 11/7) + 51/4 * Math.sin(9*t + 19/7) + 109/9 * Math.sin(10*t + 5/6) + 22/3 * Math.sin(11*t + 6/11) + 45/17 * Math.sin(12*t + 67/17) + 53/7 * Math.sin(13*t + 3/8) + 9/2 * Math.sin(14*t + 25/6) + 20/9 * Math.sin(15*t + 11/21) + 43/11 * Math.sin(16*t + 45/46) + 5/4 * Math.sin(17*t + 153/38) + 166/55 * Math.sin(18*t + 18/7) + 4/3 * Math.sin(19*t + 1/6) + 17/8 * Math.sin(21*t + 17/6) + 9/11 * Math.sin(22*t + 43/10) + 42/11 * Math.sin(23*t + 18/5) + 13/11 * Math.sin(24*t + 19/20) + 10/9 * Math.sin(25*t + 27/11) + 10/19 * Math.sin(26*t + 101/25) + 9/4 * Math.sin(27*t + 17/6) + 16/15 * Math.sin(32*t + 14/11) + 6/5 * Math.sin(34*t + 9/11) + 7/8 * Math.sin(36*t + 196/65) + 5/16 * Math.sin(37*t + 23/6) + 1/6 * Math.sin(38*t + 25/9) + 5/6 * Math.sin(40*t + 17/5) + 2/3 * Math.sin(42*t + 15/4) + 12/13 * Math.sin(43*t + 1/18) + 7/13 * Math.sin(44*t + 20/13) + 1/7 * Math.sin(45*t + 1/21) + 3/8 * Math.sin(46*t + 11/7) + 1/3 * Math.sin(47*t + 17/10) + 1/24 * Math.sin(48*t + 30/13) + 5/11 * Math.sin(49*t + 3) + 5/14 * Math.sin(50*t + 85/19) + 5/14 * Math.sin(51*t + 115/29) + 12/23 * Math.sin(53*t + 5/8) + 1/6 * Math.sin(54*t + 71/18) + 1/6 * Math.sin(57*t + 14/5) + 1/6 * Math.sin(58*t + 25/6) + 1/17 * Math.sin(60*t + 10/3) + 1/12 * Math.sin(61*t + 13/10) + 1/5 * Math.sin(63*t + 9/7) + 3/11 * Math.sin(64*t + 104/23) + 1/28 * Math.sin(65*t + 35/8) + 1/8 * Math.sin(66*t + 31/7) + 2/9 * Math.sin(67*t + 111/55) + 1/6 * Math.sin(68*t + 45/11) + 1/6 * Math.sin(69*t + 38/9) + 1/9 * Math.sin(70*t + 4/9) + 2/7 * Math.sin(72*t + 1/8) + 1/6 * Math.sin(73*t + 13/3) + 2/9 * Math.sin(75*t + 15/7) + 1/12 * Math.sin(77*t + 7/2) + 1/11 * Math.sin(78*t + 13/8) + 1/10 * Math.sin(79*t + 13/3) + 1/5 * Math.sin(80*t + 23/22) + 3/8 * Math.sin(81*t + 30/7) + 1/5 * Math.sin(84*t + 16/9) + 1/7 * Math.sin(86*t + 57/28) + 1/15 * Math.sin(87*t + 63/25) + 1/5 * Math.sin(88*t + 25/13) + 1/36 * Math.sin(89*t + 49/13) + 1/11 * Math.sin(92*t + 45/13) + 2/11 * Math.sin(94*t + 9/4)
  // var y = -1/8 * Math.sin(1/3 - 91*t) - 1/14 * Math.sin(19/14 - 87*t) - 1/5 * Math.sin(1/8 - 82*t) - 2/9 * Math.sin(6/7 - 77*t) - 3/11 * Math.sin(9/8 - 74*t) - 3/7 * Math.sin(1/5 - 69*t) - 5/11 * Math.sin(6/5 - 65*t) - 1/12 * Math.sin(4/5 - 63*t) - 1/5 * Math.sin(1/2 - 61*t) - 4/9 * Math.sin(6/7 - 60*t) - 2/5 * Math.sin(8/7 - 59*t) - 3/5 * Math.sin(1/8 - 50*t) - 1/3 * Math.sin(1/5 - 46*t) - 13/12 * Math.sin(1/8 - 42*t) - 5/8 * Math.sin(10/13 - 41*t) - 1/4 * Math.sin(10/7 - 32*t) - 9/4 * Math.sin(6/7 - 23*t) - 9/4 * Math.sin(1/4 - 22*t) - 7/5 * Math.sin(3/13 - 20*t) - 106/21 * Math.sin(3/7 - 17*t) - 119/8 * Math.sin(5/7 - 9*t) - 95/4 * Math.sin(7/9 - 5*t) - 67/11 * Math.sin(15/11 - 4*t) - 381/8 * Math.sin(3/11 - 3*t) - 1831/6 * Math.sin(3/4 - t) + 1922/17 * Math.sin(2*t + 14/11) + 481/10 * Math.sin(6*t + 12/7) + 132/7 * Math.sin(7*t + 43/22) + 191/9 * Math.sin(8*t + 16/5) + 165/13 * Math.sin(10*t + 32/7) + 11 * Math.sin(11*t + 7/8) + 19/3 * Math.sin(12*t + 6/19) + 31/5 * Math.sin(13*t + 21/8) + 2/9 * Math.sin(14*t + 12/13) + 23/9 * Math.sin(15*t + 4/3) + 79/17 * Math.sin(16*t + 39/20) + 103/34 * Math.sin(18*t + 68/15) + 4/5 * Math.sin(19*t + 24/7) + 12/7 * Math.sin(21*t + 31/10) + 25/9 * Math.sin(24*t + 9/8) + 3/2 * Math.sin(25*t + 16/11) + 67/34 * Math.sin(26*t + 17/6) + 9/10 * Math.sin(27*t + 221/55) + 9/7 * Math.sin(28*t + 57/14) + 3/8 * Math.sin(29*t + 9/11) + 3/8 * Math.sin(30*t + 2) + 19/20 * Math.sin(31*t + 39/40) + 19/14 * Math.sin(33*t + 4/11) + 1/7 * Math.sin(34*t + 33/10) + 2/7 * Math.sin(35*t + 15/4) + 7/13 * Math.sin(36*t + 28/27) + 17/13 * Math.sin(37*t + 6/11) + Math.sin(38*t + 65/14) + 9/17 * Math.sin(39*t + 33/17) + 6/7 * Math.sin(40*t + 60/13) + 2/7 * Math.sin(43*t + 14/5) + 9/17 * Math.sin(44*t + 30/11) + 7/15 * Math.sin(45*t + 32/11) + 9/11 * Math.sin(47*t + 41/9) + 2/9 * Math.sin(48*t + 51/11) + 5/11 * Math.sin(49*t + 23/8) + 1/10 * Math.sin(51*t + 6/11) + 5/14 * Math.sin(52*t + 5/13) + 4/13 * Math.sin(53*t + 47/11) + 5/16 * Math.sin(54*t + 6/5) + 6/11 * Math.sin(55*t + 1/9) + 1/6 * Math.sin(56*t + 23/14) + 5/13 * Math.sin(57*t + 257/64) + 5/12 * Math.sin(58*t + 17/6) + 2/7 * Math.sin(62*t + 121/40) + 2/9 * Math.sin(64*t + 15/13) + 3/7 * Math.sin(66*t + 7/2) + 2/7 * Math.sin(67*t + 10/9) + 1/8 * Math.sin(68*t + 34/11) + 1/4 * Math.sin(70*t + 23/7) + 3/10 * Math.sin(71*t + 18/5) + 2/13 * Math.sin(72*t + 4/5) + 3/11 * Math.sin(73*t + 4/9) + 1/7 * Math.sin(75*t + 86/29) + 2/5 * Math.sin(76*t + 37/11) + 3/8 * Math.sin(78*t + 14/3) + 1/15 * Math.sin(79*t + 37/8) + 1/12 * Math.sin(80*t + 181/45) + 3/11 * Math.sin(81*t + 10/7) + 1/11 * Math.sin(83*t + 40/9) + 2/11 * Math.sin(84*t + 37/11) + 2/11 * Math.sin(85*t + 28/9) + 1/19 * Math.sin(86*t + 26/17) + 3/11 * Math.sin(88*t + 57/14) + 1/4 * Math.sin(89*t + 37/12) + 1/11 * Math.sin(90*t + 17/4) + 1/15 * Math.sin(92*t + 5/8) + 1/15 * Math.sin(93*t + 82/27) + 1/5 * Math.sin(94*t + 9/4) + 1/20 * Math.sin(95*t + 81/23) 

  // Unicorn
  // var x = -12/25 * Math.sin(1/10 - 48 * t) - 72/13 * Math.sin(11/7 - 42 * t) - 8/3 * Math.sin(13/9 - 40 * t) - 13/12 * Math.sin(7/13 - 37 * t) - 73/18 * Math.sin(3/5 - 32 * t) - 68/9 * Math.sin(7/10 - 28 * t) - 19/4 * Math.sin(2/5 - 26 * t) - 96/5 * Math.sin(3/10 - 18 * t) - 4 * Math.sin(4/3 - 17 * t) - 171/7 * Math.sin(7/9 - 10 * t) - 243/5 * Math.sin(23/24 - 9 * t) - 54/5 * Math.sin(5/14 - 6 * t) - 478/7 * Math.sin(11/8 - 2 * t) + 5944/13 * Math.sin(t + 27/8) + 824/9 * Math.sin(3 * t + 12/11) + 1312/9 * Math.sin(4 * t + 47/12) + 1448/15 * Math.sin(5 * t + 9/5) + 667/16 * Math.sin(7 * t + 24/13) + 297/8 * Math.sin(8 * t + 27/7) + 419/21 * Math.sin(11 * t + 22/13) + 105/8 * Math.sin(12 * t + 31/9) + 117/7 * Math.sin(13 * t + 17/7) + 86/3 * Math.sin(14 * t + 29/7) + 18 * Math.sin(15 * t + 32/11) + 185/12 * Math.sin(16 * t + 17/8) + 124/13 * Math.sin(19 * t + 4) + 83/8 * Math.sin(20 * t + 3/7) + 37/3 * Math.sin(21 * t + 3/11) + 73/6 * Math.sin(22 * t + 27/10) + 148/11 * Math.sin(23 * t + 4/3) + 45/7 * Math.sin(24 * t + 25/11) + 12 * Math.sin(25 * t + 5/4) + 49/12 * Math.sin(27 * t + 11/7) + 79/9 * Math.sin(29 * t + 2) + 43/10 * Math.sin(30 * t + 3/2) + 26/7 * Math.sin(31 * t + 3/5) + 15/4 * Math.sin(33 * t + 1/16) + 46/13 * Math.sin(34 * t + 9/17) + 35/12 * Math.sin(35 * t + 39/11) + 57/10 * Math.sin(36 * t + 46/11) + 31/12 * Math.sin(38 * t + 31/9) + 71/13 * Math.sin(39 * t + 1/13) + 23/13 * Math.sin(41 * t + 16/7) + 62/25 * Math.sin(43 * t + 13/7) + 8/11 * Math.sin(44 * t + 19/14) + 30/11 * Math.sin(45 * t + 17/10) + 35/11 * Math.sin(46 * t + 9/10) + 7/4 * Math.sin(47 * t + 21/11) + 1/2 * Math.sin(49 * t + 11/4) + 14/13 * Math.sin(50 * t + 51/19) + 35/36 * Math.sin(51 * t + 29/10) + 21/10 * Math.sin(52 * t + 19/12) + 11/8 * Math.sin(53 * t + 17/5) + 15/7 * Math.sin(54 * t + 47/11) + 10/9 * Math.sin(55 * t + 3/8) + 11/5 * Math.sin(56 * t + 27/11) + 10/7 * Math.sin(57 * t + 40/13) + 13/19 * Math.sin(58 * t + 24/23) + 32/9 * Math.sin(59 * t + 21/13) + 9/5 * Math.sin(60 * t + 33/7) + 2303/18
  // var y = -6/11 * Math.sin(7/5 - 55 * t) - 4/13 * Math.sin(5/4 - 52 * t) - 12/7 * Math.sin(5/9 - 49 * t) - 4/7 * Math.sin(7/12 - 47 * t) - 4 * Math.sin(3/8 - 42 * t) - 33/7 * Math.sin(1/2 - 32 * t) - 23/6 * Math.sin(5/4 - 22 * t) - 16/7 * Math.sin(4/7 - 21 * t) - 113/12 * Math.sin(6/5 - 20 * t) - 111/8 * Math.sin(5/9 - 19 * t) - 46/9 * Math.sin(4/5 - 17 * t) - 159/5 * Math.sin(13/9 - 5 * t) - 1768/7 * Math.sin(6/7 - t) + 1841/23 * Math.sin(2 * t + 49/13) + 398/11 * Math.sin(3 * t + 17/7) + 163/4 * Math.sin(4 * t + 29/15) + 485/11 * Math.sin(6 * t + 42/43) + 205/9 * Math.sin(7 * t + 17/6) + 873/19 * Math.sin(8 * t + 3/5) + 615/14 * Math.sin(9 * t + 20/11) + 397/7 * Math.sin(10 * t + 18/7) + 104/7 * Math.sin(11 * t + 32/9) + 53/6 * Math.sin(12 * t + 51/11) + 139/8 * Math.sin(13 * t + 23/5) + 262/9 * Math.sin(14 * t + 15/7) + 149/13 * Math.sin(15 * t + 11/3) + 55/8 * Math.sin(16 * t + 1/2) + 129/8 * Math.sin(18 * t + 4/5) + 140/13 * Math.sin(23 * t + 30/7) + 60/11 * Math.sin(24 * t + 14/5) + 15/4 * Math.sin(25 * t + 6/5) + 19/13 * Math.sin(26 * t + 17/4) + 34/11 * Math.sin(27 * t + 5/2) + 244/27 * Math.sin(28 * t + 44/13) + 91/9 * Math.sin(29 * t + 24/11) + 22/13 * Math.sin(30 * t + 29/8) + 79/13 * Math.sin(31 * t + 1/8) + 16/5 * Math.sin(33 * t + 57/13) + 7/6 * Math.sin(34 * t + 22/5) + 7/2 * Math.sin(35 * t + 17/8) + 17/10 * Math.sin(36 * t + 3/13) + 15/16 * Math.sin(37 * t + 15/4) + 79/17 * Math.sin(38 * t + 35/11) + 16/9 * Math.sin(39 * t + 1/18) + 23/12 * Math.sin(40 * t + 13/10) + 21/8 * Math.sin(41 * t + 9/5) + 33/10 * Math.sin(43 * t + 52/21) + 12/7 * Math.sin(44 * t + 17/8) + 56/19 * Math.sin(45 * t + 4) + 57/10 * Math.sin(46 * t + 17/7) + 29/8 * Math.sin(48 * t + 58/13) + 19/11 * Math.sin(50 * t + 40/11) + 23/11 * Math.sin(51 * t + 9/4) + 10/9 * Math.sin(53 * t + 17/8) + 13/10 * Math.sin(54 * t + 13/8) + 122/41 * Math.sin(56 * t + 116/39) + 16/9 * Math.sin(57 * t + 32/13) + Math.sin(58 * t + 53/12) + 13/6 * Math.sin(59 * t + 7/3) + 9/7 * Math.sin(60 * t + 2/3) - 399/8

  // Dolphin
  // var x = 4/23 * Math.sin(62/33 - 58 * t) + 8/11 * Math.sin(10/9 - 56 * t) + 17/24 * Math.sin(38/35 - 55 * t) + 30/89 * Math.sin(81/23 - 54 * t) + 3/17 * Math.sin(53/18 - 53 * t) + 21/38 * Math.sin(29/19 - 52 * t) + 11/35 * Math.sin(103/40 - 51 * t) + 7/16 * Math.sin(79/18 - 50 * t) + 4/15 * Math.sin(270/77 - 49 * t) + 19/35 * Math.sin(59/27 - 48 * t) + 37/43 * Math.sin(71/17 - 47 * t) + Math.sin(18/43 - 45 * t) + 21/26 * Math.sin(37/26 - 44 * t) + 27/19 * Math.sin(111/32 - 42 * t) + 8/39 * Math.sin(13/25 - 41 * t) + 23/30 * Math.sin(27/8 - 40 * t) + 23/21 * Math.sin(32/35 - 37 * t) + 18/37 * Math.sin(91/31 - 36 * t) + 45/22 * Math.sin(29/37 - 35 * t) + 56/45 * Math.sin(11/8 - 33 * t) + 4/7 * Math.sin(32/19 - 32 * t) + 54/23 * Math.sin(74/29 - 31 * t) + 28/19 * Math.sin(125/33 - 30 * t) + 19/9 * Math.sin(73/27 - 29 * t) + 16/17 * Math.sin(737/736 - 28 * t) + 52/33 * Math.sin(130/29 - 27 * t) + 41/23 * Math.sin(43/30 - 25 * t) + 29/20 * Math.sin(67/26 - 24 * t) + 64/25 * Math.sin(136/29 - 23 * t) + 162/37 * Math.sin(59/34 - 21 * t) + 871/435 * Math.sin(199/51 - 20 * t) + 61/42 * Math.sin(58/17 - 19 * t) + 159/25 * Math.sin(77/31 - 17 * t) + 241/15 * Math.sin(94/31 - 13 * t) + 259/18 * Math.sin(114/91 - 12 * t) + 356/57 * Math.sin(23/25 - 11 * t) + 2283/137 * Math.sin(23/25 - 10 * t) + 1267/45 * Math.sin(139/42 - 9 * t) + 613/26 * Math.sin(41/23 - 8 * t) + 189/16 * Math.sin(122/47 - 6 * t) + 385/6 * Math.sin(151/41 - 5 * t) + 2551/38 * Math.sin(106/35 - 4 * t) + 1997/18 * Math.sin(6/5 - 2 * t) + 43357/47 * Math.sin(81/26 - t) - 4699/35 * Math.sin(3 * t + 25/31) - 1029/34 * Math.sin(7 * t + 20/21) - 250/17 * Math.sin(14 * t + 7/40) - 140/17 * Math.sin(15 * t + 14/25) - 194/29 * Math.sin(16 * t + 29/44) - 277/52 * Math.sin(18 * t + 37/53) - 94/41 * Math.sin(22 * t + 33/31) - 57/28 * Math.sin(26 * t + 44/45) - 128/61 * Math.sin(34 * t + 11/14) - 111/95 * Math.sin(38 * t + 55/37) - 85/71 * Math.sin(39 * t + 4/45) - 25/29 * Math.sin(43 * t + 129/103) - 7/37 * Math.sin(46 * t + 9/20) - 17/32 * Math.sin(57 * t + 11/28) - 5/16 * Math.sin(59 * t + 32/39)
  // var y = 5/11 * Math.sin(163/37 - 59 * t) + 7/22 * Math.sin(19/41 - 58 * t) + 30/41 * Math.sin(1 - 57 * t) + 37/29 * Math.sin(137/57 - 56 * t) + 5/7 * Math.sin(17/6 - 55 * t) + 11/39 * Math.sin(46/45 - 52 * t) + 25/28 * Math.sin(116/83 - 51 * t) + 25/34 * Math.sin(11/20 - 47 * t) + 8/27 * Math.sin(81/41 - 46 * t) + 44/39 * Math.sin(78/37 - 45 * t) + 11/25 * Math.sin(107/37 - 44 * t) + 7/20 * Math.sin(7/16 - 41 * t) + 30/31 * Math.sin(19/5 - 40 * t) + 37/27 * Math.sin(148/59 - 39 * t) + 44/39 * Math.sin(17/27 - 38 * t) + 13/11 * Math.sin(7/11 - 37 * t) + 28/33 * Math.sin(119/39 - 36 * t) + 27/13 * Math.sin(244/81 - 35 * t) + 13/23 * Math.sin(113/27 - 34 * t) + 47/38 * Math.sin(127/32 - 33 * t) + 155/59 * Math.sin(173/45 - 29 * t) + 105/37 * Math.sin(22/43 - 27 * t) + 106/27 * Math.sin(23/37 - 26 * t) + 97/41 * Math.sin(53/29 - 25 * t) + 83/45 * Math.sin(109/31 - 24 * t) + 81/31 * Math.sin(96/29 - 23 * t) + 56/37 * Math.sin(29/10 - 22 * t) + 44/13 * Math.sin(29/19 - 19 * t) + 18/5 * Math.sin(34/31 - 18 * t) + 163/51 * Math.sin(75/17 - 17 * t) + 152/31 * Math.sin(61/18 - 16 * t) + 146/19 * Math.sin(47/20 - 15 * t) + 353/35 * Math.sin(55/48 - 14 * t) + 355/28 * Math.sin(102/25 - 12 * t) + 1259/63 * Math.sin(71/18 - 11 * t) + 17/35 * Math.sin(125/52 - 10 * t) + 786/23 * Math.sin(23/26 - 6 * t) + 2470/41 * Math.sin(77/30 - 5 * t) + 2329/47 * Math.sin(47/21 - 4 * t) + 2527/33 * Math.sin(23/14 - 3 * t) + 9931/33 * Math.sin(51/35 - 2 * t) - 11506/19 * Math.sin(t + 56/67) - 2081/42 * Math.sin(7 * t + 9/28) - 537/14 * Math.sin(8 * t + 3/25) - 278/29 * Math.sin(9 * t + 23/33) - 107/15 * Math.sin(13 * t + 35/26) - 56/19 * Math.sin(20 * t + 5/9) - 5/9 * Math.sin(21 * t + 1/34) - 17/24 * Math.sin(28 * t + 36/23) - 21/11 * Math.sin(30 * t + 27/37) - 138/83 * Math.sin(31 * t + 1/7) - 10/17 * Math.sin(32 * t + 29/48) - 31/63 * Math.sin(42 * t + 27/28) - 4/27 * Math.sin(43 * t + 29/43) - 13/24 * Math.sin(48 * t + 5/21) - 4/7 * Math.sin(49 * t + 29/23) - 26/77 * Math.sin(50 * t + 29/27) - 19/14 * Math.sin(53 * t + 61/48) + 34/25 * Math.sin(54 * t + 37/26)


  bufferDataL[index] = x * -0.1 * scaleFactor ;
  bufferDataR[index] = y * -0.1 * scaleFactor;

  //use the below for dynamic displays
  // bufferDataL[index] = x * -0.1 * scaleFactor * Math.sin(j);


  // dolphin rotation

  index++;
  
  // bufferDataL[index] = (((x + 800 * 1.5) * Math.cos(j) - (y+800 * 1.5) * Math.sin(j)) - 800) * -0.1 * scaleFactor;
  // bufferDataR[index] = (((y + 800 * 1.5) * Math.cos(j) + (x+800*1.5) * Math.sin(j)) - 800) * -0.1 * scaleFactor;
}
// }


var bufferGain = audioContext.createGain();
bufferGain.gain.value = 1;
bufferSource.buffer = arrayBuffer;
bufferSource.loop = true;
bufferSource.playbackRate.value = 20
bufferSource.start();
bufferSource.connect(analyser);
bufferSource.connect(bufferGain);
bufferGain.connect(gain);

}

function startRose(){
  bufferSource = audioContext.createBufferSource();
  console.log("rose started");
  var bufferData = [];
var channels = 2;
var sampleRate = audioContext.sampleRate;
var sampleCount = parseInt(3.14159 * 20 / 0.001);
var arrayBuffer = audioContext.createBuffer(channels, sampleCount, sampleRate);
var bufferDataL = arrayBuffer.getChannelData(0);
var bufferDataR = arrayBuffer.getChannelData(1);

var scaleFactor = 1;

var index = 0;
k = ui.k_numerator.value/ui.k_denominator.value;
a = 10;
if (ui.k_numerator.value % 2 == 0 || ui.k_denominator.value % 2 == 0){
  var period = ui.k_denominator.value * 2;
  
} else {
  var period = ui.k_denominator.value
}
console.log(period);
for (var i = 0 ; i < 3.14159 * period *20 ; i+=0.001){
  r = a * Math.sin(k*i);
  // Heart
  // var x = 16 * Math.pow(Math.sin(i), 3);
  // var y = 13 * Math.cos(i) - 5 * Math.cos(2*i) - 2*Math.cos(3*i) - Math.cos(4*i);

  // Pattern
  // var x = 11 * Math.cos(i) - 6 * Math.cos(11 * i / 6);
  // var y = 11 * Math.sin(i) - 6 * Math.sin(11 * i / 6);

  // inspiration from http://www.archimy.com/examples/2d-epitrochoid.html







  // rhodonea
  // Calculations

  // Period 
  // If k = p/q is rational with p and q relatively prime, then the curve has period πq when p and q are both odd, otherwise 2πq.

  //# Polar Coordinates
  x = r * Math.cos(i);
  y = r * Math.sin(i);




  bufferDataL[index] = x * 0.1 * scaleFactor;
  bufferDataR[index] = y * 0.1 * scaleFactor;
  index++;
}



bufferSource.buffer = arrayBuffer;
bufferSource.loop = true;
bufferSource.playbackRate.value = 26
bufferSource.start();
bufferSource.connect(analyser);
bufferSource.connect(audioContext.destination);
console.log(bufferSource);


}

var roseOsc1, roseOsc2, roseOsc1Mod, roseOsc2Mod, roseGain1, roseGain2, roseDelay, roseMod1Gain;
roseOsc1 = audioContext.createOscillator();
  roseOsc1Mod = audioContext.createOscillator();
  roseOsc2 = audioContext.createOscillator();
  roseOsc2Mod = audioContext.createOscillator();

function startRoseCurveOscs(){
  disconnectOscs();
  var fundamental = 400;
  var k = ui.k_numerator.value/ui.k_denominator.value;
  roseOsc1 = audioContext.createOscillator();
  roseOsc1Mod = audioContext.createOscillator();
  roseOsc2 = audioContext.createOscillator();
  roseOsc2Mod = audioContext.createOscillator();
  roseOsc1.type = "sine";
  roseOsc2.type = "sine";
  roseOsc1Mod.type = "sine";
  roseOsc2Mod.type = "sine";
  roseOsc1.frequency.value = fundamental*k;
  roseOsc2.frequency.value = fundamental*k;
  roseOsc1Mod.frequency.value = fundamental;
  roseOsc2Mod.frequency.value = fundamental;
  roseGain1 = audioContext.createGain();
  roseGain2 = audioContext.createGain();
  roseDelay = audioContext.createDelay();
  roseModDelay = audioContext.createDelay();
  roseDelay1 = audioContext.createDelay();
  roseDelay2 = audioContext.createDelay();

  roseGain1.gain.value = 0;
  roseGain2.gain.value = 0;

  roseOsc1Mod.connect(roseGain1.gain);

  // roseDelay.delay.valye
  roseModDelay.delayTime.value = calculateDelay(fundamental);
  roseDelay1.delayTime.value = calculateDelay(fundamental*k);
  roseDelay2.delayTime.value = calculateDelay(fundamental*k);

  roseOsc2Mod.connect(roseModDelay);
  roseModDelay.connect(roseGain2.gain);

  roseOsc1.connect(roseDelay1);
  roseDelay1.connect(roseGain1);
  roseOsc2.connect(roseDelay2);
  roseDelay2.connect(roseGain2);



  roseGain1.connect(merger, 0, 0);
  // osc2.connect(delay);

  roseGain2.connect(merger, 0, 1);

  roseOsc1.start();
  roseOsc1Mod.start();
  roseOsc2.start();
  roseOsc2Mod.start();


}

function disconnectOscs(){
  osc1.disconnect();
  osc2.disconnect();
  newOsc1.disconnect();
  newOsc2.disconnect();
  newOsc3.disconnect();
  newOsc4.disconnect();
  roseOsc1.disconnect();
  roseOsc2.disconnect();
  roseOsc1Mod.disconnect();
  roseOsc2Mod.disconnect();
  bufferSource.disconnect();
}

function startHypotrochoid(){
  disconnectOscs();
   newOsc1 = audioContext.createOscillator();
 newOsc2 = audioContext.createOscillator();
 newOsc3 = audioContext.createOscillator();
 newOsc4 = audioContext.createOscillator();
  disconnectOscs();
    var rotation = 0;

    var scaleFactor = 0.05;

    var index = 0;

    a = ui.a.value
    b = ui.b.value;//text.b
    d = ui.d.value//text.d

    // a = 2
    // b = 3/8//ui.b.value
    // d = 5


    k = a - b // k is like (R - r)
    m = (a - b) / b // m is like (R - r)/r
    


    newOsc1.frequency.value = fundamentalFreq;
    newOsc2.frequency.value = fundamentalFreq * m;
    newOsc3.frequency.value = fundamentalFreq;
    newOsc4.frequency.value = fundamentalFreq * m;

    

    

    newGain1.gain.value = k * scaleFactor;
    newGain2.gain.value = d * scaleFactor;
    newGain3.gain.value = k * scaleFactor;
    newGain4.gain.value = -d * scaleFactor;

    newOsc1.connect(newGain1);
    newOsc2.connect(newGain2);
    newOsc3.connect(newGain3);
    newOsc4.connect(newGain4);

    // newGain1.connect(masterGain);
    // newGain2.connect(masterGain);
    // newGain3.connect(masterGain);
    // newGain4.connect(masterGain);

    // masterGain.connect(audioContext.destination);

    newDelay3.delayTime.value = 0.25 * (1 / newOsc3.frequency.value);
    newDelay4.delayTime.value = 0.25 * (1 / newOsc4.frequency.value);

    newGain1.connect(merger, 0, 0);
    newGain2.connect(merger, 0, 0);


    // newGain3.connect(merger, 0, 1);
    newGain3.connect(newDelay3);
    newDelay3.connect(merger, 0, 1);
    // newGain4.connect(merger, 0, 1);
    newGain4.connect(newDelay4);
    newDelay4.connect(merger, 0, 1);

    newOsc1.start();
    newOsc2.start();
    newOsc3.start();
    newOsc4.start();
}





$(document).on("change", '#inputType-interface select', function(){
    if ($(this).val() == 1){
        streaming = true;
        $('#freq-interface').attr('disabled', 'disabled').addClass("disabled");
    } else {
        streaming = false;
        $('#freq-interface').removeAttr('disabled').removeClass("disabled");
    }
})


var mapRange = function(from, to, s) {
  return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
};


var animateId;
var previousTranslate = {x:0, y:0};

function animate(){

    analyser.getFloatTimeDomainData(timeDomainL, timeDomainR);

    window.requestAnimationFrame(animate);

    drawData();

}

function drawData(){
    ctx2.translate(-previousTranslate.x, -previousTranslate.y);
    ctx2.clearRect(0,0,c.width,c.height);
    ctx2.beginPath();
    ctx2.strokeStyle = '#befde5';
    ctx2.lineWidth = 1;

    for (var i = -analyser.frequencyBinCount/2; i <= analyser.frequencyBinCount/2; i++) {
        index = i+analyser.frequencyBinCount/2;



        

            var offset = c.width * (analyser.frequencyBinCount/(analyser.frequencyBinCount-1)) * i/analyser.frequencyBinCount;

            
            var yc = ui.gain.value * ((timeDomainR[index]))*200;
            var xc = ui.gain.value * ((timeDomainL[index]))*200;


            //quick scaling
            yc = yc*0.1;
            xc = xc*0.1;

        

            yc += c.height/2;
            xc += c.width/2;

          


            ctx2.lineTo(xc, yc);



    }

    ctx2.stroke();
    ctx2.strokeStyle = 'rgba(174,244,218,0.3)';
    ctx2.lineWidth = 3;
    ctx2.stroke();
    ctx2.strokeStyle = 'rgba(174,244,218,0.3)';
    ctx2.lineWidth = 4;
    ctx2.stroke();

}

animate();
// startLissajous();



// Add audio file input functionality

var audio = new Audio();
audio.src = 'song-thrush-rspb.mp3';
audio.controls = true;
audio.onpause = function(){
  window.cancelAnimationFrame(animationID);
}

var fileInput = $("#audio-file");
$("#ui-container").append($(".audio-file-wrapper"));
$("#ui-container").append($("audio"));
fileInput.on("change", function(e) {

  audio.pause();
  // window.cancelAnimationFrame(animationID);

  //see http://lostechies.com/derickbailey/2013/09/23/getting-audio-file-information-with-htmls-file-api-and-audio-element/
  var file = e.currentTarget.files[0];
  var objectUrl = URL.createObjectURL(file);

  audio.src = objectUrl;


})


audio.onplay = function(){
    // stop any currectly playing oscs
    disconnectOscs();
}

document.body.appendChild(audio);
$("#ui-container").append($(".audio-file-wrapper"));
$("#ui-container").append($("audio"));

var input2 = audioContext.createMediaElementSource(audio);
input2.connect(analyser);
input2.connect(audioContext.destination);


