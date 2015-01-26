'use strict';

var jsdom = require("jsdom");

var slicer = function(config, callback) {
  if(!config.url || !config.selector) throw 'Config Error';

  var url = config.url;
  var selector = config.selector;
  var id = 0;
  var dumpedCss = {};

  jsdom.env({
    url: url,
    scripts: ["http://code.jquery.com/jquery.js"],
    features: {
      FetchExternalResources: ["script", "img", "css", "frame", "iframe", "link"],
      ProcessExternalResources: ["script"]
    },
    done: function (errors, window) {
      var $ = window.$;
      var $content = $(selector);

      var $body = $('<body></body>');
      var bodyStyle = window.getComputedStyle($('body')[0]);
      bodyStyle = styleObjectToString(bodyStyle);
      $body.attr('style', bodyStyle);

      //console.log(window.getComputedStyle($('#column2')[0]).float);

      dumpCss($content);
      callback($body.append($content)[0].outerHTML);

      window.close();

      function createId($element) {
        return $element[0].tagName + '_' + (id++);
      }

      function dumpCss($element) {
        var style = window.getComputedStyle($element[0]);
        var id = createId($element);
        dumpedCss[id] = style;

        $element.attr('style', styleObjectToString(style));

        $element.children().each(function(i, ele) {
          dumpCss($(ele));
        });
      }

      function styleObjectToString(style) {
        //return style.cssText;
        var styleString = '';
        for(var key in style._values) {
          styleString = styleString + key + ': ' + style._values[key].replace(/\"/g, '\'') + ';'
        }
        if(style.float) {
          styleString = styleString + 'float: ' + style.float;
        }

        return styleString;
      }

    }
  });


};

module.exports = slicer;
