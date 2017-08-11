var net = require('net'),
   Tail = require('tail').Tail;

tail = new Tail("log", {separator: /[\r]?\n(?=\w{3}\s\d+\s\d{2}:\d{2}:\d{2})/g});

tail.on("line", function(data) {
   if (data) {
      var rawData = (/^(\w{3}\s\d+\s\d{2}:\d{2}:\d{2})([\s\S]*)/mg).exec(data),
         sendingData;
      if (rawData) {
         sendingData = {
            date: rawData[1],
            message: rawData[2].trim(),
            clientId: clientId
         };
      }
      // console.log(sendingData.message);
      sendData(JSON.stringify(sendingData));
   }
});

tail.on("error", function(error) {
   console.log('ERROR: ', error);
});


var clientId = 321654;

var client = new net.Socket();
client.connect(6665, '127.0.0.1', function() {
   console.log('Connected');
   client.write('Hello, server! Love, Client.');

   client.on('data', function(data) {
      console.log(data);
   })

});

var http = require('http');

var options = {
   host: 'localhost',
   port: 6666,
   method: 'POST',
   json: true,
   headers: {
      'Content-Type': 'application/json'
   }
};

function sendData(string) {
   if (!string) {
      return;
   }
   var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
         console.log("body: " + chunk);
      });
   });

   req.write(string);
   req.end();
}
