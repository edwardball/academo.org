var ui = {
	newNode: {
        //This creates a dropdown selection
        title: "",
        value: "Input",
        values: [
			["INPUT", "Input"],
			["NOT","Not"],
			["AND","And"],
			["NAND","Nand"],
			["OR","Or"],
			["NOR","Nor"],
			["XOR","Xor"]
		] //the first value in each pair is the label, the second is the value
    },
    addNode:{
        //This creates a button that doesn't need an intrinsic value
        title: "Add node",
        type: "button"
    }
};

nodes = {};
index = 0;


function And(id){
	this.id = "and-" + id;
	this.state = 0;
	this.inputs = [];

	$("#demo").append('<div class="window" id="'+this.id+'"><span class="close">&times;</span><img alt="AND gate" src="symbols/and.svg"/></div>');

	_addEndpoints(this.id, ["RightMiddle"], [[0, 0.25, -1, 0], [0, 0.75, -1, 0]]);
	jsPlumb.draggable(jsPlumb.getSelector(".window"), {containment: 'parent'});

	this.getInputs = function(){
		this.inputs = jsPlumb.getConnections({
			target:this.id
		});
	}

	this.updateState = function(){
		inputsAND = [];
		for (i=0,len = this.inputs.length ; i < len ; i++ ){
			inputsAND[i] = $("#"+this.inputs[i].sourceId).data("state") == "on" ? 1 : 0;
		}


		if (inputsAND[0] && inputsAND[1]){
			this.state = 1;
			$("#"+this.id).data('state', "on");
		} else {
			this.state = 0;
			$("#"+this.id).data('state', "off");
		}

	}

	this.update = function(){
		this.getInputs();
		this.updateState();
	}

}

function Nand(id){
	this.id = "nand-" + id;
	this.state = 0;
	this.inputs = [];

	$("#demo").append('<div class="window" id="'+this.id+'"><span class="close">&times;</span><img alt="NAND gate" src="symbols/nand.svg"/></div>');

	_addEndpoints(this.id, ["RightMiddle"], [[0, 0.25, -1, 0], [0, 0.75, -1, 0]]);
	jsPlumb.draggable(jsPlumb.getSelector(".window"), {containment: 'parent'});

	this.getInputs = function(){
		this.inputs = jsPlumb.getConnections({
			target:this.id
		});
	}

	this.updateState = function(){
		inputsNAND = [];
		for (i=0,len = this.inputs.length ; i < len ; i++ ){
			inputsNAND[i] = $("#"+this.inputs[i].sourceId).data("state") == "on" ? 1 : 0;
		}


		if (this.inputs.length == 2 && inputsNAND[0] && inputsNAND[1]){
			this.state = 0;
			$("#"+this.id).data('state', "off");
		} else {
			this.state = 1;
			$("#"+this.id).data('state', "on");
		}

	}

	this.update = function(){
		this.getInputs();
		this.updateState();
	}

}


function Or(id){
	this.id = "or-" + id;
	this.state = 0;
	this.inputs = [];

	$("#demo").append('<div class="window" id="'+this.id+'"><button class="close">&times;</button><img alt="OR gate" src="symbols/or.svg"/></div>');

	_addEndpoints(this.id, ["RightMiddle"], [[0, 0.25, -1, 0], [0, 0.75, -1, 0]]);
	jsPlumb.draggable(jsPlumb.getSelector(".window"), {containment: 'parent'});

	this.getInputs = function(){
		this.inputs = jsPlumb.getConnections({
			target:this.id
		});
	}

	this.updateState = function(){
		var inputsOR = [];
		for (i=0,len = this.inputs.length ; i < len ; i++ ){
			inputsOR[i] = $("#"+this.inputs[i].sourceId).data("state") == "on" ? 1 : 0;
		}


		if (inputsOR[0] || inputsOR[1]){
			this.state = 1;
			$("#"+this.id).data('state', "on");
		} else {
			this.state = 0;
			$("#"+this.id).data('state', "off");
		}

	}

	this.update = function(){
		this.getInputs();
		this.updateState();
	}
}

