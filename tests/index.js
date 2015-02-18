var tape = require('tape');
var exec = require('child_process').exec;
var fs = require('fs');
var Editor = require('../lib/editor');
var commands = require('../commands');

tape('Make a selection', function (t) {
  t.plan(1);

  var editCmd = __dirname + '/../bin/edit.js';
  var sourceFile = __dirname + '/helloworld.txt';
  var cmd = editCmd + ' ' + sourceFile + ' 2 /i/ e . : /t/ e .5';
  exec(cmd, function (err, stdout, stderr) {
    if (err) { throw err; }
    if (stderr) { throw stderr; }

    t.equals(stdout, '18 46\n', 'Range offsets are correct');
  });
});

tape('Select a whole line', function (t) {
  t.plan(1);

  var editCmd = __dirname + '/../bin/edit.js';
  var sourceFile = __dirname + '/helloworld.txt';
  var cmd = editCmd + ' ' + sourceFile + ' 2 : e';
  exec(cmd, function (err, stdout, stderr) {
    if (err) { throw err; }
    if (stderr) { throw stderr; }

    t.equals(stdout, '12 19\n', 'Range offsets are correct');
  });
});

tape('Replace some text', function (t) {
  t.plan(1);

  var source = [
    'first line',
    'second line',
    'third line'
  ].join('\n');

  var editor = new Editor(source);

  var cmd;

  cmd = new commands.GotoLine(2);
  cmd.selectEnd = true;
  editor.addCommands([ cmd ]);

  cmd = new commands.ReplaceWithText();
  cmd.text = '\nin between';
  editor.addCommands([ cmd ]);

  editor.run();

  var lines = source.split('\n');
  lines.splice(2, 0, 'in between');
  t.equals(lines.join('\n'), editor.getSource(), 'Text was inserted as expected');
});
