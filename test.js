'use strict';
var slicer = require('./');

slicer({url: 'http://nodejs.org', selector: '#column1'}, function(result) {
  console.log(result);
});