function Nor(id){
	this.id = "nor-" + id;
	this.state = 0;
	this.inputs = [];

	$("#demo").append('<div class="window" id="'+this.id+'"><button class="close">&times;</button><img alt="NOR gate" src="symbols/nor.svg"/></div>');

	_addEndpoints(this.id, ["RightMiddle"], [[0, 0.25, -1, 0], [0, 0.75, -1, 0]]);
	jsPlumb.draggable(jsPlumb.getSelector(".window"), {containment: 'parent'});

	this.getInputs = function(){
		this.inputs = jsPlumb.getConnections({
			target:this.id
		});
	}

	this.updateState = function(){
		var inputsNOR = [];
		for (i=0,len = this.inputs.length ; i < len ; i++ ){
			inputsNOR[i] = $("#"+this.inputs[i].sourceId).data("state") == "on" ? 1 : 0;
		}


		if (inputsNOR[0] || inputsNOR[1]){
			this.state = 0;
			$("#"+this.id).data('state', "off");
		} else {
			this.state = 1;
			$("#"+this.id).data('state', "on");
		}

	}

	this.update = function(){
		this.getInputs();
		this.updateState();
	}
}

function Xor(id){
	this.id = "xor-" + id;
	this.state = 0;
	this.inputs = [];

	// <strong>XOR</strong><br />
	$("#demo").append('<div class="window xor" id="'+this.id+'"><button class="close">&times;</button><img alt="XOR gate" src="symbols/xor.svg"/></div>');

	_addEndpoints(this.id, ["RightMiddle"], [[0, 0.25, -1, 0], [0, 0.75, -1, 0]]);
	jsPlumb.draggable(jsPlumb.getSelector(".window"), {containment: 'parent'});

	this.getInputs = function(){
		this.inputs = jsPlumb.getConnections({
			target:this.id
		});
	}

	this.updateState = function(){
		var inputsXOR = [];
		for (i=0,len = this.inputs.length ; i < len ; i++ ){
			inputsXOR[i] = $("#"+this.inputs[i].sourceId).data("state") == "on" ? 1 : 0;
		}


		if ((inputsXOR[0] || inputsXOR[1]) && inputsXOR[0] + inputsXOR[1] < 2){
			this.state = 1;
			$("#"+this.id).data('state', "on");
		} else {
			this.state = 0;
			$("#"+this.id).data('state', "off");
		}

	}

	this.update = function(){
		this.getInputs();
		this.updateState();
	}
}

function Not(id){
	this.id = "not-" + id;
	this.state = 0;
	this.inputs = [];

	$("#demo").append('<div class="window" id="'+this.id+'" title="NOT"><button class="close">&times;</button><img alt="NOT gate" src="symbols/not.svg" /></div>');

	_addEndpoints(this.id, ["RightMiddle"], ["LeftMiddle"]);
	jsPlumb.draggable(jsPlumb.getSelector(".window"), {containment: 'parent'});

	this.getInputs = function(){
		this.inputs = jsPlumb.getConnections({
			target:this.id
		});
	}

	this.updateState = function(){
		var inputsNOT = [];
		for (i=0,len = this.inputs.length ; i < len ; i++ ){
			inputsNOT[i] = $("#"+this.inputs[i].sourceId).data("state") == "on" ? 1 : 0;
		}


		if (inputsNOT[0]){
			this.state = 0;
			$("#"+this.id).data('state', "off");
		} else {
			this.state = 1;
			$("#"+this.id).data('state', "on");
		}

	}

	this.update = function(){
		this.getInputs();
		this.updateState();
	}
}

function Input(id){
	this.id = "input-" + id;
	this.state = 0;
	var _this = this;

	$("#demo").append('<div class="window switch" id="'+this.id+'"><button class="close">&times;</button><button class="toggle">On/Off</button></div>');

	_addEndpoints(this.id, ["RightMiddle"]);
	jsPlumb.draggable(jsPlumb.getSelector(".window"), {containment: 'parent'});


	this.toggle = function(){


		$("#"+this.id).toggleClass("on");
		if ($("#"+this.id).data('state') == "on"){
			$("#"+this.id).data('state', "off")
			this.state = 0;
		} else {
			$("#"+this.id).data('state', "on");
			this.state = 1;

		}
		update();
	};

	(function(selector){
		$(selector + " button.toggle").click(function(){
			_this.toggle();
			update();
		});
		console.log("Click handler set up for ", "#"+_this.id)
	})("#"+_this.id);

}

