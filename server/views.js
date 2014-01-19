var Person      = require('./models/Person');
var slugger     = require('slugger');

///////////////// INDEX

exports.index = function (request, reply) {
  reply.view('index');
};


///////////////// PEOPLE

exports.formPerson = function (request, reply) {
  reply.view('formPerson');
};

exports.createPerson = function (request, reply) {
  var form = request.payload;
  var p = Person.create({
    firstName : form.firstName,
    lastName  : form.lastName,
    email     : form.email,
    twitter   : form.twitter,
    site      : form.site,
    company   : form.company,
    bio       : form.bio,
    interests : form.interests
  });
  p.save(function (err) {
    Person.load(p.key, function (err, person) {
      reply().code(201).redirect('/people/' + p.slug);
    })
  });
};

exports.getPerson = function (request, reply) {
  var thisPerson = request.params.person;
  Person.load(Person.options.prefix + thisPerson, function(err, value) {
    if (err) {
      reply.view('404');
    }
    else {
      reply.view('person', value);
    }
  });
};

exports.listPeople = function (request, reply) {
  Person.all(function(err, data) {
    if(data.length === 0) {
      reply.view('noPeople');
    }
    else {
      reply.view('listPeople', { people : data});  
    }
  });
};

exports.delete = function (request, reply) {
  var key = request.params.prefix + '!' + request.params.person;
  Person.delete(key, callback);
  var callback = reply.view('deleted').redirect('/' + request.params.prefix);
};


///////////////// 404

exports.notFound = function (request, reply) {
  reply('404');
};