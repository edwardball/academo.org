(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.StereoAnalyserNode = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

function StereoAnalyserNode(audioContext, opts) {
  opts = opts || {};

  var splitter = audioContext.createChannelSplitter(2);
  var analyserL = audioContext.createAnalyser();
  var analyserR = audioContext.createAnalyser();
  var merger = audioContext.createChannelMerger(2);
  var fftSize = opts.fftSize;
  var minDecibels = opts.minDecibels;
  var maxDecibels = opts.maxDecibels;
  var smoothingTimeConstant = opts.smoothingTimeConstant;
  var hasError = false;

  splitter.channelCount = 2;
  splitter.channelCountMode = "explicit";

  analyserL.channelCount = 1;
  analyserL.channelCountMode = "explicit";

  analyserR.channelCount = 1;
  analyserR.channelCountMode = "explicit";

  merger.channelCount = 1;
  merger.channelCountMode = "explicit";

  splitter.connect(analyserL, 0, 0);
  splitter.connect(analyserR, 1, 0);

  if (typeof analyserL.getFloatTimeDomainData !== "function") {
    analyserL.getFloatTimeDomainData = getFloatTimeDomainData;
    analyserR.getFloatTimeDomainData = getFloatTimeDomainData;
  }

  if (typeof fftSize === "number") {
    analyserL.fftSize = fftSize;
    analyserR.fftSize = fftSize;
  }

  try {
    if (typeof minDecibels === "number") {
      analyserL.minDecibels = minDecibels;
      analyserR.minDecibels = minDecibels;
    }
  } catch (e) {
    hasError = true;
  }

  if (typeof maxDecibels === "number") {
    analyserL.maxDecibels = maxDecibels;
    analyserR.maxDecibels = maxDecibels;
  }

  if (hasError) {
    analyserL.minDecibels = minDecibels;
    analyserR.minDecibels = minDecibels;
  }

  if (typeof smoothingTimeConstant === "number") {
    analyserL.smoothingTimeConstant = smoothingTimeConstant;
    analyserR.smoothingTimeConstant = smoothingTimeConstant;
  }

  Object.defineProperties(splitter, {
    fftSize: {
      set: function(value) {
        analyserL.fftSize = value;
        analyserR.fftSize = value;
      },
      get: function() {
        return analyserL.fftSize;
      },
      enumerable: true
    },
    frequencyBinCount: {
      get: function() {
        return analyserL.frequencyBinCount;
      },
      enumerable: true
    },
    minDecibels: {
      set: function(value) {
        analyserL.minDecibels = value;
        analyserR.minDecibels = value;
      },
      get: function() {
        return analyserL.minDecibels;
      },
      enumerable: true
    },
    maxDecibels: {
      set: function(value) {
        analyserL.maxDecibels = value;
        analyserR.maxDecibels = value;
      },
      get: function() {
        return analyserL.maxDecibels;
      },
      enumerable: true
    },
    smoothingTimeConstant: {
      set: function(value) {
        analyserL.smoothingTimeConstant = value;
        analyserR.smoothingTimeConstant = value;
      },
      get: function() {
        return analyserL.smoothingTimeConstant;
      },
      enumerable: true
    },
    connect: {
      value: function() {
        analyserL.connect(merger, 0, 0);
        analyserR.connect(merger, 0, 1);
        merger.connect.apply(merger, arguments);
      }
    },
    disconnect: {
      value: function() {
        if (arguments.length !== 0) {
          global.console.warn(
            "StereoAnalyserNode does not support selective disconnection. This operation may not works to analyse fine."
          );
        }
        analyserL.disconnect();
        analyserR.disconnect();
        merger.disconnect.apply(merger, arguments);
      }
    },
    getFloatFrequencyData: {
      value: function(arrayL, arrayR) {
        analyserL.getFloatFrequencyData(arrayL);
        analyserR.getFloatFrequencyData(arrayR);
      }
    },
    getByteFrequencyData: {
      value: function(arrayL, arrayR) {
        analyserL.getByteFrequencyData(arrayL);
        analyserR.getByteFrequencyData(arrayR);
      }
    },
    getFloatTimeDomainData: {
      value: function(arrayL, arrayR) {
        analyserL.getFloatTimeDomainData(arrayL);
        analyserR.getFloatTimeDomainData(arrayR);
      }
    },
    getByteTimeDomainData: {
      value: function(arrayL, arrayR) {
        analyserL.getByteTimeDomainData(arrayL);
        analyserR.getByteTimeDomainData(arrayR);
      }
    },
  });

  return splitter;
}

function getFloatTimeDomainData(array) {
  var uint8 = new global.Uint8Array(array.length);

  this.getByteTimeDomainData(uint8);

  for (var i = 0, imax = array.length; i < imax; i++) {
    array[i] = ((uint8 - 128) / 128);
  }
}

module.exports = StereoAnalyserNode;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});

