var express = require('express'),
   app = express(),
   http = require('http'),
   bodyParser = require('body-parser'),
   mongoClient = require('mongodb').MongoClient,
   config = require('./config'),
   intel = require('intel'),
   net = require('net');


//
app.use(bodyParser.json());


mongoClient.connect(config.get('mongoose'), function(err, db) {
   if (err) {
      return intel.error(err);
   }
   require('./routes')(app, db);
});
var server = http.createServer(app);

server.on('connection', function(err, socket) {
   console.log('hi');
});

server.listen(config.get('port'), function() {
   intel.info('connetion was start on' + config.get('port'));
});
