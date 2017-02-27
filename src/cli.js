#! /usr/bin/env node

'use strict';

(function () {

  var _ = require('underscore');
  var yargs = require('yargs');

  var watchLessDoMore = require('./index');

  var argv = yargs
    .usage('$0 -i=source.less -o=build.css')
    .example('$0 -i=source-1.less -i=source-2.less -o=build-1.css -o=build-2.css', 'Watch mutliple less files')
    .options({
      'input': {
        alias: 'i',
        description: 'Path to input LESS file',
        type: 'string'
      },
      'output': {
        alias: 'o',
        description: 'Path to output CSS file',
        type: 'string'
      }
      /*
      ,
      'compress': {
        alias: 'c',
        description: 'Compress the output file',
        type: 'boolean'
      },
      'source-map': {
        alias: 'm'
      },
      'source-map-url': {

      },
      'source-map-basepath': {

      },
      'source-map-rootpath': {

      },
      'output-source-files': {

      },
      'source-map-file-inline': {

      }
      */
    })
    .demandOption(['input', 'output'], 'Please provide both input and output paths')
    .help()
    .version()
    .argv;

  // console.log(argv);

  var inputs = [].concat(argv.input);
  var outputs = [].concat(argv.output);

  if (inputs.length !== outputs.length) {
    console.error(
      'Matching number of input & output paths are required: ' +
      inputs.length +
      ' input paths provided and ' +
      outputs.length +
      ' output paths provided'
    );
  } else if (inputs.length > 1) {
    _.each(inputs, function (input, index) {
      watchLessDoMore({
        input: input,
        output: outputs[index],
        compress: argv.compress
      });
    });
  } else {
    watchLessDoMore({
      input: inputs[0],
      output: outputs[0],
      compress: argv.compress
    });
  }

})();
