'use strict';
var slicer = require('./');

slicer({url: 'http://nodejs.org', selector: '#content'}, function(result) {
  console.log(result);
});
