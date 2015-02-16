
function spliceString (str, start, end, insert) {
  return str.substr(0, start) + (insert || '') + str.substr(end);
}

var LineMap = require('linemap');

function Editor (source) {
  this.source = source;
  this.lineMap = new LineMap(source);
  this.commands = [];
  this.marks = [];
  this.cursor = 0;
  this.textObjects = [];
}

Editor.prototype.addCommands = function (commands) {
  this.commands = this.commands.concat(commands);
};

Editor.prototype.getSource = function () {
  return this.source;
};

Editor.prototype.getLineMap = function () {
  return this.lineMap;
};

Editor.prototype.getRangeOffsets = function () {
  var len = this.marks.length;
  return [this.marks[len-1] || this.cursor, this.cursor];
};

Editor.prototype.getRegionText = function () {
  return this.source.substring.apply(this.source, this.getRangeOffsets());
};

Editor.prototype.setMark = function (cursor) {
  this.marks.push(cursor);
};

Editor.prototype.moveToTextObject = function (start, end) {
  this.textObjects.push([start, end]);
  this.cursor = start;
};

Editor.prototype.moveToEndOfLastObject = function () {
  var o = this.textObjects;
  if (!o.length) { return; }

  var last = o[o.length-1];
  this.cursor = last[1];
};

Editor.prototype.replaceRegion = function (text) {
  var range = this.getRangeOffsets();
  this.source = spliceString(this.source, range[0], range[1], text);

  // regenerate the linemap
  this.lineMap = new LineMap(this.source);

  // move the cursor to the end of the replacement text
  this.cursor = range[0] + text.length;
};

Editor.prototype.run = function () {
  var c;

  while (this.commands.length) {
    c = this.commands.shift();
    this._runCommand(c);
  }
};

Editor.prototype._runCommand = function (cmd) {
  // run the command
  cmd.run(this, this.cursor);

  if (cmd.selectEnd) {
    this.moveToEndOfLastObject();
  }
};

module.exports = Editor;
