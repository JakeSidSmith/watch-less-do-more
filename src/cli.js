#! /usr/bin/env node

'use strict';

(function () {

  var forEach = require('lodash.foreach');
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
      },
      'use': {
        alias: 'u',
        description: 'PostCSS module to use',
        type: 'string'
      }
    })
    .demandOption(['input', 'output'], 'Please provide both input and output paths')
    .help()
    .version()
    .argv;

  var inputs = typeof argv.input !== 'undefined' ? [].concat(argv.input) : [];
  var outputs = typeof argv.output !== 'undefined' ? [].concat(argv.output) : [];
  var use = typeof argv.use !== 'undefined' ? [].concat(argv.use) : [];

  if (inputs.length !== outputs.length) {
    console.error(
      'Matching number of input & output paths are required: ' +
      inputs.length +
      ' input paths provided and ' +
      outputs.length +
      ' output paths provided'
    );
  } else if (inputs.length > 1) {
    forEach(inputs, function (input, index) {
      watchLessDoMore({
        input: input,
        output: outputs[index],
        use: use
      });
    });
  } else {
    watchLessDoMore({
      input: inputs[0],
      output: outputs[0],
      use: use
    });
  }

})();
