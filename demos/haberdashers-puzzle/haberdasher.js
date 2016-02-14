ui = null;

fabric.Object.prototype.drawControls = function(ctx) {
    	if (!this.hasControls) return this;

    	var size = this.cornerSize,
    	    size2 = size / 2,
    	    strokeWidth2 = ~~(this.strokeWidth / 2), // half strokeWidth rounded down
    	    left = -(this.width / 2),
    	    top = -(this.height / 2),
    	    _left,
    	    _top,
    	    sizeX = size / this.scaleX,
    	    sizeY = size / this.scaleY,
    	    paddingX = this.padding / this.scaleX,
    	    paddingY = this.padding / this.scaleY,
    	    scaleOffsetY = size2 / this.scaleY,
    	    scaleOffsetX = size2 / this.scaleX,
    	    scaleOffsetSizeX = (size2 - size) / this.scaleX,
    	    scaleOffsetSizeY = (size2 - size) / this.scaleY,
    	    height = this.height,
    	    width = this.width,
    	    methodName = this.transparentCorners ? 'strokeRect' : 'fillRect',
    	    transparent = this.transparentCorners,
    	    isVML = typeof G_vmlCanvasManager !== 'undefined';

    	ctx.save();

    	ctx.lineWidth = 1 / Math.max(this.scaleX, this.scaleY);

    	ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
    	ctx.strokeStyle = ctx.fillStyle = this.cornerColor;

    	// top-left
    	_left = left - scaleOffsetX - strokeWidth2 - paddingX;
    	_top = top - scaleOffsetY - strokeWidth2 - paddingY;

    	isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
    	// ctx[methodName](_left, _top, sizeX, sizeY);

    	// top-right
    	_left = left + width - scaleOffsetX + strokeWidth2 + paddingX;
    	_top = top - scaleOffsetY - strokeWidth2 - paddingY;

    	isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
    	// ctx[methodName](_left, _top, sizeX, sizeY);

    	// bottom-left
    	_left = left - scaleOffsetX - strokeWidth2 - paddingX;
    	_top = top + height + scaleOffsetSizeY + strokeWidth2 + paddingY;

    	isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
    	// ctx[methodName](_left, _top, sizeX, sizeY);

    	// bottom-right
    	_left = left + width + scaleOffsetSizeX + strokeWidth2 + paddingX;
    	_top = top + height + scaleOffsetSizeY + strokeWidth2 + paddingY;

    	isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
    	// ctx[methodName](_left, _top, sizeX, sizeY);

    	if (!this.get('lockUniScaling')) {
    	  // middle-top
    	  _left = left + width/2 - scaleOffsetX;
    	  _top = top - scaleOffsetY - strokeWidth2 - paddingY;

    	  isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
    	  // ctx[methodName](_left, _top, sizeX, sizeY);

    	  // middle-bottom
    	  _left = left + width/2 - scaleOffsetX;
    	  _top = top + height + scaleOffsetSizeY + strokeWidth2 + paddingY;

    	  isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
    	  // ctx[methodName](_left, _top, sizeX, sizeY);

    	  // middle-right
    	  _left = left + width + scaleOffsetSizeX + strokeWidth2 + paddingX;
    	  _top = top + height/2 - scaleOffsetY;

    	  isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
    	  // ctx[methodName](_left, _top, sizeX, sizeY);

    	  // middle-left
    	  _left = left - scaleOffsetX - strokeWidth2 - paddingX;
    	  _top = top + height/2 - scaleOffsetY;

    	  isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
    	  // ctx[methodName](_left, _top, sizeX, sizeY);
    	}

    	// middle-top-rotate
    	if (this.hasRotatingPoint) {

    	  _left = left + width/2 - scaleOffsetX;
    	  _top = this.flipY ?
    	    (top + height + (this.rotatingPointOffset / this.scaleY) - sizeY/2 + strokeWidth2 + paddingY)
    	    : (top - (this.rotatingPointOffset / this.scaleY) - sizeY/2 - strokeWidth2 - paddingY);

    	  isVML || transparent || ctx.clearRect(_left, _top, sizeX, sizeY);
    	  ctx[methodName](_left, _top, sizeX, sizeY);
    	}

    	ctx.restore();

    	return this;
    };

    var diamond = [
      {x:164,y:285},
      {x:303,y:445},
      {x:488,y:285},
      {x:326,y:0}
    ];

    var yellow_points = [
      {x:488,y:565},
      {x:652,y:565},
      {x:488,y:285},
      {x:350,y:405}
    ];

    var tri = [
      {x:164,y:565},
      {x:488,y:565},
      {x:350,y:405}
    ];

    var red_points = [
      {x:0,y:565},
      {x:164,y:565},
      {x:303,y:445},
      {x:164,y:285}
    ];


    $(document).ready(function () {


        $('#demo').append("<canvas id='c' height='500' width='500'></canvas>");

    	var canvas = new fabric.Canvas('c');


    	var rect1 = new fabric.Polygon(diamond, {
    	  left: 260, top: 200,
    	  // fill: 'rgba(231,76,60,0.75)',
    	  fill: 'rgba(41,128,185,0.75)',
    	  scaleX:0.5,
    	  scaleY:0.5,
    	  stroke: '#34495e',
    	  strokeWidth: 3,
    	});

    	// /*rect1.set('scaleY') =*/ rect1.set('scaleX') = 0.5;


    	var rect2 = new fabric.Polygon(red_points, {
    	  left: 172, top: 302,
    	  fill: 'rgba(231,76,60,0.75)',
    	  scaleX:0.5,
    	  scaleY:0.5,
    	  stroke: '#34495e',
    	  strokeWidth: 3,
    	});


    	var rect3 = new fabric.Polygon(tri, {
    	  left: 260, top: 332,
    	  fill: 'rgba(41,128,185,0.75)',
    	  fill: 'rgba(39,174,96,0.75)',
    	  scaleX:0.5,
    	  scaleY:0.5,
    	  stroke: '#34495e',
    	  strokeWidth: 3,
    	});

    	var rect4 = new fabric.Polygon(yellow_points, {
    	  left: 348, top: 302,
    	  fill: 'rgba(241,196,15,0.75)',
    	  scaleX:0.5,
    	  scaleY:0.5,
    	  stroke: '#34495e',
    	  strokeWidth: 3,
    	});


    	var triangle = new fabric.Triangle({
    	  width: 100, height: 100, left: 100, top: 350, fill: 'rgba(241,196,15,0.75)'
    	});

    	canvas.add(rect1, rect2, rect3, rect4);
    	canvas.on({
    	  'object:moving': onChange,
    	  'object:scaling': onChange,
    	  'object:rotating': onChange,
    	});

    	function onChange(options) {
    	  options.target.setCoords();
    	  canvas.forEachObject(function(obj) {
    	    if (obj === options.target) return;
    	    // obj.setOpacity(options.target.intersectsWithObject(obj) ? 0.5 : 1);
    	  });
    	}
    });
