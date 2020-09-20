var Q = require('q');
var Gpio = require('onoff').Gpio;
var cors = require('cors');
var http = require('http');
var device = require('./lib/device');
var express = require('express');
var bodyParser = require('body-parser');
var ErrorResponse = require('./lib/error-response');

global.__base = __dirname + '/';
global.__logger = require('./lib/logger');
global.__settings = require('./config.json');

try {
    var portal = {
        api: () => {
            var deferred = Q.defer();

            try {
                var app = express();
                app.use(cors());
                app.use(bodyParser.urlencoded({
                    'limit': '50mb',
                    'extended': true
                }));
                app.use(bodyParser.json({
                    'limit': '50mb'
                }));

                app.use('/', express.static(__dirname + '/app/dist/admin/'));
                app.get('/*', (req, res) => {
                    res.sendFile(__dirname + '/app/dist/admin/index.html');
                });

                app.use('/device', require('./api/device'));
                __logger.info('Loaded: ./api/device');

                app.use((error, req, res) => {
                    var err = ErrorResponse();
                    err.error.code = 500;
                    err.error.message = error.message;
                    err.error.errors[0].code = 500;
                    err.error.errors[0].reason = error.message;
                    err.error.errors[0].message = error.message;
                    __responder.error(req, res, err);
                });

                http.createServer(app).listen(__settings.port);
                __logger.info('server started on port: ' + __settings.port);
                deferred.resolve();
            } catch (error) {
                __logger.error(error.message);
            };

            return deferred.promise;
        },

        init: () => {
            __logger.init();
            __logger.info('Starting Device');

            portal.api({})
                .then(async () => {
                    const ip = await device.ip();
                    const os = await device.os();
                    const id = await device.id();

                    try {
                        __logger.info("Started Adding IO");
                        const temperature = new Gpio(11, 'out');

                        setInterval(async () => __logger.info(temperature.readSync()), 1000);

                        __logger.info("Finished Adding IO");
                    } catch (error) {
                        __logger.error(error.message);
                    };

                    __logger.info('Device Startup Complete');
                }, err => {
                    __logger.error(err);
                });

        }
    };

    portal.init();
} catch (error) {
    console.log('The following error has occurred: ' + error.message);
};

exports.module = module;