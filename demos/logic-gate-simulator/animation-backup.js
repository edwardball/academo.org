
ui = null;

var endpointOptions = {
isSource:true,
isTarget:true,
  endpoint: [ "Dot", { radius:30 } ],
  style:{fillStyle:'blue'},
  connector : "Straight",
  connectorStyle: { lineWidth:20, strokeStyle:'blue' },
  scope:"blueline",
  dropOptions:{
    drop:function(e, ui) {
      alert('drop!');
    }
  }
};

jsPlumb.Defaults.Connector = "Flowchart";

jsPlumb.ready(function() {

  var i = 0;

  $('#container').dblclick(function(e) {
    var newState = $('<div>').attr('id', 'state' + i).addClass('item');

    var title = $('<div>').addClass('title').text('State ' + i);
    var connectIn1 = $('<div>').addClass('connectIn1');
    var connectIn2 = $('<div>').addClass('connectIn2');
    var connectOut = $('<div>').addClass('connectOut');

    newState.css({
      'top': e.pageY,
      'left': e.pageX
    });

    jsPlumb.makeTarget(connectIn1, endpointOptions);

    // jsPlumb.addEndpoint(connectIn1, {
    //   // parent: newState,
    //   anchor: 'Continuous',
    //   isTarget: true
    // });

    // jsPlumb.addEndpoint(connectOut, {
    //   // parent: newState,
    //   anchor: 'Right',
    //   isSource: true
    // });

    newState.append(title);
    newState.append(connectIn1);
    newState.append(connectIn2);
    newState.append(connectOut);

    $('#container').append(newState);


jsPlumb.draggable(newState, {
  containment: 'parent'
});

newState.dblclick(function(e) {
  jsPlumb.detachAllConnections($(this));
  $(this).remove();
  e.stopPropagation();
});

    i++;
  });
});