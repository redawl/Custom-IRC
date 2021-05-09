const net = require('net');
const responseBuilder = require('./utils.js');

const port = 8080;

const users = {};
const Rooms = {};
const server = new net.Server();
let username = '';
server.listen(port, () => {
    console.log('Server listening\n');
});

server.on('connection', (socket) => {
    let response = {};
    console.log('Client Connected\n');
    socket.on('data', (data) => {
        try {
            response = JSON.parse(data);
        } catch (e) {
            console.log(`Unexpected input from socket. input: ${data}`);
            return;
        }
        username = response.username;
        responseBuilder[response.type](response, Rooms, users, socket);
    });

    socket.on('end', () => {
        Object.keys(Rooms).forEach((room) => {
            Rooms[room].removeClient(username);
        });
        delete users[username];
        console.log('client connection closed\n');
    });

    socket.on('error', (err) => {
        console.log(`Error: ${err}`);
    });
});
