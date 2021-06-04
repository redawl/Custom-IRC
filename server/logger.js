const fs = require('fs');
const consoleOut = require('../commonutils');

module.exports = (readline, data) => {
    const date = new Date();
    const dateString = `${date.getFullYear()}-${('0' + (date.getMonth()
        + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

    consoleOut(readline, `[${dateString}] -- ${data}`);
    fs.appendFile('../logs/server.log', `[${dateString}] -- ${data}\n`,
        (err) => {
            if (err) {
                consoleOut(readline, `Make sure you are running the server while inside the server directory!\n${err}`);
            }
        });
};
