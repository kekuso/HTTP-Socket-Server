// server
var net = require('net');
var CONFIG = require('./config');
var path;
var now = new Date();
var response = 'HTTP/1.1 200 OK\n' +
                'Date: ' + now.toUTCString() +
                '\nServer: awesomeServer/1.0.0 (Ubuntu)\n';

var server = net.createServer(function (socket) {
  var socketAddress = socket.address().address;
  var socketPort = socket.remotePort;
  console.log("CONNECTED: " + socketAddress + ":" + socketPort);

  socket.on('data', function(data) {
    var index = clients.indexOf(socket);
    console.log(('SERVER BCAST FROM ' + socketAddress + ":" + socket.remotePort + " " + userArray[index] + ": " + data).replace(/(\r\n|\n|\r)/gm,""));
  });
});

server.listen(CONFIG.PORT, function () {
  var PORT = server.address().port;
  console.log('Server listening on 127.0.0.1:' + CONFIG.PORT);
});

server.on('error', function (err) {
  throw err;
});