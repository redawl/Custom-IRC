const fs = require('fs');

module.exports = (data) => {
    const date = new Date();
    const dateString = date.getFullYear() + '-' + ('0' + (date.getMonth() +
1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2) + ' ' + date.getHours() +
':' + date.getMinutes() + ':' + date.getSeconds();

    console.log('[' + dateString + '] -- ' + data);
    fs.appendFile('../logs/server.log', '[' + dateString + '] -- ' + data + '\n', 
        (err) => { if (err) console.log(err); });
};
