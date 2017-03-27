'use strict';

(function () {

  var path = require('path');
  var fs = require('fs');

  var map = require('lodash.map');
  var chokidar = require('chokidar');
  var mkdirp = require('mkdirp');
  var less = require('less');
  var postcss;

  var UTF8 = 'utf8';

  function watchLessDoMore (options) {

    var libs, processor;
    var initialized = false;
    var parseFileAndWatchImports;
    var watchedPaths = [];
    var inputFilePath = path.resolve(options.input);
    var outputFilePath = path.resolve(options.output);
    var outputDirectory = path.dirname(outputFilePath);

    if (options.use.length) {
      try {
        postcss = require('postcss');
      } catch (error) {
        console.error('Optional dependency \'postcss\' is required to use postcss modules');
        console.error(error.message);
        process.exit(1);
      }

      try {
        libs = map(options.use, function (lib) {
          return require(lib);
        });

        processor = postcss(libs);
      } catch (error) {
        console.error(error.message);
        process.exit(1);
      }
    }

    var watcher = chokidar.watch(inputFilePath, {persistent: true});

    var lessOptions = {
      filename: inputFilePath
    };

    function postProcess (css, callback) {
      if (!processor) {
        callback(css);
      } else {
        processor
          .process(css)
          .then(function (result) {
            callback(result.css);
          })
          .catch(function (error) {
            console.log(error);
            if (!initialized) {
              process.exit(1);
            }
          });
      }
    }

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

          initialized = true;
        }
      });
    }

    function parseFileAndWatchImports (eventType) {
      if (eventType !== 'add') {
        readFile(inputFilePath, function (result) {
          parseLess(result, function (output) {
            watcher.unwatch(watchedPaths);

            postProcess(output.css, outputCSS);

            watchedPaths = output.imports;
            watcher.add(watchedPaths);
          });
        });
      }
    }

    watcher.on('all', parseFileAndWatchImports);

    parseFileAndWatchImports('init');
  }

  module.exports = watchLessDoMore;

})();
