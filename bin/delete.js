#!/usr/bin/env node

var minimist = require('minimist');
var fs = require('fs');

var argv = minimist(process.argv.slice(2));
var sourceFilename = argv._[0];

var range = [
  parseInt(argv._[1], 10),
  parseInt(argv._[2], 10)
];

var source = fs.readFileSync(sourceFilename, 'utf8');
process.stdout.write(source.substr(0, range[0]));
process.stdout.write(source.substr(range[1]) + '\n');
