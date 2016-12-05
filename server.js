var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mqtt = require('mqtt');

var settings = require('./settings/index'); // TODO: Setup settings overwriting
var api = require('./routes/api');

var app = express();
var router = express.Router();

var client = mqtt.connect("mqtt://" + settings.broker.host + ":" + settings.broker.port);

app.use(morgan('dev')); // logs requests to console - TODO: improve logging?

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', api.routing(router, client));

client.on('connect', function () {
  app.listen(settings.application.port, function(err){ // TODO: Setup nginx tunnel with SSL OR set up HTTPS on Node itself
    if (err) {
      console.error(err);
      return;
    }
    console.log("Listening on port " + settings.application.port); // TODO: Decide whether to emmit connecting to MQ?
  }); 
});

client.on('error', function (err) {
  console.error(err);
});