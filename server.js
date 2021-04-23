const net = require('net');
const port = 8080;

const server = new net.Server();

server.listen(port, function() {
    console.log("Server listening\n");
});

server.on('connection', function(socket) {
    console.log("Client Connected\n");

    socket.write("Hello from the server\n");

    socket.on('data', function(chunk) {
        console.log(`Data from client: ${chunk.toString()}`);
    });

    socket.on('end', function() {
        console.log("client connection closed\n");
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});
