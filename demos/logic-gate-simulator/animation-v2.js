
ui = null;
endpointHoverStyle = {fillStyle:"#5C96BC"}
var connectorPaintStyle = {
  lineWidth:4,
  strokeStyle:"#deea18",
  joinstyle:"round",
  outlineColor:"#eaedef",
  outlineWidth:2
}
// .. and this is the hover style.
connectorHoverStyle = {
  lineWidth:4,
  strokeStyle:"#5C96BC",
  outlineWidth:2,
  outlineColor:"white"
}

sourceEndpoint = {
  endpoint:"Dot",
  paintStyle:{
    strokeStyle:"#1e8151",
    fillStyle:"transparent",
    radius:7,
    lineWidth:2
  },
  isSource:true,
  connector:[ "Flowchart", { stub:[40, 60], gap:10, cornerRadius:5, alwaysRespectStubs:true } ],
  connectorStyle:connectorPaintStyle,
  hoverPaintStyle:endpointHoverStyle,
  connectorHoverStyle:connectorHoverStyle,
  dragOptions:{},
  maxConnections:-1,


};

targetEndpoint = {
  endpoint:"Dot",
  paintStyle:{ fillStyle:"#1e8151",radius:11 },
  hoverPaintStyle:endpointHoverStyle,
  maxConnections:-1,
  dropOptions:{ hoverClass:"hover", activeClass:"active" },
  isTarget:true,

};

var _addEndpoints = function(toId, sourceAnchors, targetAnchors) {
  if (sourceAnchors){
  for (var i = 0; i < sourceAnchors.length; i++) {
    var sourceUUID = toId + sourceAnchors[i];
    jsPlumb.addEndpoint(toId, sourceEndpoint, { anchor:sourceAnchors[i], uuid:sourceUUID });
  }
}

  if (targetAnchors){
  for (var j = 0; j < targetAnchors.length; j++) {
    var targetUUID = toId + targetAnchors[j];
    jsPlumb.addEndpoint(toId, targetEndpoint, { anchor:targetAnchors[j], uuid:targetUUID });
  }
}
        };


        jsPlumb.ready(function(){

          // _addEndpoints("window4", ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);
          // _addEndpoints("window2", ["TopCenter", "RightMiddle"], [[0.2, 0.25, -1, 0], "BottomLeft"]);
          _addEndpoints("AND", ["RightMiddle"], [[0.2, 0.25, -1, 0], [0.2, 0.75, -1, 0]]);
          _addEndpoints("OR", ["RightMiddle"], [[0.2, 0.25, -1, 0], [0.2, 0.75, -1, 0]]);
          _addEndpoints("OUT", null, ["LeftMiddle"]);
          _addEndpoints("INPUT1", ["RightMiddle"]);
          _addEndpoints("INPUT2", ["RightMiddle"]);

          jsPlumb.draggable(jsPlumb.getSelector(".window"));

        })

console.log()

jsPlumb.bind("connection", update);

function update(){
  var andCons = jsPlumb.getConnections({
        target:"AND"
  });

  var orCons = jsPlumb.getConnections({
        target:"OR"
  });

  inputsAND = [];

  for (i=0,len = andCons.length ; i < len ; i++ ){
    // inputs[i] = andCons[i].sourceId;
    inputsAND[i] = $("#"+andCons[i].sourceId).hasClass("on");
  }

  if (inputsAND[0] && inputsAND[1]){
    $("#AND").data("state", 'on');
  } else {
    $("#AND").data("state", "off");
  }

  inputsOR = [];

  for (i=0,len = orCons.length ; i < len ; i++ ){
    // inputs[i] = andCons[i].sourceId;
    inputsOR[i] = $("#"+orCons[i].sourceId).hasClass("on");
  }

  if (inputsOR[0] || inputsOR[1]){
    $("#OR").data("state", 'on');
  } else {
    $("#OR").data("state", "off");
  }

  if ($("#AND").data("state") == "on"){
    $("#OUT").addClass("on")
  } else {
    $("#OUT").removeClass("on")
  }

  if ($("#OR").data("state") == "on"){
    $("#OUT").addClass("on")
  } else {
    $("#OUT").removeClass("on")
  }

}


// console.log(and);

$(".switch button").click(function(){
  $(this).parent().toggleClass("on");
  update();
})
