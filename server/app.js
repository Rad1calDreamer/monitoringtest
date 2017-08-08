'use strict';
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
   // require('./routes')(app, db);
});
var server = net.createServer(function(socket) {
   console.log("client connected!!!!");

   var data = '';
   socket.on('data', function(d) {
      console.log(d.toString('utf8').indexOf('\n'));
      data += d.toString('utf8');
      var p = data.indexOf('\n');
      if (~p) {
         var cmd = data.substr(0, p);
         data = data.slice(p + 1);
         onCommand(cmd.trim(), socket);
         data='';
      }
      socket.write(d);
   });

   socket.on('end', function() {
      console.log('client disconnected');
   });

});

server.on('connection', function(err, socket) {
   console.log('hi');
});

server.listen(config.get('port'), function() {
   intel.info('connetion was start on' + config.get('port'));
});

function onCommand(cmd, socket) {
   switch (cmd) {
      case 'open':
         socket.write('opened\n');
         break;
      case 'add':
         socket.write('added\n');
         break;
      case 'process':
         socket.write('processed\n');
         break;
   }
}
