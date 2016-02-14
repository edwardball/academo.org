var ui = {
    a: {
        title: "|<span contentEditable>A</span>|",
        className: "venn_set",
        value: 50,
        range:[0,100],
        resolution:1
    },
    b: {
        title: "|<span contentEditable>B</span>|",
        className: "venn_set",
        value: 50,
        range:[0,100],
        resolution:1
    },
    c: {
        title: "|<span contentEditable>C</span>|",
        className: "venn_set",
        value: 50,
        range:[0,100],
        resolution:1
    },
    a_b: {
        title: "|<span>A</span> &#8745 <span>B</span>|",
        className: "venn_area",
        value: 10,
        range:[0,100],
        resolution:1
    },
    a_c: {
        title: "|<span>A</span> &#8745 <span>C</span>|",
        className: "venn_area",
        value: 10,
        range:[0,100],
        resolution:1
    },
    b_c: {
        title: "|<span>B</span> &#8745 <span>C</span>|",
        className: "venn_area",
        value: 10,
        range:[0,100],
        resolution:1
    }
}

var setIDs = ["0,1","0,2","1,2"];

function getSetIntersections() {
    areas = d3.selectAll(".venn_area input")[0].map(
        function (element, i) {
            return {
                // sets: element.id.split(",").map(
                sets: setIDs[i].split(",").map(
                    function(value) {
                        return parseInt(value);
                    }),
                size: parseFloat(element.value)
            };
    });
    return areas;
}

function getSets() {
    var sets=[{"label": "A"}, {"label":"B"}, {"label": "C"}], areas = [];

    d3.selectAll(".venn_set input")[0].map(
        function(element, i) {
            sets[i].size = parseFloat(element.value);
        });
    return sets;
}

var canvas;

$(document).on("uiLoaded", function(){
    // var w = Math.min(450, document.documentElement.clientWidth-30), h = 2*w/3;
    var w = $("#demo").width(), h = 2*w/3;

    // draw the initial set
    var sets = venn.venn(getSets(), getSetIntersections());
    venn.drawD3Diagram(d3.select("#demo"), sets, w, h);

    //For saving as a png
    $('#demo').append("<canvas id='canvas' style='display:none;'></canvas>");
    $('#demo').append("<a href='#' id='save' download='venn-diagram.png'>Save as image</a>");


    canvas = document.getElementById("canvas");
    canvas.height = h;
    canvas.width = w;
    context = canvas.getContext("2d");
    context.fillStyle = "rgb(0, 0, 0)";
    context.fillRect(0,0,w,h);

    update();


    $("label span").keyup(
        function(e){
            updateLabel($(this).index("label span"), $(this).html());
            update();
            if (e.which == 13){
                $(this).blur();
            }
        });

});

function update(){
    var sets = venn.venn(getSets(), getSetIntersections());
    venn.updateD3Diagram(d3.select("#demo"), sets);
    canvg(canvas, $("svg")[0].outerHTML);
    $("#save").prop("href", canvas.toDataURL("image/png"));
}



function updateLabel(index, content){
    $("svg text").eq(index).html(content);

    if (index == 0){
        $(".venn_area label span").eq(0).html(content).end().eq(2).html(content);
    }
    if (index == 1){
        $(".venn_area label span").eq(1).html(content).end().eq(4).html(content);
    }
    if (index == 2){
        $(".venn_area label span").eq(3).html(content).end().eq(5).html(content);
    }
}



