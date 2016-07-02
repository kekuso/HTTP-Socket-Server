// server
var net = require('net');
var CONFIG = require('./config');
var fs = require('fs');
var filename;
var now = new Date();
var responseSuccess = 'HTTP/1.1 200 OK';
var notFound = 'HTTP/1.1 404 Not Found';

var serverHTTPHeaders;

var server = net.createServer(function (socket) {
  var messageBody = "";

  var socketAddress = socket.address().address;
  var socketPort = socket.remotePort;
  var clientFirstLine = [];
  var clientHeaderLines = [];
  console.log("CONNECTED: " + socketAddress + ":" + socketPort);

  socket.on('data', function(data) {
    clientFirstLine = data.toString().split(' ').splice(0, 3);
    if(clientFirstLine[0] === 'GET') {
      //console.log("Get detected.");
      if(clientFirstLine[1][0] === '/') {
        //console.log("/ detected.");
        if (clientFirstLine[1].length === 1) {
          filename = "index.html";
          messageBody = fs.readFileSync('./public/' + filename).toString();
        }
        else {
          filename = clientFirstLine[1].slice(1).toString();
          //console.log("filename: " + filename);
          try {
            messageBody = fs.readFileSync('./public/' + filename).toString();
          }
          catch (err){
            // socket.write(notFound);
            // socket.write(serverHTTPHeaders);
            socket.write(notFound + serverHTTPHeaders + '\n' + messageBody);
            throw new Error(notFound);
          }
        }
        // assume index.html always exists
        if(clientFirstLine[2] === 'HTTP/1.1') {
          //console.log(clientFirstLine[2] + " detected.");
          socket.write(responseSuccess + serverHTTPHeaders + '\n' + messageBody);
        }
      }
    }
    else {
      socket.write("Only GET method has been implemented so far.");
      throw new Error("Only GET method has been implemented so far.");
    }
    clientHeaderLines = data.toString().split('\n').splice(1);
    //console.log(clientHeaderLines);

    console.log(('SERVER BCAST FROM ' + socketAddress + ":" + socket.remotePort + ": " + data).replace(/(\r\n|\n|\r)/gm,""));
  });
});

server.listen(CONFIG.PORT, function () {
  var PORT = server.address().port;
  var serverNow = new Date();
  console.log('Server listening on 127.0.0.1:' + CONFIG.PORT);
  serverHTTPHeaders = '\nServer: localhost\n' +
                      'Date: ' + serverNow.toUTCString() + '\n';
});

server.on('error', function (err) {
  throw err;
});


