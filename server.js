const net = require('net');
const Room = require('./Room');
const port = 8080;

users = new Object();
Rooms = new Object();
const server = new net.Server();

server.listen(port, function() {
    console.log("Server listening\n");
});

server.on('connection', function(socket) {
    console.log("Client Connected\n");
    socket.on('data', function(chunk) {
        response = JSON.parse(chunk);
        username = response["username"];
        if(response["type"] === "initial"){
            console.log(`Adding client [${username}]`);
            users[username] = socket;
            socket.write(`You are connected`);
        }
        if(response["type"] === "message"){
            if(response["room"] in Rooms)
                Rooms[response["room"]].broadcast(`${response["room"]}: ${response["message"]}`);
            else
                socket.write("No user with that name");
        }
        else if(response["type"] === "addroom"){
            Rooms[response["name"]] = new Room();
            socket.write(`Added room ${response["name"]}`);
        }
        else if(response["type"] === "joinroom"){
            Rooms[response["room"]].add_client(response["username"], users[response["username"]]);
            Rooms[response["room"]].broadcast(`${response["username"]} has joined the chat`);
        }

    });

    socket.on('end', function() {
        delete users[username];
        console.log("client connection closed\n");
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});
