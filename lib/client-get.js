'use strict';

var lock = require('throat')(1);
var Promise = require('promise');
var head = document.getElementsByTagName('head')[0];

module.exports = get;
function get(url) {
  return lock(function () {
    return new Promise(function (resolve, reject) {
      var done = false;
      var script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
          done = true;
          script.onload = script.onreadystatechange = null;
          if (script && script.parentNode) {
            script.parentNode.removeChild(script);
          }
        }
        setTimeout(function () {
          reject(new Error('Uptime robot callback should already have been called'));
        }, 100);
      };
      setTimeout(function () {
        if (!done) {
          done = true;
          script.onload = script.onreadystatechange = null;
          if (script && script.parentNode) {
            script.parentNode.removeChild(script);
          }
          reject(new Error('Uptime robot request timed out'));
        }
      }, 10000);
      window.jsonUptimeRobotApi = function (result) {
        if (!done) {
          resolve(result);
        }
      };
      head.appendChild(script);
    });
  });
}