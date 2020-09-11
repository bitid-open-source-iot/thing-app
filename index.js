var Q = require('q');
var cors = require('cors');
var http = require('http');
var gpio = require('./lib/gpio');
var express = require('express');
var settings = require('./config.json');
var bodyParser = require('body-parser');

global.__base = __dirname + '/';
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

                app.use((err, req, res) => {
                    portal.error.error.code = 500;
                    portal.error.error.message = 'Something broke';
                    portal.error.error.errors[0].code = 500;
                    portal.error.error.errors[0].message = 'Something broke';
                    portal.error.hiddenErrors.push(err.stack);
                    __responder.error(req, res, portal.error);
                });

                http.createServer(app).listen(__settings.port);
                console.log('server started on port: ' + __settings.port);
                deferred.resolve();
            } catch (e) {
                console.log('initAPI catch error: ' + e);
            };

            return deferred.promise;
        },

        init: () => {
            var deferred = Q.defer();

            portal.api({})
                .then(args => {
                    gpio.test();
                    deferred.resolve(args);
                }, err => {
                    deferred.reject(err);
                });

            return deferred.promise;
        }
    };

    portal.init();
} catch (error) {
    console.log('The following error has occurred: ' + error.message);
};

exports.module = module;