'use strict';

var request = require('then-jsonp');
var IS_BROWSER = require('is-browser');

var base = 'https://api.uptimerobot.com/';

module.exports = Client;
function Client(apiKey) {
  if (apiKey === '' || typeof apiKey !== 'string') {
    throw new Error('Uptime Robot API Key must be provided');
  }
  this.request = function (method, params, callback) {
    params.apiKey = apiKey;
    params.format = 'json';
    if (!IS_BROWSER) params.noJsonCallback = '1';
    return request('GET', base + method, {
      qs: params,
      callbackName: 'jsonUptimeRobotApi',
      callbackParameter: false,
      skipJsonpOnServer: true
    }).then(function (res) {
      if (res.stat === 'fail') {
        throw makeError(res);
      } else {
        return res;
      }
    }).nodeify(callback);
  };
}

function makeError(res) {
  var err = new Error(res.message);
  err.name = 'UptimeRobotServerError';
  err.code = res.id;
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
  if (options.responseTimes) params.responseTimes  = '1';

  return this.request('getMonitors', params).then(function (res) {
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
    return monitors;
  }).nodeify(callback);
};

Client.prototype.newMonitor = function (options, callback) {
  if (!options.friendlyName) throw new Error('friendlyName is required');
  if (!options.url) throw new Error('url is required');
  var params = {
    monitorFriendlyName:  options.friendlyName,
    monitorURL:           options.url,
    monitorType:          options.type || '1',
    monitorSubType:       options.subType,
    monitorPort:          options.port,
    monitorKeywordType:   options.keywordType,
    monitorKeywordValue:  options.keywordValue,
    monitorHTTPUsername:  options.httpUsername,
    monitorHTTPPassword:  options.httpPassword,
    monitorAlertContacts: (options.alertContacts || []).join('-'),
    monitorInterval:      options.interval
  };
  return this.request('newMonitor', params).nodeify(callback);
};

Client.prototype.editMonitor = function (options, callback) {
  if (!options.monitorID) throw new Error('monitorID is required');
  var params = {
    monitorID:            options.monitorID,
    monitorFriendlyName:  options.friendlyName,
    monitorURL:           options.url,
    monitorSubType:       options.subType,
    monitorPort:          options.port,
    monitorKeywordType:   options.keywordType,
    monitorKeywordValue:  options.keywordValue,
    monitorHTTPUsername:  options.httpUsername,
    monitorHTTPPassword:  options.httpPassword,
    monitorAlertContacts: (options.alertContacts || []).join('-'),
    monitorInterval:      options.interval
  };
  return this.request('editMonitor', params).nodeify(callback);
};

Client.prototype.deleteMonitor = function (id, callback) {
  return this.request('deleteMonitor', { monitorID: id }).nodeify(callback);
};

Client.prototype.resetMonitor = function (id, callback) {
  return this.request('resetMonitor', { monitorID: id }).nodeify(callback);
};

Client.prototype.getAlertContacts = function (options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  var params = {};
  if (options.alertContacts) params.alertcontacts = options.alertContacts.join('-');
  if (options.offset) params.offset = options.offset;
  if (options.limit) params.limit = options.limit;

  return this.request('getAlertContacts', params).then(function (res) {
    return res.alertcontacts.alertcontact;
  }).nodeify(callback);
};

Client.prototype.getAllAlertContactIds = function (callback) {
  return this.getAlertContacts().then(function(alertContacts) {
    return alertContacts.map(function (c) { return c.id; });
  }).nodeify(callback);
};


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
