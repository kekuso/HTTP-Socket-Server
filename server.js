// server
var net = require('net');
var CONFIG = require('./config');
var path;
var now = new Date();
var responseSuccess = 'HTTP/1.1 200 OK\n' +
                'Date: ' + now.toUTCString() +
                '\nServer: awesomeServer/1.0.0 (Ubuntu)\n';

var server = net.createServer(function (socket) {
  var socketAddress = socket.address().address;
  var socketPort = socket.remotePort;
  var firstLine = [];
  var httpHeaders = [];
  console.log("CONNECTED: " + socketAddress + ":" + socketPort);

  socket.on('data', function(data) {
    firstLine = data.toString().split(' ');
    if(firstLine[0] === 'GET') {
      console.log("Get detected.");

      if(firstLine[1][0] === '/') {
      console.log("/ detected.");
      }
      if(firstLine[2]) {
        console.log(firstLine[2] + " detected.");
      }
    }

    console.log(('SERVER BCAST FROM ' + socketAddress + ":" + socket.remotePort + ": " + data).replace(/(\r\n|\n|\r)/gm,""));
  });
});

server.listen(CONFIG.PORT, function () {
  var PORT = server.address().port;
  console.log('Server listening on 127.0.0.1:' + CONFIG.PORT);
});

server.on('error', function (err) {
  throw err;
});