var tape = require('tape');
var exec = require('child_process').exec;

tape('Make a selection', function (t) {
  t.plan(1);

  var selectCmd = __dirname + '/../bin/select.js';
  var sourceFile = __dirname + '/helloworld.txt';
  var cmd = selectCmd + ' ' + sourceFile + ' 2 /i/ e . : /t/ e .5';
  exec(cmd, function (err, stdout, stderr) {
    if (err) { throw err; }
    if (stderr) { throw stderr; }

    t.equals(stdout, '18 46\n', 'Range offsets are correct');
  });
});

tape('Select a whole line', function (t) {
  t.plan(1);

  var selectCmd = __dirname + '/../bin/select.js';
  var sourceFile = __dirname + '/helloworld.txt';
  var cmd = selectCmd + ' ' + sourceFile + ' 2 : e';
  exec(cmd, function (err, stdout, stderr) {
    if (err) { throw err; }
    if (stderr) { throw stderr; }

    t.equals(stdout, '12 19\n', 'Range offsets are correct');
  });
});
