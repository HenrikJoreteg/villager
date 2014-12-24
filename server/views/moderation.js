var models = require('../models').models;
var _ = require('underscore');
var async = require('async');

exports.listPending = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        async.parallel({
            people: function (done) {
                models.User.all(done);
            },
            places: function (done) {
                models.Place.all(done);
            },
            groups: function (done) {
                models.Group.all(done);
            }
        }, function (err, context) {
            if (session.moderator === true) {
                var pendingPeople = _.where(context.people[0], { approved: false });
                var pendingPlaces = _.where(context.places[0], { approved: false });
                var pendingGroups = _.where(context.groups[0], { approved: false });
                if(pendingPeople.length + pendingPlaces.length + pendingGroups.length === 0) {
                    reply.view('noPending', {
                        fullName  : session.fullName,
                        avatar    : session.avatar,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                }
                else {
                    reply.view('listPending', {
                        people    : pendingPeople,
                        places    : pendingPlaces,
                        groups    : pendingGroups,
                        fullName  : session.fullName,
                        avatar    : session.avatar,
                        userid    : session.userid,
                        moderator : session.moderator,
                        admin     : session.admin
                    });
                }
            }
            else { reply.redirect('/'); }
        });
    }
};

exports.approvePerson = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        if (session.moderator) {
            models.User.update(request.params.person, { approved: true }, function (person) {
                console.log('approved:', person.key);
                reply.redirect('/people');
            });
        }
        else { reply.redirect('/'); }
    }
};

exports.approvePlace = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        if (session.moderator) {
            models.Place.update(request.params.place, { approved: true }, function () {
                //console.log('approved:', place.key);
                reply.redirect('/places');
            });
        }
        else { reply.redirect('/'); }
    }
};

exports.approveGroup = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        if (session.moderator) {
            models.Group.update(request.params.group, { approved: true }, function (err, group) {
                console.log('approved:', group.key);
                reply.redirect('/groups');
            });
        }
        else { reply.redirect('/'); }
    }
};

exports.adminPerson = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        if (session.admin) {
            models.User.update(request.params.person, { admin: true, moderator: true, approved: true }, function (person) {
                console.log('made admin:', person.key);
                reply().code(200).redirect('/people');
            });
        }
        else { reply().code(401).redirect('/'); }
    }
};

exports.moderatorPerson = {
    auth: 'session',
    handler: function (request, reply) {
        var session = request.auth.credentials;
        if (session.admin) {
            models.User.update(request.params.person, { moderator: true, approved: true }, function (person) {
                console.log('made moderator:', person.key);
                reply().code(200).redirect('/people');
            });
        }
        else { reply().code(401).redirect('/'); }
    }
};