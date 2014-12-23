var server;
var Lab = require('lab');
var Code = require('code');
var Hapi = require('hapi');
var Bell = require('bell');
var config = require('./test_config.json');
var Cookie = require('hapi-auth-cookie');
var routes = require('../server/routes');
var Dulcimer = require('dulcimer');
Dulcimer.connect({type: 'level', path: './db'});

var lab = exports.lab = Lab.script();
var expect = Code.expect;

lab.experiment('main tests', function () {
    lab.before(function (done) {
        server = new Hapi.Server();

        server.connection({ 
            host: config.hostname, 
            port: config.port 
        });

        server.views({
            engines: { jade: require('jade') },
            path: __dirname + '../../templates'
        });

        server.register([Bell, Cookie], function (err) {

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
            });

            server.route(routes(server));

            if (err) {
                process.stderr.write('Error setting up tests', err, '\n');
                process.exit(1);
            }

            done();

        });

    });

    lab.test('load home page', function (done) {
        var options = {
            method: 'GET',
            url: '/'
        };
     
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

});    