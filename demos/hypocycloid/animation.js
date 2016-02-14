ui = {
    innerCircleRadius: {
        title: "Inner Circle Radius",
        value: 60,
        range: [5,120],
        resolution: 1,
        units: "pixels"
    },
      animate: {
        title: "Animate",
        value: false
    },
    speed: {
        title: "Speed",
        value: 10,
        range: [1, 100],
        resolution: 1
    },
    hideSVG:{
       title: "Hide Circles",
       value: false
    },
    clearTrace:{
        title: "Clear Trace",
        type: "button"
    }
};

settings = {
    progress: {
        title: "Rotation",
        value: 0,
        range: [0, 360],
        resolution: 1
    },
};


var SVG = function(){
  this.element = document.getElementsByTagName("svg")[0];
  this.namespace = "http://www.w3.org/2000/svg";
  this.width = $("#demo").width();
  this.height = 400;
}

var Circle = function(x,y,r,strokeColor,fillColor) {
  this.x = x;
  this.y = y;
  this.radius =r;
  this.strokeColor = strokeColor;
  this.fillColor = fillColor;
  // this.thickness = svg.height/4;
  // this.fill = "none";
  // this.stroke = "#333";
  this.element = null;
  // this.init();
};


Circle.prototype.draw = function(r, cx, cy){
    this.element.setAttribute("r", r);
    this.element.setAttribute("cx", cx);
    this.element.setAttribute("cy", cy);
}

Circle.prototype.init = function(id, appendTo){
    this.element = document.createElementNS(svg.namespace,"circle");
    appendTo.append(this.element);
    this.element.setAttribute("id", id);
    this.element.setAttribute("cx", this.x);
    this.element.setAttribute("cy", this.y);
    this.element.setAttribute("r", this.radius);
    this.element.setAttribute("stroke", this.strokeColor);
    this.element.setAttribute("stroke-width", 1.5);
    this.element.setAttribute("fill", this.fillColor);
 //  this.element.setAttribute("stroke", this.stroke);
 //  this.element.setAttribute("stroke-width", 2);
 //  this.draw();
};


var Line = function(x1,y1,x2,y2, strokeColor){
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.strokeColor = strokeColor;
}

Line.prototype.init = function(id, appendTo){
    this.element = document.createElementNS(svg.namespace,"line");
    appendTo.append(this.element);
    this.element.setAttribute("id", id);
    this.element.setAttribute("x1", this.x1);
    this.element.setAttribute("y1", this.y1);
    this.element.setAttribute("x2", this.x2);
    this.element.setAttribute("y2", this.y2);
    this.element.setAttribute("stroke", this.strokeColor);
    this.element.setAttribute("stroke-width", 1);
    this.element.setAttribute("fill", this.fillColor);
 //  this.element.setAttribute("stroke", this.stroke);
 //  this.element.setAttribute("stroke-width", 2);
 //  this.draw();
};

Line.prototype.draw = function(x1, y1, x2, y2){
    this.element.setAttribute("x1", x1);
    this.element.setAttribute("y1", y1);
    this.element.setAttribute("x2", x2);
    this.element.setAttribute("y2", y2);
}



function update(e){

    var demoOffest = $("#demo").offset();
    var markerOffset = $("#marker").offset();

    markerLeft = markerOffset.left - demoOffest.left;
    markerTop = markerOffset.top - demoOffest.top;

    lastPoint = {x:markerLeft+3, y:markerTop+3};

    if (e == "animate"){
          if (ui.animate.value == true){
              animate();
          } else {
            cancelAnimationFrame(animationRef);
            spin = animationRef;
        }
    }

    if (e == 'hideSVG' && $("svg").css("opacity") == "0"){
        $("svg").css("opacity", 1);
    } else if (e == 'hideSVG' && $("svg").css("opacity") != "0"){
        $("svg").css("opacity", 0);
    }



    $("#inner-wrapper").attr("transform", "rotate("+-settings.progress.value+", "+outerCircleX+", "+outerCircleY+")");
    $("#marker, #bar").attr("transform", "rotate("+settings.progress.value * outerCircleRadius / ui.innerCircleRadius.value +", "+innerCircle.element.getAttribute("cx")+", "+innerCircle.element.getAttribute("cy")+")")


    //correct
    innerCircle.draw(ui.innerCircleRadius.value, outerCircleX + outerCircleRadius - ui.innerCircleRadius.value, outerCircleY);
    innerCirclePoint.draw(3, outerCircleX + outerCircleRadius - ui.innerCircleRadius.value, outerCircleY);



    bar.draw(outerCircleX + outerCircleRadius - ui.innerCircleRadius.value, outerCircleY, outerCircleX + outerCircleRadius, innerCircleY);
    // marker = new Circle(markerX,markerY,markerRadius,"red", "red");

    var demoOffest = $("#demo").offset();
    var markerOffset = $("#marker").offset();

    markerLeft = markerOffset.left - demoOffest.left;
    markerTop = markerOffset.top - demoOffest.top;


    currentPoint = {x:markerLeft+3, y:markerTop+3};


    var dist = distanceBetween(lastPoint, currentPoint);
    var angle = angleBetween(lastPoint, currentPoint);

    // context.lineTo($("#marker").position().left+3, $("#marker").position().top+3);
    // context.stroke();

    for (var i = 0; i < dist; i+=1) {

      x = lastPoint.x + (Math.sin(angle) * i);
      y = lastPoint.y + (Math.cos(angle) * i);

      // var radgrad = context.createRadialGradient(x,y,1,x,y,2);

      // radgrad.addColorStop(0, '#000');
      // radgrad.addColorStop(0.5, '#000');
      // radgrad.addColorStop(1, 'rgba(0,0,0,0)');


      context.beginPath();
      context.arc(x, y, 0.5, 0, 2 * Math.PI, false);
      context.fill();
      context.closePath();

      // context.fillStyle = radgrad;
      //  context.fillRect(x-20, y-20, 40, 40);
    }


    // context.beginPath();
    // context.arc($("#marker").position().left+3, $("#marker").position().top+3, 1, 0, 2 * Math.PI, false);
    // context.fill();
    // context.closePath();

    // context.clearRect(0, 0, canvas.width, canvas.height);

    // console.log(0, 0, canvas.width, canvas.height);

    // console.log(settings.progress.value);

    // for (var i = 0; i < 1000; i++) {
    //     point =  hypocycloid(outerCircleRadius, innerCircleRadius, (i/1000)* settings.progress.value*Math.PI / 180);
    //     context.lineTo(outerCircleX + point.x, outerCircleY + point.y);
    // }
    // context.stroke();


}

