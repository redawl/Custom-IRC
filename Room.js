module.exports = class Room{
    constructor(){ this.clients = new Object(); }
    add_client(name, socket){
        this.clients[name] = socket;
    }

    remove_client(name){
        delete this.clients[name];
    }

    list_clients(){
        let ret = "";
        for(var client in this.clients){
            ret = ret + client + "\n";
        }
        return ret;
    }

    broadcast(message){
        for(var client in this.clients){
            this.clients[client].write(message);
        }
    }
}

