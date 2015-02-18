var nthMatch = require('nth-match');

// select a line
function GotoLine (token) {
  this.token = token;
  this.line = parseInt(token, 10);
}

GotoLine.prototype.run = function (editor, cursor) {
  var lineMap = editor.getLineMap();
  editor.moveToTextObject(
    lineMap.getOffsetForLine(this.line),
    lineMap.getOffsetForLine(this.line + 1) - 1
  );
};

// select the start of a regexp match
function Search (token) {
  this.token = token;

  // strip slashes
  this.pattern = new RegExp(token.substring(1, token.length-1));
}

Search.prototype.run = function (editor, cursor) {
  var factor = this.factor || 1;
  var source = editor.getSource();
  var match = nthMatch(source.substr(cursor), this.pattern, factor-1);

  cursor += match.index;

  editor.moveToTextObject(cursor, cursor + match[0].length);
};

// set a mark
function SetMark (token) {
  this.token = token;
}

SetMark.prototype.run = function (editor, cursor) {
  editor.setMark(cursor);
};

// select the end of the previous match
function EndOfPrevious (token) {
  this.isModifier = true;
}

EndOfPrevious.prototype.modifyCommand = function (cmd) {
  cmd.selectEnd = true;
};

// set the factor for the previous command
function SetFactor (token) {
  this.isModifier = true;
  this.token = token;

  // if there's no number given, treat as a factor of 2
  this.factor = 2;
  if (token.length > 1) {
    this.factor = parseInt(token.substr(1), 10);
  }
}

SetFactor.prototype.modifyCommand = function (command) {
  if (!command.factor) { command.factor = 1; }
  command.factor = this.factor;
};

// delete the current region
function Delete (token) {
  this.token = token;
}

Delete.prototype.run = function (editor, cursor) {
  editor.replaceRegion('');
};

// uppercase the current region
function Uppercase (token) {
  this.token = token;
}

Uppercase.prototype.run = function (editor, cursor) {
  var text = editor.getRegionText();
  editor.replaceRegion(text.toUpperCase());
};

// replace the current region with input
function ReplaceWithText (token, matches) {
  this.token = token;
  this.text = matches ? matches[1] : null;
}

ReplaceWithText.prototype.run = function (editor, cursor) {
  editor.replaceRegion(this.text);
};


module.exports.GotoLine = GotoLine;
module.exports.Search = Search;
module.exports.SetMark = SetMark;
module.exports.EndOfPrevious = EndOfPrevious;
module.exports.SetFactor = SetFactor;
module.exports.Delete = Delete;
module.exports.Uppercase = Uppercase;
module.exports.ReplaceWithText = ReplaceWithText;
