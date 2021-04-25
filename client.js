const net = require('net');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

const port = 8080;
const host = 'localhost';

data = new Object();

const client = new net.Socket();

client.connect({port: port, host: host}, function() {
    console.log("Connected to server\n");

    readline.question('Specify username >> ', (answer) => {
        data["username"] = answer;
        console.log(`Set username to ${answer}`);
        readline.question('Specify room >> ', (answer) => {
            data["room"] = answer;
            console.log(`Set room to ${answer}`);
            client.write(JSON.stringify(data));
            client.end();
            readline.close();
        });
    });

});

client.on('data', function(chunk) {
    console.log(`Recieved from server: ${chunk.toString()}`);
});

client.on('end', function() {
    console.log("Ended conversation");
});
