//http://stackoverflow.com/questions/18719775/parsing-and-converting-exponential-values-to-decimal-in-javascript
Number.prototype.noExponents= function(){
    var data= String(this).split(/[eE]/);
    if(data.length== 1) return data[0]; 

    var  z= '', sign= this<0? '-':'',
    str= data[0].replace('.', ''),
    mag= Number(data[1])+ 1;

    if(mag<0){
        z= sign + '0.';
        while(mag++) z += '0';
        return z + str.replace(/^\-/,'');
    }
    mag -= str.length;  
    while(mag--) z += '0';
    return str + z;
}

var demo = new Demo({
	ui: {
		update: {
			title: "Update",
			type: "button"
		},
		expression: {
			title: "expression",
			value: "x*x - y*y",
			type: "userInputString"
		},
		range: {
			title: "Range of graph",
			value: "-10,10",
			type: "userInputString"
		},
		contourRange: {
			title: "Range of contour levels",
			value: "-100,100",
			type: "userInputString"
		},
		contourCount: {
			title: "Number of contour levels",
			value: 21,
			range: [3, 25],
			resolution: 1
		},
		values: {
			title: "x,y,z values (hover over the graph to update)",
		    input: "readonly",
		    value: "(0,0,0)"
		},
	},

	width:500,
	height:500,

	init: function(){
		canvas = document.getElementById('c');
		canvas.width = this.width;
		canvas.height = this.height;
		this.context = canvas.getContext('2d');
		$("#demo").append($("#svg-container"));
		$("#js-demo-axes").appendTo("#demo");
		this.axesCanvas = document.getElementById('js-demo-axes');
		this.keyCanvas = document.getElementById('js-key');
		this.axesCtx = this.axesCanvas.getContext("2d");
		this.keyCtx = this.keyCanvas.getContext("2d");
		this.axesGraph = new Graph(this.axesCtx, -10,+10,-10,+10,250,250,500,500);
		this.axesGraph.drawgrid(2,1,2,1);
		this.update();


		$("#demo svg").mousemove(this.mouseMoveCallback.bind(this));
	},

	mouseMoveCallback: function(e){
		
		var x = this.xScale(e.offsetX);
		var y = this.yScale(e.offsetY);
		var z = this.expr.evaluate({
			x:x,
			y:y
		});

		this.ui.values.value = "(" + (x*1).toFixed(2) + ", " + (y*1).toFixed(2) + ", " + (z*1).toFixed(2) + ")";
		$("#values-interface input").val(this.ui.values.value);
	},

	colorMap: function(input){ //input is between 0 and 1
		// http://stackoverflow.com/questions/12875486/what-is-the-algorithm-to-create-colors-for-a-heatmap
		var h = parseInt((1 - input) * 240);
		var s = parseInt(100);
		var l = parseInt(input * 50);
		// return "hsl("+h+", "+ s +"%, "+l+"%)";
		return "hsl("+h+", 50%, 50%)";
	},

	normalize: function(input, min, max){
		//http://stats.stackexchange.com/questions/70801/how-to-normalize-data-to-0-1-range
		return (input - min) / (max - min);
	},

	calcContourRange: function(){
		this.contourMin = parseFloat(this.ui.contourRange.value.split(",")[0]);
		this.contourMax = parseFloat(this.ui.contourRange.value.split(",")[1]);
		this.contourRange = this.contourMax - this.contourMin;
		this.contourInterval = (this.contourMax - this.contourMin)/(this.ui.contourCount.value - 1); // nned a minus 1 becaue say we go from 0 to 10, we want a contour at 0 AND 10.
	},

	update: function(e){
		try{
			this.expr = Parser.parse(this.ui.expression.value);
		} catch (e) {
			alert("Sorry, it looks like there's something wrong with the mathematical expression you entered. Please try again.");
		}

		this.xScale = d3.scale.linear()
                .domain([0, 500])
                .range([this.ui.range.value.split(",")[0], this.ui.range.value.split(",")[1]]);
		this.yScale = d3.scale.linear()
                .domain([0, 500])
                .range([this.ui.range.value.split(",")[1], this.ui.range.value.split(",")[0]]);


		data = [];
		sampleX = [];
		sampleY = [];

		dataPointCount = 100; //100 x 100 square grid //ACTUALLY 101*101 so we don't get a gap at edge of graph

		maxValue = this.ui.range.value.split(",")[1];
		minValue = -maxValue; //NB this is assuming a square, symmetric range

		if (e == "update"){
			this.axesCtx.clearRect(0,0,this.width, this.height);
			this.axesGraph = new Graph(this.axesCtx, minValue,maxValue,minValue,maxValue,250,250,500,500);
			this.axesGraph.drawgrid(maxValue/5,maxValue/10,maxValue/5,maxValue/10);
		}

		contourLevelCount = 20;

		currentMax = 0;
		currentMin = 0;

		for (var i = 0 ; i <= dataPointCount ; i++){
			data[i] = [];
			for (var j = 0 ; j <= dataPointCount ; j++){
				y = (j - dataPointCount*0.5)/(dataPointCount*0.5/maxValue); //eg 25 would give a max of 50/25 = 2.
				x = (i - dataPointCount*0.5)/(dataPointCount*0.5/maxValue);
				z = this.expr.evaluate({
								x:x,
								y:y
				})
				data[i][j] = z;
				sampleX[j] = (j*this.width/dataPointCount); //if we have 100 points, we need our data to go to 500 (not 100), so need to multiply by 5, or width/dataPointCount
				sampleY[i] = (i*this.width/dataPointCount);

				// if (z > currentMax){
				// 	currentMax = z;
				// }
				// if (z < currentMin){
				// 	currentMin = z;
				// }
			}
		}

		// var zRange = currentMax - currentMin;
		// var contourInterval = zRange / this.ui.contourCount.value;

		// var contourLevels = [];

		this.calcContourRange();
		var contourLevels = [];
		this.keyCtx.clearRect( 0,0,500,30);
		this.keyCtx.textAlign="left";
		for (var i = 0 ; i < this.ui.contourCount.value ; i++){ 
			contourLevels[i] = this.contourMin + i*this.contourInterval;
			var canvasX = 500 * i/(this.ui.contourCount.value+1 );
			var colorBlockWidth = 500 / (this.ui.contourCount.value+1 );
			this.keyCtx.fillStyle = this.colorMap((contourLevels[i] - this.contourMin) / this.contourRange);
			this.keyCtx.fillRect( canvasX, 0, colorBlockWidth, 15);
			this.keyCtx.fillStyle = "#333";

			// Add labels to color blocks, but only for every other block if there are a lot of contours
			if (this.ui.contourCount.value <= 14 || i % 2 == 0){
				this.keyCtx.fillText( (contourLevels[i]*1).toFixed(2), canvasX, 30);
				this.keyCtx.fillStyle = "#AAA";

				this.keyCtx.fillRect(canvasX + 0.5 * colorBlockWidth, 15, 1, 4);
			}
			// this.keyCtx.fillRect( 0,0,10,10);
		}

					
		var c = new Conrec;
		// c.contour(data, 0, 2, 0, 2, [1, 2, 3], [1, 2, 3], 3, [0, 1, 2]);
		// c.contour(data, 0, 499, 0, 499, sampleX, sampleY, 7, [25+this.ui.slider2.value, 500+this.ui.slider2.value, 1000+this.ui.slider2.value, 2500+this.ui.slider2.value, 5000+this.ui.slider2.value, 10000+this.ui.slider2.value, 20000+this.ui.slider2.value]);
		c.contour(data, 0, dataPointCount, 0, dataPointCount, sampleX, sampleY, contourLevels.length, contourLevels);

		contourList = c.contourList();
		this.context.clearRect(0,0,500,500);
		lastPoint = {
			x: '',
			y: ''
		}
		$("svg g path").remove();
		for (var i = 0 ; i< contourList.length ; i++){
			this.context.beginPath();
			this.context.fillStyle = "none";
			this.context.moveTo(contourList[i][0].x, contourList[i][0].y);
			$("svg g").prepend("<path id='path"+i+"' d='' stroke='#333' fill='none' />");
			pathData = "M" + contourList[i][0].x.noExponents() + ", " + (canvas.height - contourList[i][0].y.noExponents())
			for (var j = 1 ; j < contourList[i].length ; j++){
				newPoint = {
					x: contourList[i][j].x,
					y: contourList[i][j].y
				}
				if (parseInt(lastPoint.x) == parseInt(newPoint.x) && parseInt(lastPoint.y) == parseInt(newPoint.y)){
				} else {
					this.context.lineTo(newPoint.x, newPoint.y);
					pathData += "L" + newPoint.x.noExponents()+ "," + (canvas.height - newPoint.y.noExponents());

				}
				lastPoint = newPoint;
			}
			this.context.stroke();
			$("#path"+i).attr("d", pathData).attr("title", contourList[i].level).attr("stroke", this.colorMap(this.normalize(contourList[i].level, this.contourMin, this.contourMax)));
		}
		$("#svg-container").html($("#svg-container").html());

		$("#demo svg").mousemove(this.mouseMoveCallback.bind(this));
				
	}
});