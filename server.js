var express = require('express');
var bodyParser = require('body-parser');
var mqtt = require('mqtt');
var morgan = require('morgan')
var winston = require('winston'); 

var settings = require('./settings/index');
var api = require('./routes/api');

var app = express();
var router = express.Router();
var client = mqtt.connect("mqtt://" + settings.broker.host + ":" + settings.broker.port);

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      json: false,
      name: 'regular-file',
      filename: settings.logger.directory + 'regular.log',
      level: settings.logger.logLevel
    }),
    new (winston.transports.File)({
      json: false,
      name: 'error-file',
      filename: settings.logger.directory + 'error.log',
      level: 'error'
    })
  ]
}); 

app.use(morgan('common', { stream: { write: message => logger.log('verbose', message) }}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', api.routing(router, client, logger, settings));

client.on('connect', function () {
  app.listen(settings.application.port, function(err){
    if (err) {
      logger.error(err);
      return;
    }
    logger.info("Listening on port " + settings.application.port);
  }); 
});

client.on('error', function (err) {
  logger.error(err);
});