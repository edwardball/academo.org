ui = {
  m1: {
      title: "Ball 1 Mass",
      value: 0.5,
      units: "Kg",
      range:[0.1,1],
      resolution:0.01,
      color: "lightblue"
    },
  v1: {
      title: "Ball 1 Initial Velocity",
      value: 1,
      units: "m/s",
      range:[-5,5],
      resolution:0.01,
      color: "lightblue"
    },
  m2: {
      title: "Ball 2 Mass",
      value: 0.5,
      units: "Kg",
      range:[0.1,1],
      resolution:0.01,
      color: "lightgreen"
    },
  v2: {
      title: "Ball 2 Initial Velocity",
      value: -1,
      units: "m/s",
      range:[-5,5],
      resolution:0.01,
      color: "lightgreen"
    },
  start:{
      title: "Start",
      type: "button"
  },
  reset:{
      title: "Reset ball positions",
      type: "button"
  }
};

function Ball (radius, color) {
  if (radius === undefined) { radius = 40; }
  if (color === undefined) { color = "#ff0000"; }
  this.x = 0;
  this.y = 0;
  this.radius = radius;
  this.vx = 0;
  this.vy = 0;
  this.mass = 1;
  this.rotation = 0;
  this.scaleX = 1;
  this.scaleY = 1;
  // this.color = utils.parseColor(color);
  this.color = color;
  this.lineWidth = 0;
}

Ball.prototype.draw = function (context) {
  context.save();
  context.translate(this.x, this.y);
  context.rotate(this.rotation);
  context.scale(this.scaleX, this.scaleY);

  context.lineWidth = this.lineWidth;
  context.fillStyle = this.color;
  context.beginPath();
  //x, y, radius, start_angle, end_angle, anti-clockwise
  context.arc(0, 0, this.radius, 0, (Math.PI * 2), true);
  context.closePath();
  context.fill();
  if (this.lineWidth > 0) {
    context.stroke();
  }
  context.restore();
};

Ball.prototype.getBounds = function () {
  return {
    x: this.x - this.radius,
    y: this.y - this.radius,
    width: this.radius * 2,
    height: this.radius * 2
  };
};

function update(e){
  v1 = ui.v1.value;
  v2 = ui.v2.value;
  if (e == "reset"){
    cancelAnimationFrame(animationID);
    ball1.x = canvas.width / 4;
    ball2.x = canvas.width - ball1.x;
    context.clearRect(0,0,canvas.width, canvas.height);
    ball1.draw(context);
    ball2.draw(context);

    $("#m1-interface").removeClass("disabled").attr("disabled", false);$("#m1-interface input").attr("disabled", false);
    $("#m2-interface").removeClass("disabled").attr("disabled", false);$("#m2-interface input").attr("disabled", false);
    $("#v1-interface").removeClass("disabled").attr("disabled", false);$("#v1-interface input").attr("disabled", false);
    $("#v2-interface").removeClass("disabled").attr("disabled", false);$("#v2-interface input").attr("disabled", false);
    $("#start-interface button").attr("disabled", false);
  } else if (e == "start"){
    drawFrame();
   $("#m1-interface").addClass("disabled").attr("disabled", true);$("#m1-interface input").attr("disabled", true);
   $("#m2-interface").addClass("disabled").attr("disabled", true);$("#m2-interface input").attr("disabled", true);
   $("#v1-interface").addClass("disabled").attr("disabled", true);$("#v1-interface input").attr("disabled", true);
   $("#v2-interface").addClass("disabled").attr("disabled", true);$("#v2-interface input").attr("disabled", true);
   $("#start-interface button").attr("disabled", true);
  }
}

var animationID;
v1 = ui.v1.value;
v2 = ui.v2.value;

function drawFrame(){
  // console.log("hello");
  animationID = window.requestAnimationFrame(drawFrame);
  context.clearRect(0,0,canvas.width, canvas.height);

  ball1.x += v1;
  ball2.x += v2;
  var dist = ball2.x - ball1.x;

  if (Math.abs(dist) < ball1.radius + ball2.radius){//collision!
    var v1f = (2 * ui.m2.value * ui.v2.value + ui.v1.value * (ui.m1.value - ui.m2.value))/(ui.m1.value + ui.m2.value);
    var v2f = (2 * ui.m1.value * ui.v1.value + ui.v2.value * (ui.m2.value - ui.m1.value))/(ui.m1.value + ui.m2.value);

    v1 = parseFloat(v1f);
    v2 = parseFloat(v2f);

    ball1.x += v1;
    ball2.x += v2;
  }

  ball1.draw(context);
  ball2.draw(context);

};


var ball1 = new Ball(radius, "lightblue");
var ball2 = new Ball(radius, "lightgreen");
var radius = 25;

$(document).on("uiLoaded", function(){
  $("#demo").append("<canvas id='c'></canvas>");
  canvas = document.getElementById('c');
  canvas.width = $("#demo").width();
  canvas.height = $("#demo").width() * 2/3;
  context = canvas.getContext('2d');




  ball1.x = canvas.width / 4;
  ball2.x = canvas.width - ball1.x;
  ball1.y = ball2.y = canvas.height / 2;
  ball1.draw(context);
  ball2.draw(context);


});