const Q = require('q');
const OS = require('os');
const IO = require('./io');
const MacAddress = require('macaddress');
const ErrorResponse = require('./error-response');
const EventEmitter = require('events').EventEmitter;

class Device extends EventEmitter {

    constructor() {
        super();

        this.io = new IO();;
        this.barcode = null;
        this.platform = OS.platform();

        MacAddress.one((err, mac) => {
            if (err) {
                __logger.error(err.message);
            } else {
                this.barcode = mac.split(':').join('');
                __logger.info(this.barcode);
            };
        });
        
        this.start = () => {
            var deferred = Q.defer();
    
            try {
                __settings.inputs.map(input => this.io.add(input));
                deferred.resolve();
            } catch (error) {
                __logger.error(error.message);
                var err = new ErrorResponse();
                err.error.errors[0].code = 503;
                err.error.errors[0].reason = error.message;
                err.error.errors[0].message = error.message;
                deferred.reject(err);
            };
    
            return deferred.promise;
        };
    };

};

module.exports = Device;