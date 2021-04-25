const net = require('net');
const port = 8080;

users = new Object();
users["::ffff:50.38.61.81"] = 'Laptop';
users["::ffff:127.0.0.1"] = 'linux.cecs';

const server = new net.Server();

server.listen(port, function() {
    console.log("Server listening\n");
});

server.on('connection', function(socket) {
    console.log("Client Connected\n");

//    socket.write(`Hello from the server ${users[socket.remoteAddress]}\n`);

    socket.on('data', function(chunk) {
        console.log(`Data from client: ${JSON.parse(chunk)["username"]}, room ${JSON.parse(chunk)["room"]}`);
        socket.write(`Hello from the server ${users[socket.remoteAddress]}\n`);

    });

    socket.on('end', function() {
        console.log("client connection closed\n");
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});
