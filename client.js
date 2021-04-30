const net = require('net');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

function console_out(msg) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(msg);
    readline.prompt(true);
}

const port = 8080;
const host = 'localhost';

data = new Object();

const client = new net.Socket();

client.connect({port: port, host: host}, function() {
    console_out("Connected to server\n");
    readline.question('Specify username\n>', (answer) => {
        data["type"] = "initial";
        data["username"] = answer;
        client.write(JSON.stringify(data));
        console_out(`Set username to ${answer}`);
        chat(client, readline, answer);
    });

});

client.on('data', function(chunk) {
    console_out(chunk.toString());
});

client.on('end', function() {
    console.log("\nEnded conversation");
});


function chat(client, readline, username) {
    readline.question(`${username}> `, (answer) => {
        if(answer[0] !== '/')
        {
            parsedanswer = answer.split(":", 2);
            response = new Object();
            response["type"] = "message";
            response["room"] = parsedanswer[0];
            response["message"] = parsedanswer[1];
            response["username"] = username;
            client.write(JSON.stringify(response));
            chat(client, readline, username);
        }
        else{
            if(answer === "/quit"){
                console_out("Quitting");
                client.end();
                readline.close();
            }
            else{
                parsedanswer = answer.split(":", 2);
                response = new Object();
                if(parsedanswer[0] === "/addroom"){
                    response["type"] = "addroom";
                    response["name"] = parsedanswer[1];
                    response["username"] = username;
                    client.write(JSON.stringify(response));
                }
                else if(parsedanswer[0] === "/leaveroom"){
                    response["type"] = "leaveroom";
                    response["room"] = parsedanswer[1];
                    response["username"] = username;
                    client.write(JSON.stringify(respose));
                }
                else if(parsedanswer[0] === "/joinroom"){
                    response["type"] = "joinroom";
                    response["room"] = parsedanswer[1];
                    response["username"] = username;
                    client.write(JSON.stringify(response));
                }
                else if(parsedanswer[0] === "/listusers"){
                    response["type"] = "listusers";
                    response["room"] = parsedanswer[1];
                    response["username"] = username;
                    client.write(JSON.stringify(response));
                }
                else if(parsedanswer[0] === "/listrooms"){
                    response["type"] = "listrooms";
                    response["username"] = username;
                    client.write(JSON.stringify(response));
                }
                chat(client, readline, username);
            }
        }
    });
}
