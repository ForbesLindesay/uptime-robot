'use strict';

var request = require('then-request');

module.exports = get;
function get(url) {
  return request('GET', url, {qs: {noJsonCallback: '1'}}).getBody('utf8').then(JSON.parse);
}