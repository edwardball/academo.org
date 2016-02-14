var ui = {
    inputType: {
        title: "Input",
        value: 2,
        values: [["Live Input",1], ["Sine Wave (amplitude 5V)",2]]
    },
    freq: {
        title: "Input Sine Wave Frequency",
        value: 200,
        range:[1,1000],
        resolution:1,
        units: "Hz"
    },
    gain: {
        title: "Oscilloscope gain",
        value: 1,
        // units: "K",
        range:[0,5],
        resolution:0.1,
    },
    invert: {
        title: "Invert",
        value: false,
    },
    freeze: {
        title: "Freeze",
        value: false,
    },
    dropdownExample: {
        title: "Seconds / div",
        value: 1,
        // values: [["100µs", 0.1],["200µs", 0.2],["500µs", 0.5],["1ms", 1],["2ms", 2],["5ms",5], ["20ms",20], ["50ms",50],[".1s",100],[".20s",200]]
        values: [["50µs", 0.05],["100µs", 0.1],["200µs", 0.2],["500µs", 0.5],["1ms", 1]]
    },
    volts: {
        title: "Volts / div",
        value: 1,
        values: [["1V", 0.2],["2V", 0.4],["5V", 1],["10V", 2]]
    },
    dc_offset: {
        title: "Vertical Offset",
        value: 0,
        // units: "K",
        range:[-300,300],
        resolution:0.1,
        input: "hidden"
    },
    // horizOffset: {
    //     title: "Horizontal Position",
    //     value: 0,
    //     // units: "K",
    //     range:[-50,50],
    //     resolution:0.1,
    //     // units: "%"
    //     input: "hidden"
    // }

};

// if (navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia){
//     navigator.getUserMedia( {audio:true}, gotStream );
// } else {
//     animate();
//     $(".preamble").append("<div class='alert'>To use Live Audio Input, please download the latest version of Chrome.</div>");
// };


$(document).on("uiLoaded", function(){
    if (navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia){
        navigator.getUserMedia( {audio:true}, gotStream );
    } else {
        animate();
        $(".preamble").append("<div class='alert'>To use Live Audio Input, please download the latest version of Chrome.</div>");
        $("#inputType-interface option[value=1]").attr("disabled", true);
    };
})



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
    ctx.strokeStyle = "196156";
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

function update(el){
    //only need to 'animate' one frame when not isRunning
    // console.log(ui.freeze.value);
    if (streaming != true){
        if (isRunning == false){
            isRunning = true;
            animate();
            // drawData();
        } else {
            drawData();
        }
    }

    if (el.title == "Freeze"){
        if (ui.freeze.value){
            window.cancelAnimationFrame(animateId);
        } else {
            animate();
            // drawData();
        }
    }




    // if (ui.freeze.value && isRunning){
    //     // isRunning = false;
    //     window.cancelAnimationFrame(animateId);
    // } else if(ui.freeze.value && !isRunning) {

    // } else if (!ui.freeze.value && !isRunning){
    //     isRunning = true;
    //     animate();
    // }

}



window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var gainNode = audioContext.createGain();
var analyser = audioContext.createAnalyser();

//confusing, gain on oscilloscope, different for gain affecting input
// gainNode.gain.value = ui.gain.value;

gainNode.gain.value = 3;


analyser.smoothingTimeConstant = .9;
// analyser.fftSize = 512;
analyser.fftSize = 1024;
gainNode.connect(analyser);
// frequencyBinCount is readonly and set to fftSize/2;
var timeDomain = new Uint8Array(analyser.frequencyBinCount);
var streaming = false;
var sampleRate = audioContext.sampleRate;
var numSamples = analyser.frequencyBinCount;


