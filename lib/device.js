const Q = require('q');
const os = require('os');
const localIp = require('ip');
const publicIp = require('public-ip');
const MacAddress = require('macaddress');
const EventEmitter = require('events').EventEmitter;
const ErrorResponse = require('./error-response');

class Device extends EventEmitter {

    constructor() {
        super();

        this.init = async () => {
            this.ip = {
                'local': localIp.address(),
                'public': await publicIp.v4()
            };
    
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
        
        this.start = () => {
            var deferred = Q.defer();
    
            try {
                this.init();
                deferred.resolve();
            } catch (error) {
                var err = new ErrorResponse();
                err.error.errors[0].code = 503;
                err.error.errors[0].reason = error.message;
                err.error.errors[0].message = error.message;
                __logger.error(error.message);
                deferred.reject(err);
            };
    
            return deferred.promise;
        };

        this.init();
    };

};

module.exports = Device;