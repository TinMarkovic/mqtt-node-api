"use strict";
const docsAPIRoot = require('../docs/api-root')

module.exports = {
  routing : function(router, client, logger, settings){

    router.use(function(req, res, next) {
      logger.info("Request received: \n Body: ", {"Body:" : req.body},
                                     "\n Headers: ", {"Headers:" : req.headers});
      next();
    });

    router.use(function(req, res, next) {
      if (!req.headers.authorization) {
        return res.json({ error: 'No credentials sent.' });
      }

      var encoded = req.headers.authorization.split(' ')[1];
      var decoded = new Buffer(encoded, 'base64').toString('utf8');

      var client_id = decoded.split(':')[0]
      var client_secret = decoded.split(':')[1]

      if(!(client_id in settings.client_keys)) {
        return res.json({ error: 'Invalid credentials.' });
      }

      if(settings.client_keys[client_id] != client_secret) {
        return res.json({ error: 'Invalid credentials.' });
      }

      next();
    });

    router.get('/', function(req, res) {
      res.json({ results: [ docsAPIRoot ] }); 
    });

    router.route('/topics/:topic_name').post(function(req, res) {
      var contype = req.headers['content-type'];
      if (!contype || contype.indexOf('application/json') !== 0)
        return res.send(400);
      
      var payload = JSON.stringify(req.body);
      client.publish(req.params.topic_name, payload );
      res.json({ results: [ payload ]});
    });

    router.route('/envelopes').post(function(req, res) {
      var contype = req.headers['content-type'];
      if (!contype || contype.indexOf('application/json') !== 0)
        return res.send(400);
      
      var payload = req.body;
      if(!payload)
        return res.send(400);
      if(!payload.data)
        return res.json({ warning: "Empty data field."}); // Hmm... okay?

      var event_list = payload.data;

      event_list.forEach(function(event){
        // As per the Caliper implementation, @type and @action are URIs:
        var event_name = event["@type"].split("/")[5]; 
        if(event["action"])
          event_name += "." + event["action"].split("#")[1];
        var event_body = JSON.stringify(event);

        client.publish(event_name, event_body);
      });

      return res.send(200);
    });

    return router;
  }
}