function gotStream(stream) {
    // Create an AudioNode from the stream.
    var mediaStreamSource = audioContext.createMediaStreamSource( stream );

    //for testing
    var osc = audioContext.createOscillator();
    osc.frequency.value = 200;
    osc.start(0);

    // switch these lines
    mediaStreamSource.connect(gainNode);
    // osc.connect(gainNode);

    streaming = true;
    animate();
    $('#inputType-interface select').val(1).change();
    // $('#inputType-interface select').val(1).trigger("change");
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



var k = 0.00001; //k is the number to make the divisions match up

var animateId;

function animate(){

    if (streaming == true){
        animateId = window.requestAnimationFrame(animate);
    }

    drawData();

    // gainNode.gain.value = ui.gain.value;
}

function drawData(){
    analyser.getByteTimeDomainData(timeDomain);

    ctx2.clearRect(0,0,c.width,c.height);
    ctx2.beginPath();
    // ctx2.moveTo(0, midPoint.y);
    // ctx2.lineCap = 'square';
    ctx2.strokeStyle = '#befde5';
    ctx2.lineWidth = 1;
    // for (var i = 0; i <= analyser.frequencyBinCount; i++) {
        for (var i = -analyser.frequencyBinCount/2; i <= analyser.frequencyBinCount/2; i++) {
            index = i+analyser.frequencyBinCount/2;

        // i_original = i;
        //the minus makes sure the graphs moves the right way
        // i_offset = (i + -ui.horizOffset.value*0.01*(analyser.frequencyBinCount))%(analyser.frequencyBinCount);

        var height = c.height * timeDomain[i] / 256;
        var offset = c.width * (analyser.frequencyBinCount/(analyser.frequencyBinCount-1)) * i/analyser.frequencyBinCount;

        if (streaming == true){

            // var xc = (i * c.width/analyser.frequencyBinCount + (i+1) * c.width/analyser.frequencyBinCount) / 2;
            var xc = i * (c.width/analyser.frequencyBinCount);



            // var yc = (timeDomain[i+analyser.frequencyBinCount/2] / 256 + timeDomain[i+1+analyser.frequencyBinCount/2] / 256);
            var yc = ui.gain.value * ((timeDomain[index] / 256) - 0.5)*c.height/(3 * ui.volts.value);

            yc += c.height/2;

            // apply dc offset
            yc = ui.dc_offset.value*-1 + yc;

            // yc *= c.height/2;

            // console.log(yc);

            // shift graph to middle of oscilloscpe
            xc += c.width/2;

            xc = mapRange([0, 0.001*ui.dropdownExample.value], [0, 100 * (numSamples/sampleRate) / c.width], xc);

            // ctx2.quadraticCurveTo(offset, parseFloat(height-ui.dc_offset.value*1), xc, parseFloat(yc-ui.dc_offset.value*1));
            // ctx2.lineTo(xc, yc);
            // ctx2.lineTo(xc*(870/0.00533)*0.00001*ui.dropdownExample.value, yc);
            ctx2.lineTo(xc, yc);

            // if (index ==0 ) console.log(yc)

        } else {

            var xc = i * (c.width/analyser.frequencyBinCount);

            //dropdown value also needs mapping
            scaledRangeValue = mapRange([1,2], [1,3], ui.dropdownExample.value);


            //needs mapping
            // xc = mapRange([0, 1*c.width], [-0.5*c.width, 1.5*c.width], xc);
            // xc = mapRange([0, 1*c.width], [-0.5*c.width, 0.5*c.width], xc);
            // xc = mapRange([0*c.width, 1*c.width], [-(ui.dropdownExample.value*1+0.5)*c.width, (ui.dropdownExample.value*1-0.5)*c.width], xc);
            // xc = mapRange([0*c.width, 1*c.width], [mapRange([1,3], [0,-1], ui.dropdownExample.value)*c.width, mapRange([1,3], [1,2], ui.dropdownExample.value)*c.width], xc);


            var amplitude = c.height/6 / ui.volts.value;

            // ensures we have 1 full period over course of screen
            // var yc =  amplitude * Math.sin(2*Math.PI*i_offset / analyser.frequencyBinCount );


            freq = 200;
            //so total length in seconds of graph is sampleRate*numSamples
            //console.log("total length:", numSamples/sampleRate); //=0.0053333seconds, so 1 pixel represents 0.00533/width seconds
            //by default 100px represents 100*0.00533/width  = ??? seconds
            //we want it to represent 1ms


            // console.log(i_offset);
            // var yc =  amplitude * Math.sin(2*Math.PI*i_offset*freq*numSamples/sampleRate);
            // var yc =  amplitude * Math.sin(k*2*Math.PI*xc*freq*0.00533/c.width);
            var yc =  -amplitude * Math.sin(2*Math.PI*xc*ui.freq.value*0.00001*ui.dropdownExample.value); //0.00001 is the number of seconds we want a pixel to represent, ie 1ms / 100



            //apply gain
            yc *= ui.gain.value;
            //center vertically
            yc = c.height/2 + yc
            // apply dc offset
            yc = ui.dc_offset.value*-1 + yc;

            // shift graph to middle of oscilloscpe
            xc += c.width/2

            if (ui.invert.value) yc = -yc + c.height;
            // ctx2.quadraticCurveTo(offset, parseFloat(height-ui.dc_offset.value*1), xc, parseFloat(yc-ui.dc_offset.value*1));
            ctx2.lineTo(xc, yc);
            // console.log(xc, yc);

        }
        // i = i_original;
    }

    ctx2.stroke();
    ctx2.strokeStyle = 'rgba(174,244,218,0.6)';
    ctx2.lineWidth = 3;
    ctx2.stroke();
    ctx2.strokeStyle = 'rgba(174,244,218,0.3)';
    ctx2.lineWidth = 6;
    ctx2.stroke();

}

animate();