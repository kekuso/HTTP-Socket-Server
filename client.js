// client
var net = require('net');
var Stream = require("stream");
var util = require('util');

var url = process.argv[2];
if(url) {
  var CONFIG = require('./config');

  var socket = new net.Socket();
  // var input = process.stdin;

  socket.connect({port: CONFIG.PORT, host: url}, function () {

    console.log("Attempting to connect");
    var serverAddress = socket.remoteAddress;
    var serverPort = socket.remotePort;
    var now = new Date();
    console.log('CONNECTED TO: ' + serverAddress + ":" + serverPort);
    socket.write('GET /apply HTTP/1.1\n' +
      'Date: ' + now.toUTCString() + '\n' +
      'Host: www.devleague.com\n' +
      'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.106 Safari/537.36\n\n');
  });

  socket.on('data', function(data) {
    console.log("Receiving data...");
    console.log(data.toString());
    socket.end();
    // process.exit();
  });

  socket.on('end', function () {
    console.log('disconnected from server.');
  });

  socket.on('error', function (err) {
    throw err;
  });
}

else {
  console.log("Bad input.");
  console.log("Missing url parameter.");
  console.log("Ex: www.google.com");
}
