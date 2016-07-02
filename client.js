// client
var net = require('net');
var Stream = require("stream");
var util = require('util');
var CONFIG = require('./config');

var port;
var url = process.argv[2];
var urlArray = url.toString().split('/');
//console.log("URL Array: " + urlArray);
var domain = urlArray[0];
if(domain === 'localhost' || domain === '127.0.0.1') {
  CONFIG.PORT = 8080;
}
else {
  CONFIG.PORT = 80;
}
var path = urlArray[1];

if(url) {
  var socket = new net.Socket();
  // var input = process.stdin;

  socket.connect({port: CONFIG.PORT, host: domain}, function () {
    console.log("Attempting to connect");
    var serverAddress = socket.remoteAddress;
    var serverPort = socket.remotePort;
    var now = new Date();
    console.log('CONNECTED TO: ' + serverAddress + ":" + serverPort);
    if(!path) {
      socket.write('GET / HTTP/1.1 \n' +
      'Date: ' + now.toUTCString() + '\n' +
      'Host: localhost\n' +
      'User-Agent: AGENT OF JUSTICE\n\n');
    }
    else {
      socket.write('GET /' + path + ' HTTP/1.1 \n' +
      'Date: ' + now.toUTCString() + '\n' +
      'Host: localhost\n' +
      'User-Agent: AGENT OF JUSTICE\n\n');
    }
  });

  socket.on('data', function(data) {
    console.log("Receiving data...");
    console.log(data.toString());
    socket.end();
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
