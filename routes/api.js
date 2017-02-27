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

    router.route('/topics').get(function(req, res) {
      res.json({ results: [ ] }); 
    });

    router.route('/topics/:topic_name').post(function(req, res) {
      var payload = JSON.stringify(req.body);
      client.publish(req.params.topic_name, payload );
      res.json({ results: [ payload ]});
    });

    return router;
  }
}