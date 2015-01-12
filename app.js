var express = require('express');
var app = express();

var router = require('./routes/main');

app.set('port', (process.env.PORT || 3000));

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, X-Requested-With');
  next();
};

app.use(allowCrossDomain);

app.use('/api', router);

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});