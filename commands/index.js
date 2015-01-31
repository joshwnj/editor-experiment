var intRegexp = /^[0-9]+$/;
var keymap = [
  {
    key: intRegexp,
    constructor: GotoLine
  },

  {
    key: 'e',
    constructor: EndOfPrevious
  },

  {
    key: /^\//,
    constructor: Search
  },

  {
    key: /^\./,
    constructor: Repeat
  }
];

// select the start of a line
function GotoLine (arg) {
  this.name = 'GotoLine';
  this.arg = arg;
  this.line = parseInt(arg, 10);
}

GotoLine.prototype.run = function (editor, cursor) {
  var lineMap = editor.getLineMap();
  return (this.selectEnd) ?
    lineMap.getOffsetForLine(this.line + 1) - 1 :
    lineMap.getOffsetForLine(this.line);
};

// select the start of a regexp match
function Search (arg) {
  this.name = 'Search';
  this.arg = arg;

  // strip slashes
  this.pattern = new RegExp(arg.substring(1, arg.length-1));
}

Search.prototype.run = function (editor, cursor) {
  var source = editor.getSource();
  var match = this.pattern.exec(source.substr(cursor));
  if (!match) { return cursor; }

  var index = match.index;
  if (this.selectEnd) { index += match[0].length; }

  return cursor + index;
};

// select the end of the previous match
function EndOfPrevious (arg) {
  this.name = 'EndOfPrevious';
  this.arg = arg;
  this.isRepeat = true;
}

EndOfPrevious.prototype.run = function (editor, cursor) {
  var lastCmd = editor.getLastCmd();
  if (!lastCmd) { return cursor; }

  // rerun the last command, from the last cursor position, but this time select the end
  lastCmd.selectEnd = true;
  return editor.runCmd(editor.lastCursor, lastCmd);
};

// repeat the previous command
function Repeat (arg) {
  this.name = 'Repeat';
  this.arg = arg;

  this.times = 1;
  if (arg.length > 1) {
    this.times = parseInt(arg.substr(1), 10);
  }
}

Repeat.prototype.run = function (editor, cursor) {
  var lastCmd = editor.getLastCmd();

  // run the same cmd as before, a certain number of times
  var remaining = this.times;
  while (remaining > 0) {
    cursor = editor.runCmd(cursor, lastCmd);
    remaining -= 1;
  }
  return cursor;
};

module.exports.keymap = keymap;
