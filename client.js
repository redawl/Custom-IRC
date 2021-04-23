const net = require('net');

const port = 8080;
const host = 'localhost';

const client = new net.Socket();

client.connect({port: port, host: host}, function() {
    console.log("Connected to server\n");

    client.write('Hello, server. ');
});

client.on('data', function(chunk) {
    console.log(`Recieved from server: ${chunk.toString()}`);

    client.end();
});

client.on('end', function() {
    console.log("Ended conversation");
});
