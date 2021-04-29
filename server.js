const net = require('net');
const port = 8080;

users = new Object();

const server = new net.Server();

server.listen(port, function() {
    console.log("Server listening\n");
});

server.on('connection', function(socket) {
    console.log("Client Connected\n");
    socket.on('data', function(chunk) {
        response = JSON.parse(chunk);
        if(!("message" in response)){
            console.log(`Adding client [${JSON.parse(chunk)["username"]}]`);
            users[JSON.parse(chunk)["username"]] = socket;
            socket.write(`You are connected: Users to message: `);
            for(var key in users) 
                socket.write(key);
        }
        else{
            if(response["username"] in users)
                users[response["username"]].write(response["message"]);
            else
                socket.write("No user with that name");
        }

    });

    socket.on('end', function() {
        for(var key in users){
            if(users[key] === socket)
                delete users[key];
        }
        console.log("client connection closed\n");
    });

    socket.on('error', function(err) {
        console.log(`Error: ${err}`);
    });
});
