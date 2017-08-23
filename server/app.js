'use strict';
const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const config = require('../config');
const intel = require('intel');
const net = require('net');


app.use(bodyParser.json());

const serverTCP = net.createServer(function(socket) {

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

serverTCP.listen(config.get('portTCP'));
serverTCP.listen(config.get('portTCP'), function() {
   intel.info('portTCP connetion was start on' + config.get('portTCP'));
});
startServer();

/**
 * Получает роутер команд
 * @param cmd{String} Имя команды
 */

function onCommand(cmd) {
   switch (cmd) {
      case 'start':
         startServer();
         break;
      case 'stop':
         stopServer();
         break;
   }
}


function startServer() {
   mongoClient.connect(config.get('mongoDbUrl'), function(err, db) {
      if (err) {
         return intel.error(err);
      }
      require('./routes')(app, db);
   });
   http.createServer(app).listen(config.get('portHttp'), function() {
      intel.info('connetion was start on' + config.get('portHttp'));
   });
}

function stopServer() {
   /*выкл*/
}