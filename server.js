var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mqtt = require('mqtt');

var settings = require('./settings/default'); // TODO: Setup settings overwriting
var api = require('./routes/api');

var app = express();
var router = express.Router();

var client = mqtt.connect("mqtt://" + settings.broker.host + ":" + settings.broker.port);

app.use(morgan('dev')); // log requests to the console

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', api.routing(router, client));

app.listen(settings.application.port); // TODO: Setup nginx tunnel with SSL
console.log('Listening on port ' + settings.application.port);