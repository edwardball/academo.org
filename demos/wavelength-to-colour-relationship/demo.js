var demo = new Demo({
    ui: {
        wavelength: {
          title: "Wavelength",
          value: 500,
          units: "nm",
          range:[380,780],
          resolution:1
        }
    },

    color:null,

    init: function(){
        $('#demo').append("<div id='color_display'></div>");
        $('#ui-container').append("<div id='color'></div>");
        this.update();
    },

    update: function(e){
        this.color = this.nmToRGB(this.ui.wavelength.value);
        $("#color_display").css("background-color", this.rgbToHex(this.color));
        var colHtml = "<p><span>Color:</span><br />rgb(";
        colHtml += this.color[0] +", "+ this.color[1] + ", "+ this.color[2];
        colHtml += ")<br />Hex: " + this.rgbToHex(this.color) + "<br />";
        colHtml += chroma(this.rgbToHex(this.color)).css('hsl');
        colHtml += "</p>";
        $("#color").html(colHtml);
    },

    nmToRGB: function(wavelength){
        var Gamma = 0.80,
        IntensityMax = 255,
        factor, red, green, blue;

        if((wavelength >= 380) && (wavelength<440)){
            red = -(wavelength - 440) / (440 - 380);
            green = 0.0;
            blue = 1.0;
        }else if((wavelength >= 440) && (wavelength<490)){
            red = 0.0;
            green = (wavelength - 440) / (490 - 440);
            blue = 1.0;
        }else if((wavelength >= 490) && (wavelength<510)){
            red = 0.0;
            green = 1.0;
            blue = -(wavelength - 510) / (510 - 490);
        }else if((wavelength >= 510) && (wavelength<580)){
            red = (wavelength - 510) / (580 - 510);
            green = 1.0;
            blue = 0.0;
        }else if((wavelength >= 580) && (wavelength<645)){
            red = 1.0;
            green = -(wavelength - 645) / (645 - 580);
            blue = 0.0;
        }else if((wavelength >= 645) && (wavelength<781)){
            red = 1.0;
            green = 0.0;
            blue = 0.0;
        }else{
            red = 0.0;
            green = 0.0;
            blue = 0.0;
        };

        // Let the intensity fall off near the vision limits

        if((wavelength >= 380) && (wavelength<420)){
            factor = 0.3 + 0.7*(wavelength - 380) / (420 - 380);
        }else if((wavelength >= 420) && (wavelength<701)){
            factor = 1.0;
        }else if((wavelength >= 701) && (wavelength<781)){
            factor = 0.3 + 0.7*(780 - wavelength) / (780 - 700);
        }else{
            factor = 0.0;
        };

        if (red !== 0){
            red = Math.round(IntensityMax * Math.pow(red * factor, Gamma));
        }
        if (green !== 0){
            green = Math.round(IntensityMax * Math.pow(green * factor, Gamma));
        }
        if (blue !== 0){
            blue = Math.round(IntensityMax * Math.pow(blue * factor, Gamma));
        }

        return [red,green,blue];
    },

    toHex: function(number){
        //converts a decimal number into hex format
        var hex =  number.toString(16);
        if (hex.length < 2){
            hex = "0" + hex;
        }
        return hex;
    },

    rgbToHex: function(color){
        //takes an 3 element array (r,g,b) and returns a hexadecimal color
        var hexString = '#';
        for (var i = 0 ; i < 3 ; i++){
            hexString += this.toHex(color[i]);
        }
        return hexString;
    },

    // renderRainbow: function(){
    //     //render all the colours - used to generate the thumbnail image
    //     var canvas = document.createElement('canvas');
    //     var ctx = canvas.getContext("2d");
    //     canvas.width = 870;
    //     canvas.height = 400;
    //     $("#demo").append(canvas);

    //     for (var i = 0 ; i < canvas.width ; i++){
    //         ctx.fillStyle = this.rgbToHex(this.nmToRGB(this.map(i, 0, canvas.width, this.ui.wavelength.range[0], this.ui.wavelength.range[1])));
    //         ctx.fillRect(i, 0, 1, canvas.height);
    //         ctx.fill();
    //     }
    // },

    // map: function(value, minFrom, maxFrom, minTo, maxTo){
    //     //http://stackoverflow.com/questions/4154969/how-to-map-numbers-in-range-099-to-range-1-01-0
    //     return minTo + (maxTo - minTo) * ((value - minFrom) / (maxFrom - minFrom));
    // }
});