function Output(id){
	this.id = "output-" + id;
	this.state = 0;
	var _this = this;

	$("#demo").append('<div class="window" id="'+this.id+'"><b>OUTPUT</b></div>');

	_addEndpoints(this.id, null, ["LeftMiddle"]);
	jsPlumb.draggable(jsPlumb.getSelector(".window"), {containment: 'parent'});


	this.update = function(){

		outputCons = jsPlumb.getConnections({
			target:this.id
		});

		if (outputCons.length){
			if ($("#"+outputCons[0].sourceId).data("state") == "on"){
				$("#"+this.id).addClass("on")
			} else {
				$("#"+this.id).removeClass("on")
			}
		} else {
		    //nothing is connected so switch off
		    $("#"+this.id).removeClass("on")
		}
	}

}


endpointHoverStyle = {fillStyle:"#5C96BC"}

var connectorPaintStyle = {
	lineWidth:3,
	strokeStyle:"#2c3e50",
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
		strokeStyle:"#1abc9c",
		fillStyle:"transparent",
		radius:7,
		lineWidth:2
	},
	isSource:true,
	connector:[ "Flowchart", { stub:[40, 60], gap:0, cornerRadius:5, alwaysRespectStubs:true } ],
	connectorStyle:connectorPaintStyle,
	hoverPaintStyle:endpointHoverStyle,
	connectorHoverStyle:connectorHoverStyle,
	dragOptions:{},
	maxConnections:-1,
};

targetEndpoint = {
	endpoint:"Dot",
	paintStyle:{ fillStyle:"#1abc9c",radius:7 },
	hoverPaintStyle:endpointHoverStyle,
	// maxConnections:-1,
	maxConnections:1,
	dropOptions:{ hoverClass:"hover", activeClass:"active" },
	isTarget:true,

};

function _addEndpoints(toId, sourceAnchors, targetAnchors) {
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
	nodes["output-" + index] = new window["Output"](index++);
	nodes["input-" + index] = new window["Input"](index++);
	jsPlumb.draggable(jsPlumb.getSelector(".window"), {containment: 'parent'});
})


function update(e){

	if (e == 'addNode'){
		nodes[ui.newNode.value.toLowerCase() + "-" + index] = new window[ui.newNode.value](index++);
	}

	calcOutput();
	jsPlumb.repaintEverything();

}


//calculates final output
function calcOutput(){

	tiers = [];

	parentNodes = [{sourceId: "output-0"}];

	childNodesCount = 1;
	iterations = 0;
	while (childNodesCount > 0){

		tiers.push(parentNodes);
		childNodes = [];

		for (var i = 0; i < parentNodes.length ; i++){
			section = jsPlumb.getConnections({
				target:parentNodes[i].sourceId
			});

			for (var j = 0 ; j < section.length; j++){
				childNodes.push(section[j])
			}
		}

		childNodesCount = childNodes.length;
		parentNodes = childNodes;
		iterations++;
		if (iterations > 100){
			alert("Whoops! It looks like there is an infinite loop in this set up. Please remove it and try again.");
			break;
		}

	}

	for (var i = tiers.length-1; i >= 0 ; i--){
		currentTier = tiers[i];
		for (var k = 0 ; k < currentTier.length ; k++){
			currentNodeID = currentTier[k].sourceId;
			currentNode = nodes[currentNodeID]
			if (typeof currentNode.update === "function") { 
			    currentNode.update();
			}
		}
	}

}


jsPlumb.bind("connection", update);


jsPlumb.bind("connectionDetached", function(conn, originalEvent) {
	update();
});

//delete on rightclick
jsPlumb.bind("contextmenu", function(conn, originalEvent) {
	originalEvent.preventDefault();
	jsPlumb.detach(conn);
	update();
	calcOutput();
});

$("#demo").on("click", ".close", function(){
	var id = $(this).parent().attr("id");
	jsPlumb.removeAllEndpoints(id);
	$("#"+id).remove();
})

$(window).resize(function(){
	jsPlumb.repaintEverything();
})