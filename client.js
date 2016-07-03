// client
var net = require('net');
var Stream = require("stream");
var util = require('util');
var CONFIG = require('./config');

var port;
var method = 'GET'; //default value for method
var url = process.argv[2];
if(!url) {
  throw new Error("No url provided.");
}
var urlArray = url.toString().split('/', 1);
var domain = urlArray[0];
if(domain === 'localhost' || domain === '127.0.0.1') {
  CONFIG.PORT = 8080;
}
else {
  CONFIG.PORT = 80;
}
var path = urlArray[1];

// if a method is specified
if(process.argv[3]) {
  switch(process.argv[3]) {
    case '--GET':
      method = 'GET';
      break;
    case '--HEAD':
      method = 'HEAD';
      break;
    case '--POST':
      method = 'POST';
      break;
    case '--PUT':
      method = 'PUT';
      break;
    case '--DELETE':
      method = 'DELETE';
      break;
    case '--CONNECT':
      method = 'CONNECT';
      break;
    default:
      console.log("Invalid or unsupported method.");
  }
}

// if a port is specified
if(process.argv[4]) {
  if(process.argv[4].slice(0, 2) === '--' && !(isNaN(process.argv[4].slice(2)))) {
    CONFIG.PORT = process.argv[4].slice(2);
  }
  else
    throw new Error("invalid port number.");
}

var socket = new net.Socket();
// var input = process.stdin;

socket.connect({port: CONFIG.PORT, host: domain}, function () {
  console.log("Attempting to connect");
  var serverAddress = socket.remoteAddress;
  var serverPort = socket.remotePort;
  var now = new Date();
  console.log('CONNECTED TO: ' + serverAddress + ":" + serverPort);
  if(!path) {
    socket.write(method + ' / HTTP/1.1 \n' +
    'Date: ' + now.toUTCString() + '\n' +
    'Host: localhost\n' +
    'User-Agent: AGENT OF JUSTICE\n\n');
  }
  else {
    socket.write(method + ' /' + path + ' HTTP/1.1 \n' +
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

