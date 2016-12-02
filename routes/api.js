module.exports = {
  routing : function(router, client){

    router.get('/', function(req, res) {
      res.json({ results: [ require('../docs/api-root') ] }); 
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