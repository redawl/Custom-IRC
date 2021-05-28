const net = require('net');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
const responseBuilder = require('./utils');
const logger = require('./logger');
const consoleOut = require('../commonutils');

const port = 8080;
const users = {};
const Rooms = {};
const server = new net.Server();
let username = '';

function console() {
    readline.question('server> ', (answer) => {
        if (answer === '/shutdown') {
            Object.keys(users).forEach((user) => {
                users[user].write('<ALERT> Server shutting down <ALERT>\n');
                users[user].end();
            });
            server.close();
        } else {
            let command = '';
            let input = '';
            [command, input] = answer.split(':', 2);
            if (command === '/kick') {
                users[input].write('<ALERT> You have been kicked <ALERT>\n');
                users[input].end();
            }
        }

        if (answer !== '/shutdown') {
            console();
        }
    });
}
server.listen(port, () => {
    logger(readline, `Server listening on port ${port}\n`);
    console();
});

server.on('connection', (socket) => {
    let response = {};
    logger(readline, 'Client Connected\n');
    socket.on('data', (data) => {
        try {
            response = JSON.parse(data);
        } catch (e) {
            logger(readline, `Unexpected input from socket. input: ${data}`);
            return;
        }
        username = response.username;
        responseBuilder[response.type](response, Rooms, users, socket, readline);
    });

    socket.on('end', () => {
        Object.keys(Rooms).forEach((room) => {
            Rooms[room].removeClient(username);
        });
        delete users[username];
        consoleOut(readline, 'client connection closed\n');
    });

    socket.on('error', (err) => {
        logger(readline, `Error: ${err}`);
    });
});
