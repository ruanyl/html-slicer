'use strict';

var jsdom = require("jsdom");
var URL = require("url-parse");

var slicer = function(config, callback) {
  if(!config.url || !config.selector) throw 'Config Error';

  var url = config.url;
  var sourceUrl = new URL(url);
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

        $element = urlTransform($element);

        //set element inline css
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

      function urlTransform($element) {

        if($element.prop('tagName') === 'A') {
          var href = $element.attr('href');
          var aUrl = new URL(href);

          //if it is not a internet url
          if(!aUrl.hostname) {
            //TODO should consider absolute and relative url
            $element.attr('href', sourceUrl.protocol + '//' + sourceUrl.host + href);
          }
        }

        //TODO should consider data url
        if($element.prop('tagName') === 'IMG') {
          var src = $element.attr('src');
          var imgUrl = new URL(src);

          //if it is not a internet url
          if(!imgUrl.hostname) {
            //TODO should consider absolute and relative url
            $element.attr('src', sourceUrl.protocol + '//' + sourceUrl.host + src);
          }
        }

        return $element;

      }

    }
  });


};

module.exports = slicer;
