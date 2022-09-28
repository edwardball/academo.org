function trackError(message, file, line){
	// console.log(message, line, file);
}

//doesn't work with addEventListener! The event passed to the function is NOT the error,
// so it does not contain e.message, e.filename etc in Firefox
// window.addEventListener('error', function(e){
		// trackJavaScriptError(e)
	// }, false);

window.onerror = function(message, file, line){
	// trackError(message, line, file);
	ga('send', 'event', 'JavaScript Error', message, file + ": Line "+ line, { 'nonInteraction': 1 });
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


$(document).ready(function(){
	if ($("#demo").length){
		$.getJSON("/search.json", function( data ) {
			var items = [];
			demoArray = shuffle(data.entries);
			sidebarArray = [];
			i = 6;
			while (i){
				potential = demoArray.pop();
				if (potential.url != window.location.pathname && potential.url.indexOf("/demos/") != -1){
					sidebarArray.push(potential);
					htmlString = "<li><a href='"+potential.url+"' class='thumbnail'>"
					if (potential.type == "demo"){
						htmlString += "<img src='"+potential.url+"thumbnail.png' alt=''>";
					}
					htmlString += "<p class='thumbnail-title'>"+potential.title+"</p>";
					htmlString += "</a></li>";
					items.push(htmlString);
					i--;
				}
			}

			$(items.join("")).appendTo( ".sidebar ul" );
		}).fail(function(){
			$(".sidebar").css("display", "none");
		});
	}
})

$("body").on("click", ".sidebar a", function(e){
	if ($(this).attr("target") != "_blank"){
		e.preventDefault();
		ga('send', 'event', 'sidebar', 'click', $(this).attr("href"));
		document.location = $(this).attr("href");
	}
});



$(document).ready(function(){

	// Create codepen link
	if ($("#codepen-script").length){
		var time = new Date().getTime();
		var blurb = $.trim($(".blurb").text());
		if (blurb[blurb.length - 1] != "."){
			blurb += ".";
		}

		var jsExternal = [];

		jsExternal.push("//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js");
		jsExternal.push("https://academo.org/js/demoConcat.js?v=" + time);

		$(".js-demo-external-library").each(function(){
			jsExternal.push($(this).attr("src"));
		});

		$(".js-demo-library").each(function(){
			jsExternal.push("https://academo.org" + $(this).attr("src"));
		});


		blurb += "This demo is originally from https://academo.org.";

		var data = {
			title: $("h1").html(),
			description: blurb,
			html: '<div id="demo">\n</div>\n\n<div id="ui-container">\n</div>\n\n<a id="academo-banner" href="https://academo.org'+window.location.pathname+'" target="_blank">Find out more at Academo.org</a>',
			css: $(".demo-specific-styles").html(),
			js: $("#codepen-script").html(),
			css_external: "https://academo.org/scss/main.css?v=" + time,
			js_external: jsExternal.join(";"),
			editors: "011",
		};

		var JSONstring = 
		  JSON.stringify(data);		  
		  JSONstring = JSONstring.replace(/"/g, "&quot;").replace(/'/g, "&apos;");
		  
		var form = 
			'<div class="interface clearfix"><button id="codepen-submit-button" title="CodePen is a free online tool for editing and writing code." onclick=\'document.getElementById("codepen-form").submit();\'><i class="icon-link-ext"></i> Open with CodePen <i class="fa fa-codepen"></i></button></div>' +
			'<form action="https://codepen.io/pen/define" method="POST" target="_blank" id="codepen-form">' + 
		    '<input type="hidden" name="data" value=\'' + 
		      JSONstring + 
		      '\'>' + 
		    
		  '</form>';


		$("#ui-container").append(form);
	}




	var sponsoredLinks = [
		
	];

	// Randomise sponsored link
	// $(".js-sponsor-wrapper").html(shuffle(sponsoredLinks)[0]);


	// Sponsored tiles
		var sponsoredTilesInner = [
			
		]
		// $(".js-sponsored-tile").html(sponsoredTilesInner[Math.floor(Math.random() * sponsoredTilesInner.length) ] + "<p class='thumbnail-title'>Sponsored Link</p>");
	
});