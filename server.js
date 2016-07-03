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
  var finalOutput = " ";
  var socketAddress = socket.address().address;
  var socketPort = socket.remotePort;
  var clientFirstLine = [];
  var clientHeaderLines = [];
  console.log("CONNECTED: " + socketAddress + ":" + socketPort);
  var method;

  socket.on('data', function(data) {
    clientFirstLine = data.toString().split(' ').splice(0, 3);
    // if(clientFirstLine[2] !== 'HTTP/1.1') {
    //   throw new Error("Missiing or incorrect HTTP version.");
    // }

    if(clientFirstLine[0] === 'GET') {
      if (clientFirstLine[1] != "/index.html" && clientFirstLine[1] != "/") {
        filename = clientFirstLine[1];
        fs.exists('./public' + filename, function(exists) {
          if(exists) {
            console.log("filename: " + filename);
            fs.readFile('./public' + filename, function (err, messageBody) {
              if(err) throw err;
              socket.write(responseSuccess + serverHTTPHeaders + '\n' + messageBody);
            });
          }
          else {
            fs.readFile('./public/404.html', function (err, messageBody) {
              if(err) throw err;
              socket.write(notFound + serverHTTPHeaders + '\n' + messageBody);
            });
          }
        });
      }
      else {
        fs.readFile('./public/index.html', function(err, messageBody) {
          socket.write(notFound + serverHTTPHeaders + '\n' + messageBody);
        });
      }
    }
    else if(clientFirstLine[0] === 'HEAD'){
      if(clientFirstLine[1][0] === '/') {
        if (clientFirstLine[1].length === 1) {
          filename = "index.html";
          messageBody = fs.readFileSync('./public/' + filename).toString();
        }
        else {
          filename = clientFirstLine[1].slice(1).toString();
          try {
            messageBody = fs.readFileSync('./public/' + filename).toString();
          }
          catch (err){
            socket.write(notFound + serverHTTPHeaders + '\n' + messageBody);
            throw new Error(notFound);
          }
        }
        // assume index.html always exists
        if(clientFirstLine[2] === 'HTTP/1.1') {
          socket.write(responseSuccess + serverHTTPHeaders);
        }
      }
    }
    else{
      socket.write("Only GET & HEAD method has been implemented so far.");
      throw new Error("Only GET & HEAD method has been implemented so far.");
    }
    clientHeaderLines = data.toString().split('\n').splice(1);
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
