const net = require('net');
const Tail = require('tail').Tail;
const http = require('http');
const config = require('../config');
const intel = require('intel');

tail = new Tail("client/log", {separator: /[\r]?\n(?=\w{3}\s\d+\s\d{2}:\d{2}:\d{2})/g});

tail.on("line", function(data) {
   if (data) {
      let rawData = (/^(\w{3}\s\d+\s\d{2}:\d{2}:\d{2})([\s\S]*)/mg).exec(data),
         sendingData;
      if (rawData) {
         sendingData = {
            date: rawData[1],
            message: rawData[2].trim(),
            clientId: clientId
         };
      }
      sendData(JSON.stringify(sendingData));
   }
});

tail.on("error", function(error) {
   console.log('ERROR: ', error);
});

let clientId = 321654;

const client = new net.Socket();
client.connect(config.get('portTCP'), config.get('serverAddress'), function(err) {
   if (err) {
      return intel.error(err);
   }
   console.log('Connected');
   client.write('Hello, server! Love, Client.');

   // client.on('data', function(data) {
   //    console.log(data);
   // })

});

const options = {
   host: config.get('serverAddress'),
   port: config.get('portHttp'),
   method: 'POST',
   json: true,
   headers: {
      'Content-Type': 'application/json'
   }
};

/**
 *Отправка данных
 * @param string{JSON} Строка в формате JSON, с параметрами сообщения
 */
function sendData(string) {
   if (!string) {
      return;
   }
   // intel.info(string);
   const req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
         // intel.info("body: " + chunk);
      });
   });

   req.write(string);
   req.end();
}
