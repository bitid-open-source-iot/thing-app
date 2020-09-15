var os = require('os');
var MacAddress = require('macaddress');
var EventEmitter = require('events').EventEmitter;

class Device extends EventEmitter {

    constructor() {
        super();

        this.barcode = null;
        this.platform = os.platform();

        MacAddress.one((err, mac) => {
            if (err) {
                __logger.error(err.message);
            } else {
                this.barcode = mac.split(':').join('');
                __logger.info(this.barcode);
            };
        });
    };

};

module.exports = Device;