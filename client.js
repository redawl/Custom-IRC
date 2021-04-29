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
        data["username"] = answer;
        console_out(`Set username to ${answer}`);
        readline.question('Specify room\n> ', (answer) => {
            data["room"] = answer;
            console_out(`Set room to ${answer}`);
            client.write(JSON.stringify(data));
            chat(client, readline);
        });
    });

});

client.on('data', function(chunk) {
    console_out(`Recieved from server: ${chunk.toString()}`);
});

client.on('end', function() {
    console_out("Ended conversation");
});


function chat(client, readline) {
    readline.question(">", (answer) => {
        if(answer !== "Quit")
        {
            parsedanswer = answer.split(":", 2);
            response = new Object();
            response["username"] = parsedanswer[0];
            response["message"] = parsedanswer[1];
            client.write(JSON.stringify(response));
            chat(client, readline);
        }
        else{
            console_out("Quitting");
            client.end();
            readline.close();
        }
    });
}
