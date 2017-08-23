'use strict';
const intel = require('intel');
module.exports = function(app, db) {

   app.get('/', function(req, res) {
      let details = {};

      if (req.query.clientId) {
         details['clientId'] = parseFloat(req.query.clientId);
      }
      if (req.query.date) {
         details['date'] = {$regex: req.query.date};
      }
      if (req.query.message) {
         details['data'] = {$regex: req.query.message};
      }
      console.log(details);
      db.collection('logs').find(details).toArray(function(err, results) {
         if (err) {
            throw err;
            intel.error('Запись не найдена');
         } else {
            res.send(results.toString());
         }
      });
   });

   app.delete('/', function(req, res) {
      let clientId = req.body.clientID,
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
         let clientId = req.body.clientId,
            message = req.body.message,
            date = req.body.date,
            logObject = {
               date: date,
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