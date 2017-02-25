'use strict';

(function () {

  var path = require('path');
  var fs = require('fs');
  var less = require('less');
  var _ = require('underscore');

  var UTF8 = 'utf8';
  var CWD = process.cwd();

  function watchLessDoMore (options) {
    var lessOptions = {
      filename: path.resolve(options.input),
      sourceMap: options.sourceMap ? {
        sourceMapURL: options.sourceMapURL,
        sourceMapBasepath: options.sourceMapBasepath,
        sourceMapRootpath: options.sourceMapRootpath,
        outputSourceFiles: options.outputSourceFiles,
        sourceMapFileInline: options.sourceMapFileInline
      } : false
    };

    function readFile (input, callback) {
      fs.readFile(path.join(CWD, input), UTF8, function (error, result) {
        if (error) {
          console.error(error.message);
          process.exit(1);
        } else {
          callback(result);
        }
      });
    }

    function parseLess (input, callback) {
      less.render(input, lessOptions, function (error, result) {
        if (error) {
          console.error(error.message);
          process.exit(1);
        } else {
          callback(result);
        }
      });
    }

    readFile(options.input, function (result) {
      parseLess(result, lessOptions, function (output) {
        console.log(output);
      });
    });
  }

  module.exports = watchLessDoMore;

})();
