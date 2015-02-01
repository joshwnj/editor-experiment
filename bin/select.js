#!/usr/bin/env node

var minimist = require('minimist');
var fs = require('fs');
var Editor = require('../lib/editor');
var TextView = require('../lib/text-view');
var compileTokens = require('../lib/compile-tokens');

var argv = minimist(
  process.argv.slice(2),
  { string: ['_'] }
);

var displayText = !!argv.display;
var displayContext = !!argv.context;
var sourceFilename = argv._.shift();

var source = fs.readFileSync(sourceFilename, 'utf8');
var editor = new Editor(source);

editor.addCommands(compileTokens(argv._));
var range = editor.getRangeOffsets();

// display the range text in context, with colors
if (displayContext) {
  var chalk = require('chalk');

  process.stdout.write('(' + range.join(' ') + ')\n');

  var numSurroundingLines = 2;
  var view = new TextView(source);
  var lineMap = editor.getLineMap();
  view.narrow(
    lineMap.getOffsetForLine(lineMap.getLineForOffset(range[0]) - numSurroundingLines),
    lineMap.getOffsetForLine(lineMap.getLineForOffset(range[1]) + numSurroundingLines)
  );

  var narrowedSource = view.toString();
  var convertedRange = [
    view.convertOffset(range[0]),
    view.convertOffset(range[1])
  ];
  process.stdout.write(narrowedSource.substring(0, convertedRange[0]));

  // show the position of the cursor at the start of the range
  process.stdout.write(chalk.red('|'));

  var rangeText = narrowedSource.substring(
    convertedRange[0],
    convertedRange[1]
  );

  process.stdout.write(chalk.inverse(rangeText));

  // show the final position of the cursor
  process.stdout.write(chalk.blue('|'));

  process.stdout.write(narrowedSource.substring(convertedRange[1]) + '\n');
}
// display the range text
else if (displayText) {
  process.stdout.write(source.substring.apply(source, range) + '\n');
}
// display the range offset values (default)
else {
  process.stdout.write(range.join(' ') + '\n');
}
