# Academo Documentation

## Background
Academo is a hub of educational and interactive demonstrations. As of Feb 2016, the majority of the demos were written by me, the founder, Ed Ball. Many of the demos were written when I was relatively new to JavaScript and as such need refactoring (hey, I'm following the release philosophy of Reid Hoffman and Facebook), so if you see some code that could do with some TLC, please do submit a pull request! 

More recently, I've developed a more consistent approach to writing demos, explained below. If you have an idea for a demo, and know a little Javascript, please do consider submitting one.

### Infrastructure

The site is completely static and runs on [Jekyll](https://jekyllrb.com/), so the first thing you need to do is install that if you don't already have it. To serve the site locally, run `rake serve`.

To keep Jekyll up-to-date, run `gem update jekyll`

## Demos

To add a new demo, first create a new branch by running:

```git checkout -b mynewdemo```

Then copy the demo template folder (the `r` flag is needed to ensure the whole folder is copied)

```cp -r demos/_template demos/mynewdemo```

<!-- It's then good to commit this skeleton code and push to a new branch.

```git push -u origin mynewdemo```

(the `-u` flag just means that the local branch will track the remote one) -->

###Demo Structure

####index.html

Each demo must have an `index.html` file with a block of YML front matter at the start. For example,

```
---
title: Galileo's Sunspot Drawings # The name of the demo
categories: [Physics] # An array of categories. Choose from Engineering, Georgraphy, Maths, Music, Physics
subcategories: [Astronomy] # An array of subcats. See the category folders for available choices. Eg for Maths can be Geometry, Numbers, Statistics.
tags: [Sunspots] # An array of tags, helpful for searching
blurb: Animated version of Galileo's 400-year-old sunspot drawings # This is a short description that appears below the title and on Twitter/Facebook links etc. 
stylesheets: [styles.css] # Array of any stylesheets used
scripts: [demo.js] # Array of any javascript files required, in order. This should usually always have at last demo.js in it.
libraries: [] #Array of any javascript libraries required. See /js/lib for available libraries.
cdn: ["<URL Here>"] # Array of any CDN files needed
latex: true # If you want to have mathematical equations on the page, enable Latex support.
---
```

#### Social metadata

If you want facebook/twitter links to show media links, in `index.html`'s YML front matter, also specify
```
twitterCard: true
facebookOG: true
```

Then in the demo's folder, you need to put two images:

* Facebook image (facebook-og.png) should be at least 1200 x 630px
* Twitter image (twitter-card.png) must be no bigger than 1MB. (560 x 315)

The rest of `index.html` should contain the demo's description, written with standard html markup. If your demo requires any special elements like canvas or svg, please don't hardcode these into index.html, instead generate them dynamically in the javascript file and `append` to the demo div, `<div id='demo'></div>`. This is so features like "Open in CodePen" won't break.

####Javascript

To create an interactive demo, you need to create a new instance of the `Demo` class, passing in an object containing 3 properties
 * `ui` an object containing properties and settings used to create the user interface
 * `init` - a function run when the demo first loads
 * `update` - a function run every time the user interacts with the user interface

```javascript
var demo = new Demo({
	ui: {
		slider: {
			title: "Slider",
			value: 10,
			range: [1, 20],
			resolution: 0.01
		},
		checkbox: {
			title: "Checkbox",
			value: true
		},
		button: {
			title: "Button",
			type: "button"
		}
	},

	init: function(){

	},

	update: function(e){

	}
});
```

#### UI
Every property in the `ui` object will create a corresponding element in the user interface panel. The name of each property can be anything you like. When you need to get the value of the desired user-interface element in your code, eg you want the current `temperature` value in the `update` function, you can access it like so: `this.ui.temperature.value`. Some example settings and how they influence the user interface panel can be seen below.

```
ui: {
	temperature: {
		title: "Temperature",
		value: 5000,
		units: "K", //optional
		range:[2000,7000], //this range option means the UI element will be a slider
		resolution:1, // Determines the amount of rounding of the slider number. Give value as a power of 10, eg 0.01,0.1,1 etc
		color: "lightblue" //can also be hex or rgb
		input: // Normally you can probably omit this option. However, if you don't want a text field below the slider, but want the value to display, this should be "readonly". If you don't want any display at all, this should be "hidden"
	},
	showLine: {
		// This creates a check box
		title: "Show Line?",
		value: true // default value
	},
	timeBase: {
		//This creates a dropdown selection
	    title: "Time base",
	    value: 1, // value of default option
	    values: [ //the first value in each pair is the label, the second is the value
	    	["100ms",1],
	    	["200ms",2],
	    	["500ms",5]
	    ] 
	},
	clearTrace:{
		//This creates a button that doesn't need an intrinsic value. Clicking it will still fire the update function, however.
	    title: "Clear Trace",
	    type: "button"
	}
}
```

As mentioned above, the `update` function is fired any time a user interface element is changed. The function is passed one argument which is the name of the property updated.

####Thumbnail

Finally, each demo needs a `thumbnail.png` file. The image should be saved at a size of 260&times;170px in PNG format. Please don't include any borders on the images because the thumbnail has a border provided via CSS.

## To Do List
I'd like to start implementing testing on demos (e.g. with Jasmine), and i am currently investigating the best way to go about this. Any input/advice/tips welcome.
