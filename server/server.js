const net = require('net');
const responseBuilder = require('./utils.js');
const logger = require('./logger.js');

const port = 8080;

const users = {};
const Rooms = {};
const server = new net.Server();
let username = '';
server.listen(port, () => {
    logger(`Server listening on port ${port}\n`);
});

server.on('connection', (socket) => {
    let response = {};
    logger('Client Connected\n');
    socket.on('data', (data) => {
        try {
            response = JSON.parse(data);
        } catch (e) {
            logger(`Unexpected input from socket. input: ${data}`);
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
        logger(`Error: ${err}`);
    });
});
