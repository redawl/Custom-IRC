const net = require('net');
const Room = require('./Room');

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
            console.log('Unexpected input from socket. input: '
            + `${data}`);
            return;
        }
        username = response.username;
        if (response.type === 'initial') {
            console.log(`Adding client [${username}]`);
            users[username] = socket;
            socket.write('You are connected');
        } else if (response.type === 'message') {
            if (response.room in Rooms) {
                Rooms[response.room].broadcast(`${username}: ${response.message}`);
                console.log(`Message sent to ${response.room}`);
            } else {
                socket.write('No room with that name');
                console.log('Message sent to invalid room');
            }
        } else if (response.type === 'addroom') {
            Rooms[response.name] = new Room();
            socket.write(`Added room ${response.name}`);
            console.log(`Added room ${response.name}`);
        } else if (response.type === 'leaveroom') {
            if (response.room in Rooms) {
                const toLeave = Rooms[response.room];
                toLeave.removeClient(response.username);
                toLeave.broadcast(`${response.username} has left the chat`);
                socket.write(`Left room ${response.room}`);
                console.log(`${username} left room ${response.room}`);
            } else {
                socket.write(`No room ${response.room}`);
                console.log('Leave room failed!');
            }
        } else if (response.type === 'joinroom') {
            if (response.room in Rooms) {
                const toJoin = Rooms[response.room];
                toJoin.addClient(response.username, users[response.username]);
                toJoin.broadcast(`${response.username} has joined the chat`);
                console.log(`${username} joined room ${response.room}`);
            } else {
                socket.write(`Room ${response.room} does not exist!`);
                console.log('Add room failed!');
            }
        } else if (response.type === 'listusers') {
            socket.write(`== Users in ${response.room}==`);
            socket.write(Rooms[response.room].listClients());
        } else if (response.type === 'listrooms') {
            socket.write('== Rooms ==');
            Object.keys(Rooms).forEach((key) => {
                socket.write(`${key}\n`);
            });
        }
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
