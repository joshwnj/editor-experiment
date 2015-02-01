var intRegexp = /^[0-9]+$/;
var tokenMap = [
  {
    pattern: intRegexp,
    constructor: GotoLine
  },

  {
    pattern: 'e',
    constructor: EndOfPrevious
  },

  {
    pattern: /^\//,
    constructor: Search
  },

  {
    pattern: /^\./,
    constructor: Repeat
  }
];

// select the start of a line
function GotoLine (token) {
  this.token = token;
  this.line = parseInt(token, 10);
}

GotoLine.prototype.run = function (editor, cursor) {
  var lineMap = editor.getLineMap();
  return (this.selectEnd) ?
    lineMap.getOffsetForLine(this.line + 1) - 1 :
    lineMap.getOffsetForLine(this.line);
};

// select the start of a regexp match
function Search (token) {
  this.token = token;

  // strip slashes
  this.pattern = new RegExp(token.substring(1, token.length-1));
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
function EndOfPrevious (token) {
  this.isModifier = true;
}

EndOfPrevious.prototype.modifyCommand = function (cmd) {
  cmd.selectEnd = true;
};

// repeat the previous command
function Repeat (token) {
  this.isModifier = true;
  this.token = token;

  this.times = 1;
  if (token.length > 1) {
    this.times = parseInt(token.substr(1), 10);
  }
}

Repeat.prototype.modifyCommand = function (command) {
  if (!command.times) { command.times = 1; }
  command.times += this.times;
};

module.exports = tokenMap;