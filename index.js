const Q = require('q');
const cors = require('cors');
const http = require('http');
const device = require('./lib/device');
const parser = require('body-parser');
const express = require('express');
const ErrorResponse = require('./lib/error-response');
const ConfigSocket = require('./sockets/config');
const ControlSocket = require('./sockets/control');

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
                app.use(parser.urlencoded({
                    'limit': '50mb',
                    'extended': true
                }));
                app.use(parser.json({
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
                        const config = new ConfigSocket(__settings.sockets.config);
                        config.on('data', async (event) => {
                            __logger.warn('Config Socket Data: ', event);
                        });
                        config.on('connect', async (event) => {
                            __logger.info('Config Socket Connecting');
                        });
                        config.on('disconnect', async (event) => {
                            __logger.error('Config Socket Disconnected');
                        });
                        const control = new ControlSocket(__settings.sockets.control);
                        control.on('data', async (event) => {
                            __logger.warn('Config Socket Data: ', event);
                        });
                        control.on('connect', async (event) => {
                            __logger.info('Config Socket Connecting');
                        });
                        control.on('disconnect', async (event) => {
                            __logger.error('Config Socket Disconnected');
                        });
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