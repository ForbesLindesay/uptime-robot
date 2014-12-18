# Uptime Robot

  A simple node.js API for [uptime robot](http://uptimerobot.com/api)

    $ npm install uptime-robot

  Currently, only some methods are implemented, but pull requests for the missing ones are welcome.

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


### cl.getAlertContacts(options, fn(err, alertContacts))

options:

 - alertcontacts - optional (array of alert contact ids)
 - offset - optional (record to start paginating. Default: 0)
 - limit - optional (number of records to return. Default and max: 50)

## License

  MIT

![viewcount](https://viewcount.jepso.com/count/forbeslindesay/uptime-robot.png)