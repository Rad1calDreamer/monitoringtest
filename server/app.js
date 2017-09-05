'use strict';
const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;
const config = require('../config');
const intel = require('intel');
const net = require('net');

function errorHandler(err, req, res, next) {
   intel.error(err);
   next(err);
}

app.use(bodyParser.json());
app.use(errorHandler);
const serverTCP = net.createServer(function(socket) {

   let data = '';
   socket.on('data', function(d) {
      console.log(d.toString().indexOf('\n'));
      data += d.toString();
      let p = data.indexOf('\n');
      if (~p) {
         let cmd = data.substr(0, p);
         data = data.slice(p + 1);
         onCommand(cmd.trim(), socket);
         data = '';
      }
      socket.write(d);
   });

   socket.on('end', function(err) {
      if (err) {
         intel.info(err);
         return;
      }

      console.log('client disconnected');
   });

});

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