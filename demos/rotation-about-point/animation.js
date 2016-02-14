ui = {
    angle: {
        title: "Angle of rotation",
        value: 30,
        range: [0,359],
        resolution: 1,
        units: "degrees"
    }
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

var originCoords, markerCoords, rotatedMarkerCoords;


function update(e){

    markerCoords.x = parseInt($("#marker").attr("cx"));
    markerCoords.y = parseInt($("#marker").attr("cy"));
    originCoords.x = parseInt($("#origin").attr("cx"));
    originCoords.y = parseInt($("#origin").attr("cy"));
    // fixedOriginCoords.x = parseInt($("#fixed-origin").attr("cx"));
    // fixedOriginCoords.y = parseInt($("#fixed-origin").attr("cy"));
    rotatedMarkerCoords = rotate(ui.angle.value * Math.PI / 180, originCoords, markerCoords);
    $("#rotated").attr("cx", rotatedMarkerCoords.x).attr("cy", rotatedMarkerCoords.y);
    $("#path").attr("d", "M" + markerCoords.x + "," + markerCoords.y + " L" + originCoords.x + "," + originCoords.y + " L" + rotatedMarkerCoords.x + "," + rotatedMarkerCoords.y);

    OM = angleBetween(originCoords, markerCoords);
    OR = angleBetween(originCoords, rotatedMarkerCoords);

    arcStart = {};
    arcEnd = {};

    arcStart.x = (originCoords.x) + 20 * Math.cos(OM);
    arcStart.y = (originCoords.y) + 20 * Math.sin(OM);

    arcEnd.x = (originCoords.x) + 20 * Math.cos(OR);
    arcEnd.y = (originCoords.y) + 20 * Math.sin(OR);

    if (ui.angle.value > 180){
        largeArc = 1;
    } else {
        largeArc = 0;
    }

    $("#arc").attr("d", "M"+ arcStart.x + "," + arcStart.y + "A 20 20 0 "+largeArc+" 0 " + arcEnd.x + "," + arcEnd.y  + " L" + originCoords.x + "," + originCoords.y + " Z");

    // $("#translated-marker").attr("transform", "translate("+ (fixedOriginCoords.x - originCoords.x) +" "+ (fixedOriginCoords.y - originCoords.y) +")");


}

function distanceBetween(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}
function angleBetween(point1, point2) {
  return Math.atan2( point2.y - point1.y, point2.x - point1.x);
}


function rotate(angle, origin, coords){
    //convention
    angle *= -1;

    x = (coords.x - origin.x) * Math.cos(angle) - (coords.y - origin.y) * Math.sin(angle);
    y = (coords.x - origin.x) * Math.sin(angle) + (coords.y - origin.y) * Math.cos(angle);
    return {"x":parseInt(x + origin.x*1), "y":parseInt(y+origin.y*1)}
}



var markerCoords;
var isMouseDown = false;
var largeArc;
var fixedOriginCoords = {};



$(document).on("uiLoaded", function(){


    $("#demo").append("<svg width='100%' height='400px'></svg>");
    svg = new SVG();
    path = document.createElementNS(svg.namespace,"path");
    path.setAttribute("id", "path");
    path.setAttribute("stroke-width", 0.5);
    path.setAttribute("stroke", "gray");
    path.setAttribute("stroke-dasharray", "4 4");
    path.setAttribute("fill", "none");
    $("svg").append(path);

    arc = document.createElementNS(svg.namespace,"path");
    arc.setAttribute("id", "arc");
    arc.setAttribute("stroke-width", 0.5);
    arc.setAttribute("stroke", "gray");
    arc.setAttribute("fill", "rgba(255,0,0,0.25)");
    $("svg").append(arc);

    originCoords = {x:$("#demo").width()/2, y:$("#demo").height()/2};

    // fixedOrigin = new Circle(originCoords.x, originCoords.y, 2,"black", "black");
    // fixedOrigin.init("fixed-origin", $("svg"));

    origin = new Circle(originCoords.x, originCoords.y, 2,"black", "black");
    origin.init("origin", $("svg"));


    markerCoords = {x:$("#demo").width()/2 + 100, y:$("#demo").height()/2};

    // translatedMarker = new Circle(markerCoords.x, markerCoords.y,5,"none", "red");
    // translatedMarker.init("translated-marker", $("svg"));

    marker = new Circle(markerCoords.x, markerCoords.y,5,"none", "red");
    marker.init("marker", $("svg"));


    rotatedMarkerCoords = rotate(ui.angle.value * Math.PI / 180, originCoords, markerCoords);

    rotatedMarker = new Circle(rotatedMarkerCoords.x, rotatedMarkerCoords.y,5,"none", "rgba(255,0,0,0.25)");
    rotatedMarker.init("rotated", $("svg"));


    update();


//should really be svg.element, but firefox can't cope with that
mouse = utils.captureMouse(document.getElementById("demo"));

$("#marker, #origin").mousedown(function (e) {
    $this = $(this);
    e.preventDefault();
    // console.log(mouse);
        // if (utils.containsPoint(ball.getBounds(), mouse.x, mouse.y)) {
          isMouseDown = true;
          $(this).mouseup(function(){
            isMouseDown = false;
            $(this).off("mouseup");
            $(document).off("mousemove");
          });
          $(document).mousemove(function(){
            if (isMouseDown == true){
                update();
                $this.attr("cx", parseInt(mouse.x));
                $this.attr("cy", parseInt(mouse.y));
            }
          });
        //   // svg.element.addEventListener('mouseup', onMouseUp, false);
        //   // svg.element.addEventListener('mousemove', onMouseMove, false);
        // }
      });

$("#marker").dblclick(function(){
    isMouseDown = false;
})



});
