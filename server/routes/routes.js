var intel = require('intel'),
   dateFormat = require('dateformat');

module.exports = function(app, db) {

   app.get('/list', function(req, res) {
      var clientId, date, message, details = {};
      console.log(req);
      if (req.params.clientId) {
         details['clientId'] = req.params.clientId;
      }
      if (req.params.date) {
         details['date'] = req.params.date;
      }
      if (req.params.message) {
         details['message'] = {$in: req.params.message};
      }
      db.collection('logs').find(details, function(err, item) {
         if (err) {
            intel.error('Запись не найдена');
         } else {
            res.send(item);
         }
      })
   });

   app.delete('/', function(req, res) {
      var clientId = req.body.clientID,
         details = {
            'clientId': clientId
         };
      db.collection('logs').remove(details, function(err, item) {
         if (err) {
            intel.error('Запись не найдена');
         } else {
            res.send('Запись за ' + clientId + ' удалена!');
         }
      })
   });

   app.post('/', function(req, res) {
      intel.info(req.body);
      if (req.body) {
         var clientId = req.body.clientId,
            message = req.body.message,
            logObject = {
               date: dateFormat(new Date(), 'mmm d HH:MM:ss'),
               data: message,
               clientId: clientId
            };
         db.collection('logs').insert(logObject, function(err, result) {
            if (err) {
               res.send({'error': 'wooops ><'});
            } else {
               res.send(result.ops[0]);
            }
         });
      }
   });
};