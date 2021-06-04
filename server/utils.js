const Room = require('./Room.js');
const logger = require('./logger.js');

function initialBuilder(response, Rooms, users, socket, readline) {
    logger(readline, `adding client [${response.username}]`);
    users[response.username] = socket;
    socket.write('You are connected');
}

function messageBuilder(response, Rooms, users, socket, readline) {
    if (response.room in Rooms && Rooms[response.room].checkUser(response.username)) {
        Rooms[response.room].broadcast(`${response.username}: ${response.message}`);
        logger(readline, `Message sent to ${response.room}`);
    } else if (!(response.room in Rooms)) {
        socket.write('No room with that name');
        logger(readline, 'Message sent to invalid room');
    } else {
        socket.write(`Not in Room ${response.room}! Use /joinroom:${response.room} to join\n`);
        logger(readline, 'User not in that room\n');
    }
}

function addroomBuilder(response, Rooms, users, socket, readline) {
    if (!(response.name in Rooms)) {
        Rooms[response.name] = new Room();
        socket.write(`Added room ${response.name}`);
        logger(readline, `Added room ${response.name}`);
    } else {
        socket.write(`${response.name} alread in use. Please choose another name\n`);
        logger(readline, 'Room name already in use\n');
    }
}

function leaveroomBuilder(response, Rooms, users, socket, readline) {
    if (response.room in Rooms) {
        const toLeave = Rooms[response.room];
        toLeave.removeClient(response.username);
        toLeave.broadcast(`${response.username} has left the chat`);
        socket.write(`Left room ${response.room}`);
        logger(readline, `${response.username} has left room ${response.room}`);
    } else {
        socket.write(`No room ${response.room}`);
        logger(readline, 'Leave room failed!');
    }
}

function joinroomBuilder(response, Rooms, users, socket, readline) {
    if (response.room in Rooms) {
        const toJoin = Rooms[response.room];
        toJoin.addClient(response.username, users[response.username]);
        toJoin.broadcast(`${response.username} has joined the chat`);
        logger(readline, `${response.username} joined room ${response.room}`);
    } else {
        socket.write(`Room ${response.room} does not exist!`);
        logger(readline, 'Add room failed!');
    }
}

function listusersBuilder(response, Rooms, users, socket, readline) {
    if (response.room in Rooms) {
        socket.write(`== Users in ${response.room} ==`);
        socket.write(Rooms[response.room].listClients());
    } else {
        logger(readline, `Listing requested for invalid room ${response.room}\n`);
        socket.write(`There is no room ${response.room}!\n`);
    }
}

function listroomsBuilder(response, Rooms, users, socket, readline) {
    logger(readline, 'Room list requested\n');
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
