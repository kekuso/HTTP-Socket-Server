// server
var net = require('net');
var CONFIG = require('./config');
var fs = require('fs');
var path;
var now = new Date();
var responseSuccess = 'HTTP/1.1 200 OK\n' +
                'Date: ' + now.toUTCString() +
                '\nServer: awesomeServer/1.0.0 (Ubuntu)\n';
var indexData;
indexData = fs.readFileSync("./public/index.html").toString();
// console.log("indexData: " + indexData);
var serverHTTPHeaders;

var server = net.createServer(function (socket) {
  var socketAddress = socket.address().address;
  var socketPort = socket.remotePort;
  var clientFirstLine = [];
  var clientHeaderLines = [];
  var statusLine;
  console.log("CONNECTED: " + socketAddress + ":" + socketPort);

  socket.on('data', function(data) {
    clientFirstLine = data.toString().split(' ').splice(0, 3);
    //console.log(clientFirstLine);
    if(clientFirstLine[0] === 'GET') {
      console.log("Get detected.");

      if(clientFirstLine[1][0] === '/') {
        console.log("/ detected.");
        // assume index.html always exists
        if(clientFirstLine[2]) {
          console.log(clientFirstLine[2] + " detected.");
          statusLine = 'HTTP/1.1 200 OK';
          socket.write(statusLine);
          socket.write(serverHTTPHeaders);
          socket.write("\n" + indexData);
        }
      }
    }
    clientHeaderLines = data.toString().split('\n').splice(1);
    console.log(clientHeaderLines);

    console.log(('SERVER BCAST FROM ' + socketAddress + ":" + socket.remotePort + ": " + data).replace(/(\r\n|\n|\r)/gm,""));
  });
});

server.listen(CONFIG.PORT, function () {
  var PORT = server.address().port;
  var serverNow = new Date();
  console.log('Server listening on 127.0.0.1:' + CONFIG.PORT);
  serverHTTPHeaders = 'Server: localhost\n' +
                      'Date: ' + serverNow.toUTCString() + '\n';
});

server.on('error', function (err) {
  throw err;
});


