'use strict';

var Client = require('../');
var cl = new Client('u193485-e7bb953d295bd66420f2f5d6');

cl.getMonitors({customUptimeRatio: [1, 7, 30]}, function (err, res) {
  if (err) throw err;
  console.log(res);
});