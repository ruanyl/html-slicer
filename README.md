html-slicer
========
[![NPM version](https://badge.fury.io/js/html-slicer.svg)](http://badge.fury.io/js/html-slicer)

If you have ever used Evernote web clipper, you must know how amazing it is. This small tool trys to implement parts of its functions.

## Installation

This module is installed via npm:

``` bash
$ npm install html-slicer
```

## Example Usage

``` js
var htmlSlicer = require('html-slicer');
htmlSlicer({url: 'http://nodejs.org', selector: '#column1'},
  function(result) {
    console.log(result);
  });
```

What this tool basically does is it clip part(which selector specified) of an webpage, and returns the result as html with inline css.

## Previou

### before -->
![before](https://raw.githubusercontent.com/ruanyl/html-slicer/gh-pages/images/origin.png)

### after -->
![after](https://raw.githubusercontent.com/ruanyl/html-slicer/gh-pages/images/after.png)
