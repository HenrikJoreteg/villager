var VeryLevelModel = require('verymodel-level');
var verymodel = require('verymodel');
var level = require('level');
var slugger = require('slugger');

var type = verymodel.VeryType;

var Place = new VeryLevelModel ({
  type: {
    type: type().isIn('Restaurant', 'Coffee shop', 'Bar', 'Winery', 'Store', 'Company', 'Nonprofit', 'Venue', 'Public')
  },
  name: {
    required: true,
    type: type().isAlphanumeric()
  },
  slug: { 
    derive: function () {
      return slugger(this.name);
    }, 
    private: false 
  },
  address: {
    required: false,
    type: type().isAlphanumeric()
  },
  city: {
    required: false,
    type: type().isAlphanumeric()
  },
  map: {
    processIn: function() {
      if (this.address.length > 0) {
        return 'http://maps.google.com/?q=' + this.address + ' ' + this.city;
        console.log('http://maps.google.com/?q=' + this.address + ' ' + this.city);
      }
      else {
        return "";
        console.log('map blank');        
      }
    },
    type: type().isUrl(),
  },
  image: {
    required: true,
    type: type().isUrl()
  },
  website: {
    type: new type().isUrl(),
    required: true
  },
  about: {
    required: false,
    type: type().isAlphanumeric().len(0,160)
  },
  key: { 
    private: true,
    derive: function () {
      return 'places!' + this.slug;
    }
  },
}, {prefix: 'places!'});

module.exports = Place;
