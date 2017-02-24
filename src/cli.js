#! /usr/bin/env node

'use strict';

(function () {

  var yargs = require('yargs');
  var watchLessDoMore = require('./index');

  var argv = yargs
    .usage('watch-less-do-more --input=src/index.less --output=build/index.css')
    .options({
      input: {
        alias: 'i',
        description: 'Path to input less file',
        type: 'string'
      },
      output: {
        alias: 'o',
        description: 'Path to output css file',
        type: 'string'
      }
    })
    .demandOption(['input', 'output'], 'Please provide both input and output paths')
    .help()
    .version()
    .argv;

  watchLessDoMore({input: argv.input, output: argv.output});

})();
