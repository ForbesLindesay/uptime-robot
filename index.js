var request = require('hyperquest');
var concat = require('concat-stream');
var qs = require('querystring');

var base = 'http://api.uptimerobot.com/';

module.exports = Client;
function Client(apiKey) {
  if (apiKey === '' || typeof apiKey !== 'string') {
    throw new Error('Uptime Robot API Key must be provided');
  }
  this.request = function (method, params, callback) {
    callback = guard(callback);
    params.apiKey = apiKey;
    params.format = 'json';
    params.noJsonCallback = 1;

    var failed = false;

    request(base + method + '?' + qs.stringify(params),
      function (err, res) {
        if (err) {
          failed = true;
          return callback(err);
        }
      })
      .pipe(concat(function (err, res) {
        if (failed) return;
        if (err) return callback(err);
        try {
          res = JSON.parse(res.toString());
        } catch (ex) {
          return callback(makeMalformedResponseError(ex));
        }
        if (res.stat === 'fail') {
          return callback(makeError(res));
        } else {
          callback(null, res);
        }
      }));
  };
}

function makeError(res) {
  var err = new Error(res.message);
  err.name = 'UptimeRobotServerError';
  err.code = res.id;
  return err;
}

function makeMalformedResponseError(message) {
  var err = new Error(message);
  err.name = 'UptimeRobotMalformedResponse';
  return err;
}

Client.prototype.getMonitors = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  if (!options.logs && options.alertContacts) throw new Error('logs is required if alert contacts is true.');
  var params = {};
  if (options.monitors) params.monitors = options.monitors.join('-');
  if (options.customUptimeRatio) params.customUptimeRatio = options.customUptimeRatio.join('-');
  if (options.logs) params.logs = '1';
  if (options.alertContacts) params.alertContacts = '1';
  if (options.showMonitorAlertConcats) params.showMonitorAlertConcats = '1';
  if (options.showTimezone) params.showTimezone = '1';

  return this.request('getMonitors', params, function (err, res) {
    if (err) return callback(err);
    var monitors = res.monitors.monitor;
    monitors.forEach(function (monitor) {
      if (monitor.customuptimeratio)
        monitor.customuptimeratio = monitor.customuptimeratio.split('-');
      else
        monitor.customuptimeratio = [];
      if (monitor.log)
        monitor.log.forEach(function (log) {
          log.datetime = parseDate(log.datetime);
        });
    });
    callback(null, monitors);
  });
};

Client.prototype.newMonitor = function (options, callback) {
  if (!options.friendlyName) throw new Error('friendlyName is required');
  if (!options.url) throw new Error('url is required');
  var params = {
    monitorFriendlyName:  options.friendlyName,
    monitorURL:           options.url,
    monitorType:          options.type || '1',
    monitorSubType:       options.subType,
    monitorKeywordType:   options.keywordType,
    monitorKeywordValue:  options.keywordValue,
    monitorHTTPUsername:  options.httpUsername,
    monitorHTTPPassword:  options.httpPassword,
    monitorAlertContacts: (options.alertContacts || []).join('-'),
    monitorInterval:      options.interval
  };
  return this.request('newMonitor', params, callback);
};

Client.prototype.deleteMonitor = function (id, callback) {
  return this.request('deleteMonitor', { monitorID: id }, callback);
};

Client.prototype.getAlertContacts = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  var params = {};
  if (options.alertcontacts) params.alertcontacts = options.alertcontacts.join('-');
  if (options.offset) params.offset = options.offset;
  if (options.limit) params.limit = options.limit;

  return this.request('getAlertContacts', params, function (err, res) {
    if (err) return callback(err);
    var alertContacts;
    try {
      alertContacts = res.alertcontacts.alertcontact;
    } catch(e) { return callback(e); }
    callback(null, alertContacts);
  });
};

Client.prototype.getAllAlertContactIds = function (callback) {
  this.getAlertContacts(function (err, alertContacts) {
    if (err) return callback(err);
    var alertContactIds;
    try {
      alertContactIds = alertContacts.map(function (c) { return c.id; });
    } catch(e) { return callback(e); }
    callback(null, alertContactIds);
  });
};

function guard(fn) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    fn.apply(this, arguments);
  };
}

var datePattern = /^(\d\d)\/(\d\d)\/(\d\d\d\d) (\d\d):(\d\d):(\d\d)$/;
function parseDate(str) {
  var match = datePattern.exec(str);
  var month = +match[1];
  var day = +match[2];
  var year = +match[3];
  var hour = +match[4];
  var minute = +match[5];
  var second = +match[6];

  return new Date(year, month - 1, day, hour, minute, second);
}
