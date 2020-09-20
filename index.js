var Q = require('q');
var io = require('./lib/io');
var cors = require('cors');
var http = require('http');
var logger = require('./lib/logger');
var device = require('./lib/device');
var express = require('express');
var settings = require('./config.json');
var bodyParser = require('body-parser');
var ErrorResponse = require('./lib/error-response');

global.__io = new io();
global.__base = __dirname + '/';
global.__logger = logger;
global.__device = new device();
global.__settings = settings;

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

            portal.api({})
                // .then(__device.start, null)
                .then(() => {
                    __logger.info('Starting Inputs');
                    // __settings.inputs.map(input => __io.add(input));
                    __logger.info('Init Complete');
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