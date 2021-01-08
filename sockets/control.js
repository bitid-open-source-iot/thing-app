const WebSocket = require('ws');
const EventEmitter = require('events').EventEmitter;

class ControlSocket extends EventEmitter {

    constructor(url) {
        super();

        this.ws = new WebSocket(url);

        this.ws.on('open', async (event) => {
            this.emit('connect', event);
        });

        this.ws.on('close', async (event) => {
            this.emit('disconnect', event);
        });

        this.ws.on('message', async (event) => {
            this.emit('data', event);
        });
    };

}

module.exports = ControlSocket;