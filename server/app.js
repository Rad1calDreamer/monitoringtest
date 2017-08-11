'use strict';
const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const config = require('./config');
const intel = require('intel');
const net = require('net');


app.use(bodyParser.json());

const serverTCP = net.createServer(function(socket) {
   console.log("client connected!!!!");

   let data = '';
   socket.on('data', function(d) {
      console.log(d.toString('utf8').indexOf('\n'));
      data += d.toString('utf8');
      let p = data.indexOf('\n');
      if (~p) {
         let cmd = data.substr(0, p);
         data = data.slice(p + 1);
         onCommand(cmd.trim(), socket);
         data = '';
      }
      socket.write(d);
   });

   socket.on('end', function() {
      console.log('client disconnected');
   });

});

serverTCP.on('connection', function(err, socket) {
   console.log('hi tcp client');
});

serverTCP.listen(config.get('portTCP'), function() {
   intel.info('portTCP connetion was start on' + config.get('portTCP'));
});
//
//
// mongoClient.connect(config.get('mongoose'), function(err, db) {
//    if (err) {
//       return intel.error(err);
//    }
//    require('./routes')(serverHttp, db);
// });
// const serverHttp = http.createServer(app);
//
// serverHttp.listen(config.get('portHttp'), function() {
//    intel.info('connection was start on' + config.get('portHttp'));
// });

mongoClient.connect(config.get('mongoose'), function(err, db) {
   if (err) {
      return intel.error(err);
   }
   require('./routes')(app, db);
});
http.createServer(app).listen(config.get('portHttp'), function() {
   intel.info('connetion was start on' + config.get('portHttp'));
});
/**
 * Получает роутер команд
 * @param {string} имя команды
 * @param {net.Socket} socket
 */

function onCommand(cmd, socket) {
   switch (cmd) {
      case 'start':
         socket.write('opened\n');
         break;
      case 'stop':
         socket.write('added\n');
         break;
   }
}
