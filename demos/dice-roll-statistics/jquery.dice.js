/*
 *  This file is part of jqDice.
 *  <https://github.com/avianey/jqDice>
 *  
 *  Copyright (C) 2012 Antoine Vianey
 *  
 *  jqDice is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  jqDice is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with jqDice. If not, see <http://www.gnu.org/licenses/>
 */

jQuery.fn.dice = function(userOptions) {
	// Default options
	var options = {
		size: 100,
		val: Math.floor(Math.random() * 6) + 1,
		rotation: 0
	};
	$.extend(options, userOptions);
	
	var SQRT = 1.41421356;
	var POSITIONS = [
		[[1,1]],
		[[0,0],[2,2]],
		[[0,0],[1,1],[2,2]],
		[[0,0],[2,0],[0,2],[2,2]],
		[[0,0],[2,0],[1,1],[0,2],[2,2]],
		[[0,0],[2,0],[0,1],[2,1],[0,2],[2,2]]
	];
	
	this.empty();
	
	var indicatorDim = Math.round(18 * options.size / 200) * 2;
	var indicatorHalfDim = indicatorDim / 2;
	
	var step = Math.round(options.size / 4);
	var offset = step - indicatorHalfDim;

	var div = $("<div>").addClass("dice dice-" + options.val);
	var targetTop = 0;
	var targetLeft = 0;
	var top = 0;
	var left = 0;
	var indicator = null;
	for (var i = 1; i < options.val + 1; i++) {
		targetTop = POSITIONS[options.val - 1][i-1][0] * step + offset;
		targetLeft = POSITIONS[options.val - 1][i-1][1] * step + offset;
		top = targetTop - indicatorDim * (i - 1);
		left = targetLeft;
		indicator = $("<div>").addClass("dice-indicator");
		indicator.css("top", top + "px");
		indicator.css("left", left + "px");
		div.append(indicator);
	}
	var container = this.addClass("dice-container").append(div);
	var indicators = div.find(".dice-indicator");
	var x = 0;
	var y = 0;
	
	container.css("height", options.size + "px"); // base 100
	container.css("width", options.size + "px"); // base 100
	container.css("border-radius", (15 * options.size / 100) + "px"); // base 15
	container.css("-moz-border-radius", (15 * options.size / 100) + "px"); // base 15
	container.css("-webkit-border-radius", (15 * options.size / 100) + "px"); // base 15
	container.css("-moz-transform", "rotate(" + options.rotation + "deg)");
	container.css("-webkit-transform", "rotate(" + options.rotation + "deg)");
	x = -(indicatorHalfDim / 2 * Math.cos((45 + options.rotation) * Math.PI / 180));
	y = (indicatorHalfDim / 2 * Math.sin((45 + options.rotation) * Math.PI / 180));
	x = Math.abs(x) < 0.01 ? 0 : x;
	y = Math.abs(y) < 0.01 ? 0 : y;
	container.css("-webkit-box-shadow", x + "px " + y + "px 5px #888888");
	container.css("-moz-box-shadow", x + "px " + y + "px 5px #888888");
	container.css("box-shadow", x + "px " + y + "px 5px #888888");
	
	div.css("height", options.size + "px"); // base 100
	div.css("width", options.size + "px"); // base 100
	div.css("border-radius", Math.round(15 * options.size / 100) + "px"); // base 15
	div.css("-moz-border-radius", Math.round(15 * options.size / 100) + "px"); // base 15
	div.css("-webkit-border-radius", Math.round(15 * options.size / 100) + "px"); // base 15
	div.css("background", "-moz-linear-gradient(" + (45 + options.rotation) + "deg, #F6F6F6, #FFFFFF)");
	div.css("background", "-webkit-linear-gradient(" + (45 + options.rotation) + "deg, #F6F6F6, #FFFFFF)");
	x = (indicatorHalfDim / 4 * Math.cos((45 + options.rotation) * Math.PI / 180));
	y = -(indicatorHalfDim / 4 * Math.sin((45 + options.rotation) * Math.PI / 180));
	x = Math.abs(x) < 0.01 ? 0 : x;
	y = Math.abs(y) < 0.01 ? 0 : y;
	div.css("-webkit-box-shadow", "inset " + x + "px " + y + "px 3px 3px #EEEEEE");
	div.css("-moz-box-shadow", "inset " + x + "px " + y + "px 3px 3px #EEEEEE");
	div.css("box-shadow", "inset " + x + "px " + y + "px 3px 3px #EEEEEE");
	
	indicators.css("width", indicatorDim + "px"); // base 18
	indicators.css("height", indicatorDim + "px"); // base 18
	indicators.css("-moz-border-radius", indicatorHalfDim + "px");
	indicators.css("-webkit-border-radius", indicatorHalfDim + "px");
	indicators.css("border-radius", indicatorHalfDim + "px");
	x = indicatorHalfDim + (indicatorHalfDim * Math.cos((135 - options.rotation) * Math.PI / 180));
	y = indicatorHalfDim + (indicatorHalfDim * Math.sin((135 - options.rotation) * Math.PI / 180));
	x = Math.abs(x) < 0.01 ? 0 : x;
	y = Math.abs(y) < 0.01 ? 0 : y;
	indicators.css("background", "-webkit-radial-gradient(" + x + "px " + y + "px , circle, #FFFFFF, #000000, #000000)");
	indicators.css("background", "-moz-radial-gradient(" + x + "px " + y + "px , circle, #FFFFFF, #000000, #000000)");

};