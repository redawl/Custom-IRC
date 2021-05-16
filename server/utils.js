const Room = require('./Room.js');
const logger = require('./logger.js');

function initialBuilder(response, Rooms, users, socket) {
    logger(`adding client [${response.username}]`);
    users[response.username] = socket;
    socket.write('You are connected');
}

function messageBuilder(response, Rooms, users, socket) {
    if (response.room in Rooms) {
        Rooms[response.room].broadcast(`${response.username}: ${response.message}`);
        logger(`Message sent to ${response.room}`);
    } else {
        socket.write('No room with that name');
        logger('Message sent to invalid room');
    }
}

function addroomBuilder(response, Rooms, users, socket) {
    Rooms[response.name] = new Room();
    socket.write(`Added room ${response.name}`);
    logger(`Added room ${response.name}`);
}

function leaveroomBuilder(response, Rooms, users, socket) {
    if (response.room in Rooms) {
        const toLeave = Rooms[response.room];
        toLeave.removeClient(response.username);
        toLeave.broadcast(`${response.username} has left the chat`);
        socket.write(`Left room ${response.room}`);
        logger(`${response.username} has left room ${response.room}`);
    } else {
        socket.write(`No room ${response.room}`);
        logger('Leave room failed!');
    }
}

function joinroomBuilder(response, Rooms, users, socket) {
    if (response.room in Rooms) {
        const toJoin = Rooms[response.room];
        toJoin.addClient(response.username, users[response.username]);
        toJoin.broadcast(`${response.username} has joined the chat`);
        logger(`${response.username} joined room ${response.room}`);
    } else {
        socket.write(`Room ${response.room} does not exist!`);
        logger('Add room failed!');
    }
}

function listusersBuilder(response, Rooms, users, socket) {
    socket.write(`== Users in ${response.room} ==`);
    socket.write(Rooms[response.room].listClients());
}

function listroomsBuilder(response, Rooms, users, socket) {
    socket.write('== Rooms ==');
    Object.keys(Rooms).forEach((key) => {
        socket.write(`${key}\n`);
    });
}

module.exports = {
    initial: initialBuilder,
    message: messageBuilder,
    addroom: addroomBuilder,
    leaveroom: leaveroomBuilder,
    joinroom: joinroomBuilder,
    listusers: listusersBuilder,
    listrooms: listroomsBuilder,
};
