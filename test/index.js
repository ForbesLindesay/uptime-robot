'use strict';

var assert = require('assert');
var Client = require('../');
var cl = new Client('u193485-e7bb953d295bd66420f2f5d6');

cl.getMonitors({customUptimeRatio: [1, 7, 30]}, function (err, res) {
  if (err) throw err;
  assert(Array.isArray(res));
  assert(res.length === 1);
  assert(res[0].id === '776540955');
  console.log('getMonitors', res);
  console.log('getMonitors passed');
});

cl.resetMonitor('776540955', function (err, res) {
  if (err) throw err;
  assert(res.stat === 'ok');
  console.log('resetMonitor', res);
  console.log('resetMonitor passed');
});

process && process.exit && process.exit(0);
