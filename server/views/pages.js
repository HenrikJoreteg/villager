var models = require('../models').models;
var async = require('async');
var _ = require('underscore');

module.exports = {

    index: function (request, reply) {
        //console.log('\n====in pages.js request.auth%j', request.auth);
        if (request.auth.isAuthenticated && request.auth.credentials.userid) {
            var session = request.auth.credentials;
            models.Log.all(function(err, log) {
                if (err) { console.log(err); }
                reply.view('index', {
                    log       : log,
                    fullName  : session.fullName,
                    avatar    : session.avatar,
                    userid    : session.userid,
                    moderator : session.moderator,
                    admin     : session.admin
                });
            });
        }
        else { reply.view('index'); }
    },

    tinker: function (request, reply) {
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

    notFound: function (request, reply) {
        reply('404');
    },

};