ui = {
  length1: {
      title: "Pendulum 1 Length",
      value: 100,
      units: "pixels",
      range:[50,500],
      resolution:1,
      color: "lightblue"
    },
    length2: {
        title: "Pendulum 2 Length",
        value: 400,
        units: "pixels",
        range:[50,500],
        resolution:1,
        color: "lightgreen"
      },
  start:{
      title: "Start",
      type: "button"
  },
  reset:{
      title: "Reset",
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


function Line(x1, y1, x2, y2){
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
}

Line.prototype.draw = function(context){
  context.beginPath();
  context.moveTo(this.x1,this.y1);
  context.lineTo(this.x2,this.y2);
  context.closePath();
  context.strokeWidth = 0.5;
  context.strokeStyle = "#AAA";
  context.stroke();
}


var g = 9.8;
var theta1 = 0.2;
var theta2 = 0.2;
var theta1Vel = 0;
var theta2Vel = 0;


var radius = 6;
var pivot1 = new Ball(1, "black");
var pivot2 = new Ball(1, "black");
var ball1 = new Ball(radius, "lightblue");
var ball2 = new Ball(radius, "lightgreen");
var line1 = new Line();
var line2 = new Line();


function drawFrame(){
  // console.log("hello");
  animationID = window.requestAnimationFrame(drawFrame);
  context.clearRect(0,0,canvas.width, canvas.height);

  theta1Acc = - g * theta1 * 0.1 / ui.length1.value;
  theta1Vel += theta1Acc;
  theta1 += theta1Vel;

  theta2Acc = - g * theta2 * 0.1 / ui.length2.value;
  theta2Vel += theta2Acc;
  theta2 += theta2Vel;

  ball1.x = (canvas.width / 2) - ui.length1.value * Math.sin(theta1);
  ball2.x = (canvas.width / 2) - ui.length2.value * Math.sin(theta2);
  ball1.y = ui.length1.value*Math.cos(theta1);
  ball2.y = ui.length2.value*Math.cos(theta2);

   pivot1.x = canvas.width /2;
   pivot1.y = 0;
   pivot1.draw(context);

   pivot2.x = canvas.width/2;
   pivot2.y = 0;
   pivot2.draw(context);

   line1.x1 = ball1.x;
   line1.y1 = ball1.y;
   line1.x2 = pivot1.x;
   line1.y2 = pivot1.y;
   line1.draw(context);

   line2.x1 = ball2.x;
   line2.y1 = ball2.y;
   line2.x2 = pivot2.x;
   line2.y2 = pivot2.y;
   line2.draw(context);


   ball1.draw(context);
   ball2.draw(context);

};

function update(e){
  // v1 = ui.v1.value;
  // v2 = ui.v2.value;

  if (e == "reset"){
    cancelAnimationFrame(animationID);
    // context.clearRect(0,0,canvas.width, canvas.height);
    theta1 = 0.2;
    theta2 = 0.2;
    theta1Vel = 0;
    theta2Vel = 0;

    // render();
    // ball1.x = canvas.width / 4;
    // ball2.x = canvas.width - ball1.x;
    // context.clearRect(0,0,canvas.width, canvas.height);
    // ball1.draw(context);
    // ball2.draw(context);

    $("#length1-interface, #length1-interface input").attr("disabled", false);
    $("#length2-interface, #length2-interface input").attr("disabled", false);
    $("#start-interface button").attr("disabled", false);
  } else if (e == "start"){
    drawFrame();
   $("#length1-interface, #length1-interface input").attr("disabled", true);
   $("#length2-interface, #length2-interface input").attr("disabled", true);
   $("#start-interface button").attr("disabled", true);
  }

  render();

}

function render(){
  context.clearRect(0,0,canvas.width, canvas.height);

  ball1.x = (canvas.width / 2) - ui.length1.value * Math.sin(theta1);
  ball1.y = ui.length1.value*Math.cos(theta1);

  ball2.x = (canvas.width / 2) - ui.length2.value * Math.sin(theta2);
  ball2.y = ui.length2.value*Math.cos(theta2);

  pivot1.x = canvas.width / 2;
  pivot1.y = 0;
  pivot1.draw(context);

  pivot2.x = canvas.width / 2;
  pivot2.y = 0;
  pivot2.draw(context);

  line1.x1 = ball1.x;
  line1.y1 = ball1.y;
  line1.x2 = pivot1.x;
  line1.y2 = pivot1.y;
  line1.draw(context);

  line2.x1 = ball2.x;
  line2.y1 = ball2.y;
  line2.x2 = pivot2.x;
  line2.y2 = pivot2.y;
  line2.draw(context);


  ball1.draw(context);
  ball2.draw(context);
}

$(document).on("uiLoaded", function(){
  $("#demo").append("<canvas id='c'></canvas>");
  canvas = document.getElementById('c');
  canvas.width = $("#demo").width();
  canvas.height = $("#demo").width() * 2/3;
  context = canvas.getContext('2d');


  render();





});