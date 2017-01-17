# Uptime Robot

A simple node.js and browserify API for [uptime robot](http://uptimerobot.com/api)

    $ npm install uptime-robot

Currently, only some methods are implemented, but pull requests for the missing ones are welcome.

This library works in the browser using browserify.  You can see a demo by cloning this repo and running `npm run test-browser`.

All methods also return a [Promise](https://www.promisejs.org/) if no callback is provided.

## Example

```javascript
var Client = require('uptime-robot');
var cl = new Client('api-key');
cl.getMonitors({customUptimeRatio: [1, 7, 30]}, function (err, res) {
  if (err) throw err;
  console.dir(res);
});
```

## API

### cl.getMonitors(options, fn(err, monitors))

options:

 - see https://uptimerobot.com/api

### cl.newMonitor(options, fn(err))

options:

 - friendlyName - required
 - url - required
 - type - required (Default: 1)
 - subType - optional (required for port monitoring)
 - port - optional (required for port monitoring)
 - keywordType - optional (required for keyword monitoring)
 - keywordValue - optional (required for keyword monitoring)
 - httpUsername - optional
 - httpPassword - optional
 - alertContacts - optional (array of alert contact ids)
 - interval - optional (in minutes)

### cl.editMonitor(options, fn(err))

options:

 - monitorID - required
 - friendlyName - optional
 - url - optional
 - subType - optional (used only for port monitoring)
 - port - optional (used only for port monitoring)
 - keywordType - optional (used only for keyword monitoring)
 - keywordValue - optional (used only for keyword monitoring)
 - httpUsername - optional
 - httpPassword - optional
 - alertContacts - optional (array of alert contact ids)
 - interval - optional (in minutes)

### cl.deleteMonitor(id, fn(err))

options:

 - monitorID - required

### cl.resetMonitor(id, fn(err))

options:

 - monitorID - required


### cl.getAlertContacts(options, fn(err, alertContacts))

options:

 - alertContacts - optional (array of alert contact ids)
 - offset - optional (record to start paginating. Default: 0)
 - limit - optional (number of records to return. Default and max: 50)


### cl.getAllAlertContactIds(fn(err, alertContacts))

- alertContacts: array of all alert contact ids

## License

  MIT
