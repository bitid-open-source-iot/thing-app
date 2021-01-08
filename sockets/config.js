const WebSocket = require('ws');
const EventEmitter = require('events').EventEmitter;

class ConfigSocket extends EventEmitter {

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
            this.emit('data', event.data);
        });
    };

}

module.exports = ConfigSocket;