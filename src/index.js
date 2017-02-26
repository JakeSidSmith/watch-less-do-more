'use strict';

(function () {

  var path = require('path');
  var fs = require('fs');

  var _ = require('underscore');
  var chokidar = require('chokidar');
  var mkdirp = require('mkdirp');
  var less = require('less');

  var UTF8 = 'utf8';
  // var CWD = process.cwd();

  function watchLessDoMore (options) {

    var initialized = false;
    var parseFileAndWatchImports;
    var watchedPaths = [];
    var inputFilePath = path.resolve(options.input);
    var outputFilePath = path.resolve(options.output);
    var outputDirectory = path.dirname(outputFilePath);

    var watcher = chokidar.watch(inputFilePath, {persistent: true});

    var lessOptions = {
      filename: inputFilePath,
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
          if (!initialized) {
            process.exit(1);
          }
        } else {
          callback(result);
        }
      });
    }

    function parseLess (lessSource, callback) {
      less.render(lessSource, lessOptions, function (error, result) {
        if (error) {
          console.error(error.message);
          if (!initialized) {
            process.exit(1);
          }
        } else {
          callback(result);
        }
      });
    }

    function outputCSS (css) {
      mkdirp(outputDirectory, function (error) {
        if (error) {
          console.error(error);
          if (!initialized) {
            process.exit(1);
          }
        } else {
          fs.writeFile(outputFilePath, css, UTF8, function () {
            console.log('Built ' + options.output);
          });
        }
      });
    }

    parseFileAndWatchImports = _.debounce(function () {
      readFile(inputFilePath, function (result) {
        parseLess(result, function (output) {
          watcher.unwatch(watchedPaths);

          outputCSS(output.css);
          initialized = true;

          watchedPaths = output.imports;
          watcher.add(watchedPaths);
        });
      });
    }, 2000, true);

    watcher.on('all', parseFileAndWatchImports);

    parseFileAndWatchImports();
  }

  module.exports = watchLessDoMore;

})();
