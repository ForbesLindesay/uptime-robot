# Uptime Robot

  A simple node.js API for [uptime robot](http://www.uptimerobot.com/api.asp)

    $ npm install uptime-robot

  Currently, only `getMonitors` is implemented, but pull requests would be welcome for the missing methods.

## Example

```javascript
var Client = require('uptime-robot');
var cl = new Client('api-key');
cl.getMonitors({customUptimeRatio: [1, 7, 30]}, function (err, res) {
  if (err) throw err;
  console.dir(res);
});
```

## License

  MIT

![viewcount](https://viewcount.jepso.com/count/forbeslindesay/uptime-robot.png)