function distanceBetween(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}
function angleBetween(point1, point2) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}

function hypocycloid(R, r, theta){
    x = (R - r)* Math.cos(theta) + r* Math.cos(theta * (R - r) / r);
    y = (R - r)* Math.sin(theta) - r* Math.sin(theta * (R - r) / r);
    return {"x": x, "y":y};
}

function animate() {

    animationRef = window.requestAnimationFrame(animate);
    settings.progress.value = settings.progress.value*1 + ui.speed.value / 20;
    update(settings.progress);
    // f++;
    // return spin;
}

var outerCircle, innerCircle, marker, canvas, context, lastPoint;

$(document).on("uiLoaded", function(){


    $("#demo").append("<svg width='100%' height='400px'><g id='wrapper'><g id='inner-wrapper'><g id='bar-wrapper'></g></g></g></svg>");
    svg = new SVG();

    $("#demo").append("<canvas id='c'></canvas>");



    outerCircleRadius = 150;
    outerCircleX = $("svg").width()/2;
    outerCircleY = $("svg").height()/2;

    innerCircleRadius = ui.innerCircleRadius.value;
    innerCircleX = outerCircleX + outerCircleRadius - innerCircleRadius;
    innerCircleY = outerCircleY// + outerCircleRadius - innerCircleRadius;

    // innerCirclePointRadius = 5;
    // innerCirclePointX = innerCircleX;
    // innerCirclePointY = innerCircleY// + outerCircleRadius - innerCircleRadius;

    markerRadius = 3;
    markerX = outerCircleX + outerCircleRadius //- innerCircleRadius;
    markerY = outerCircleY// + outerCircleRadius - innerCircleRadius;

    outerCircle = new Circle(outerCircleX,outerCircleY,outerCircleRadius,"black", "none");
    innerCircle = new Circle(innerCircleX,innerCircleY,innerCircleRadius,"black", "none");
    innerCirclePoint = new Circle(innerCircleX,innerCircleY,3,"black", "black");
    marker = new Circle(markerX,markerY,markerRadius,"red", "red");

    bar = new Line(innerCircleX, innerCircleY, innerCircleX+innerCircleRadius, innerCircleY, "black");

    innerCircle.init("inner-circle", $("#inner-wrapper"));
    innerCirclePoint.init("inner-circle-point", $("#inner-wrapper"));
    marker.init("marker", $("#bar-wrapper"));
    bar.init("bar", $("#bar-wrapper"));
    outerCircle.init("outer-circle", $("#wrapper"));


    canvas = document.getElementById('c');
    canvas.height = $("#demo").height();
    canvas.width = $("#demo").width();
    //could potentially help with anti-aliasing
    // $("#c").width(canvas.width + 1);
    // $("#c").height(canvas.height + 1);
    context = canvas.getContext('2d');
    context.lineWidth = 1;
    context.lineCap = "round";


    var demoOffest = $("#demo").offset();
    var markerOffset = $("#marker").offset();

    markerLeft = markerOffset.left - demoOffest.left;
    markerTop = markerOffset.top - demoOffest.top;

    lastPoint = {x:markerLeft +3, y:markerTop + 3};

    context.beginPath();
    context.strokeStyle = "#ff0000";




    context.moveTo(markerLeft+3, markerTop+3);
    context.fillStyle = "red";

    context.globalCompositeOperation = "lighter";
    // context.globalCompositeOperation = "destination-over";

    // context.shadowBlur = 0.5;
    // context.shadowColor = 'rgb(0, 0, 0)';
    // context.lineTo(450, 50);
    // context.stroke();

    // $("inner-wrapper")

    $("#clearTrace-interface").click(function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
    })

});