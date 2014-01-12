var views     = require('./views');
var Types     = require('hapi').types;

module.exports = [

  // GET STATIC FILES
  { method: 'GET',  path: '/{path*}',   
    handler: {
      directory: { 
        path: './public', 
        listing: false, 
        index: true 
      }
    }  
  },

  // GET ROUTES
  { method: 'GET',  path: '/',          handler: views.index },
  { method: 'GET',  path: '/addperson', handler: views.addPersonForm },

  // POST ROUTES
  { method: 'POST', path: '/newperson', handler: views.newPerson }

];