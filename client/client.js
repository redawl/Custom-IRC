const net = require('net');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});
const consoleOut = require('../commonutils');

const port = 8080;
const host = 'localhost';

const client = new net.Socket();

function chat(username) {
    readline.question(`${username}> `, (answer) => {
        if (answer[0] !== '/') {
            const parsedanswer = answer.split(':', 2);
            const response = {};
            response.type = 'message';
            [response.room, response.message] = parsedanswer;
            response.username = username;
            client.write(JSON.stringify(response));
            chat(username);
        } else if (answer === '/quit') {
            consoleOut(readline, 'Quitting');
            readline.close();
            client.end();
        } else {
            let command = '';
            let value = '';
            [command, value] = answer.split(':', 2);
            const response = {};
            if (command === '/addroom') {
                response.type = 'addroom';
                response.name = value;
                response.username = username;
                client.write(JSON.stringify(response));
            } else if (command === '/leaveroom') {
                response.type = 'leaveroom';
                response.room = value;
                response.username = username;
                client.write(JSON.stringify(response));
            } else if (command === '/joinroom') {
                response.type = 'joinroom';
                response.room = value;
                response.username = username;
                client.write(JSON.stringify(response));
            } else if (command === '/listusers') {
                response.type = 'listusers';
                response.room = value;
                response.username = username;
                client.write(JSON.stringify(response));
            } else if (command === '/listrooms') {
                response.type = 'listrooms';
                response.username = username;
                client.write(JSON.stringify(response));
            } else if (command === '/help') {
                consoleOut(readline, '== OPTIONS ==\n'
                + '/addroom:ROOM   > add room ROOM\n'
                + '/joinroom:ROOM  > join room ROOM\n'
                + '/listrooms      > list available rooms\n'
                + '/listusers:ROOM > list users in room ROOM\n'
                + '/quit           > quit application\n'
                + 'ROOM:MESSAGE    > send message MESSAGE to room ROOM\n'
                + '/help           > display this help menu');
            }
            chat(username);
        }
    });
}

client.connect({ port, host }, () => {
    const data = {};
    consoleOut(readline, 'Connected to server\n');
    readline.question('Specify username\n>', (answer) => {
        data.type = 'initial';
        data.username = answer;
        client.write(JSON.stringify(data));
        consoleOut(readline, `Set username to ${answer}`);
        consoleOut(readline, 'type "/help" for info on how to use IRC');
        chat(answer);
    });
});

client.on('data', (chunk) => {
    consoleOut(readline, chunk.toString());
});

client.on('end', () => {
    console.log('\nDisconnected from server');
});
