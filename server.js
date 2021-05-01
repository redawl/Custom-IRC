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
        else if(response["type"] === "message"){
            if(response["room"] in Rooms){
                Rooms[response["room"]].broadcast(`${username}: ${response["message"]}`);
            console.log(`Message sent to ${response["room"]}`);    
            }
            else{
                socket.write("No room with that name");
                console.log("Message sent to invalid room");
            }
        }
        else if(response["type"] === "addroom"){
            Rooms[response["name"]] = new Room();
            socket.write(`Added room ${response["name"]}`);
            console.log(`Added room ${response["name"]}`);
        }
        else if(response["type"] === "leaveroom"){
            to_leave = Rooms[response["room"]];
            to_leave.remove_client(response["username"]);
            to_leave.broadcast(`${response["username"]} has left the chat`);
            console.log(`${username} left room ${response["room"]}`);
        }
        else if(response["type"] === "joinroom"){
            to_join = Rooms[response["room"]];
            to_join.add_client(response["username"], users[response["username"]]);
            to_join.broadcast(`${response["username"]} has joined the chat`);
            console.log(`${username} joined room ${response["room"]}`);
        }
        else if(response["type"] === "listusers"){
            socket.write(`== Users in ${response["room"]}==`);
            socket.write(Rooms[response["room"]].list_clients());
        }
        else if(response["type"] === "listrooms"){
            socket.write("== Rooms ==");
            for(var key in Rooms)
                socket.write(key + "\n");
        }

    });

    socket.on('end', function() {
        for(var room in Rooms) Rooms[room].remove_client(username);
        delete users[username];
        console.log("client connection closed\n");
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});
