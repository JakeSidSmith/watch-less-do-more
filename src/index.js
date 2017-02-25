'use strict';

(function () {

  var path = require('path');
  var fs = require('fs');
  var less = require('less');
  var _ = require('underscore');

  var UTF8 = 'utf8';
  // var CWD = process.cwd();

  function watchLessDoMore (options) {

    var parseFileAndWatchImports;
    var watchers = [];

    var lessOptions = {
      filename: path.resolve(options.input),
      compress: options.compress,
      sourceMap: options.sourceMap ? {
        sourceMapURL: options.sourceMapURL,
        sourceMapBasepath: options.sourceMapBasepath,
        sourceMapRootpath: options.sourceMapRootpath,
        outputSourceFiles: options.outputSourceFiles,
        sourceMapFileInline: options.sourceMapFileInline
      } : false
    };

    function readFile (filePath, callback) {
      fs.readFile(filePath, UTF8, function (error, result) {
        if (error) {
          console.error(error.message);
          process.exit(1);
        } else {
          callback(result);
        }
      });
    }

    function parseLess (lessSource, callback) {
      less.render(lessSource, lessOptions, function (error, result) {
        if (error) {
          console.error(error.message);
          process.exit(1);
        } else {
          callback(result);
        }
      });
    }

    function watchFiles (filePaths) {
      _.each(filePaths, function (filePath) {
        watchers.push(fs.watch(filePath, UTF8, function (eventType, filename) {
          console.log(eventType, filename);
        }));
      });
    }

    function destroyWatchers () {
      _.each(watchers, function (watcher) {
        watcher.close();
      });
    }

    parseFileAndWatchImports = function (inputFilePath) {
      readFile(inputFilePath, function (result) {
        parseLess(result, function (output) {
          destroyWatchers();
          watchFiles([inputFilePath].concat(output.imports));
        });
      });
    };

    parseFileAndWatchImports(path.resolve(options.input));
  }

  module.exports = watchLessDoMore;

})();
