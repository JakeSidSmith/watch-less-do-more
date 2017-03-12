'use strict';

(function () {

  var path = require('path');
  var fs = require('fs');

  var _ = require('underscore');
  var chokidar = require('chokidar');
  var mkdirp = require('mkdirp');
  var less = require('less');
  var postcss = require('postcss');

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
        libs = options.use.map(function (lib) {
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

    parseFileAndWatchImports = _.debounce(function () {
      readFile(inputFilePath, function (result) {
        parseLess(result, function (output) {
          watcher.unwatch(watchedPaths);

          postProcess(output.css, outputCSS);

          watchedPaths = output.imports;
          watcher.add(watchedPaths);
        });
      });
    }, 2000, true);

    watcher.on('all', parseFileAndWatchImports);

    parseFileAndWatchImports('init');
  }

  module.exports = watchLessDoMore;

})();
