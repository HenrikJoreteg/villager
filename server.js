var Hapi = require('hapi');
var Bell = require('bell');
var config = require('getconfig');
var Cookie = require('hapi-auth-cookie');
var models = require('./server/models');
var routes = require('./server/routes');
var level = require('level');
var db = level('./db', { valueEncoding: 'json' });

models.attachDB(db);

var server = new Hapi.Server();

server.connection({ 
    host: config.hostname, 
    port: config.port 
});

server.route(routes(server));

var serverOptions = {
    views: {
        path: 'templates',
        engines: { jade: 'jade' }
    }
};

server.register([Bell, Cookie], function (err) {

    if (err) {
        throw err;
    }

    server.auth.strategy('twitter', 'bell', {
        provider: 'twitter',
        password: config.auth.twitter.password,
        isSecure: false,
        clientId: config.auth.twitter.clientId,
        clientSecret: config.auth.twitter.clientSecret
    });

    server.auth.strategy('session', 'cookie', {
        password: config.session.cookieOptions.password,
        cookie: 'sid',
        redirectTo: '/login',
        redirectOnTry: false,
        isSecure: false
    })
    
    server.start(function (err) {
        console.log('triciti.es running at:', server.info.uri);
    });
});

if (process.env.DEBUG) {
    server.on('internalError', function (event) {
        console.log('um', event);
    });
}