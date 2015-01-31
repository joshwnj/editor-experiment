#!/usr/bin/env node

var parseRangeArg = require('../lib/parse-range-arg');

// ----

var minimist = require('minimist');
var fs = require('fs');
var Editor = require('../lib/editor');
var TextView = require('../lib/text-view');

var argv = minimist(
  process.argv.slice(2),
  { string: ['s', 'e'] }
);

var displayText = !!argv.display;
var displayContext = !!argv.context;
var sourceFilename = argv._[0];

var source = fs.readFileSync(sourceFilename, 'utf8');
var editor = new Editor(source);
var range = [0,0];
// var startArg = parseRangeArg(argv.s);
// var endArg = parseRangeArg(argv.e);
var movementArgs = getMovementArgs(argv);

function getMovementArgs (argv) {
  var parts;
  if (argv.r) {
    parts = argv.r.split('|');

    // TODO: can't use split here, will need to tokenize
    // (otherwise will have issues with spaces inside a regexp)
    argv.s = parts[0].split(' ');
    argv.e = parts[1].split(' ');
  }

  if (argv.s && argv.e) {
    return {
      start: parseRangeArg(argv.s),
      end: parseRangeArg(argv.e)
    };
  }
}

// TODO: put this inside the editor, so we have one continuous list of "start cmds" and "end cmds"
// (then can compress repeaters)
function applyOp (cursor, cmd) {
  return editor.runCmd(cursor, cmd);
}

// apply commands to get the start offset (starting from 0)
range[0] = movementArgs.start.reduce(applyOp, 0);

// apply commands to get the end offset (starting from the start offset)
range[1] = movementArgs.end.reduce(applyOp, range[0]);

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

  var rangeText = narrowedSource.substring(
    convertedRange[0],
    convertedRange[1]
  );
  process.stdout.write(chalk.inverse(rangeText));

  // show the position of the cursor
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
