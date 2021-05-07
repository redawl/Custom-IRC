module.exports = class Room {
    constructor() { this.clients = []; }

    addClient(name, socket) {
        this.clients[name] = socket;
    }

    removeClient(name) {
        if (name in this.clients) delete this.clients[name];
    }

    listClients() {
        let ret = '';
        Object.keys(this.clients).forEach((client) => {
            ret += `${client}\n`;
        });
        return ret;
    }

    broadcast(message) {
        Object.keys(this.clients).forEach((client) => {
            this.clients[client].write(message);
        });
    }
};
