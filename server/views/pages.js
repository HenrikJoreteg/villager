var models = require('../models').models;
var async = require('async');
var _ = require('underscore');

exports.index = {
    auth: 'session',
    handler: function (request, reply) {
        if (request.auth.isAuthenticated && request.auth.credentials.userid) {
            var session = request.auth.credentials;
            reply.view('index', {
                fullName  : session.fullName,
                avatar    : session.avatar,
                userid    : session.userid,
                moderator : session.moderator,
                admin     : session.admin
            });
        }
        else { reply.view('index'); }
    }
};

exports.tinker = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            interests: function (done) {
                models.Interest.all(done);
            },
            groupCategories: function (done) {
                models.GroupCategory.all(done);
            },
            placeCategories: function (done) {
                models.PlaceCategory.all(done);
            }
        }, function (err, context) {
            if (err) { throw err; }
            context = _.extend(context, {
                fullName  : session.fullName,
                avatar    : session.avatar,
                userid    : session.userid,
                moderator : session.moderator,
                admin     : session.admin
            });
            reply.view('tinker/tinker', context);
        });
    },
};

exports.notFound = {
    handler: function (request, reply) {
        reply('404');
    },
}