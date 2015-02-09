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
  this._runRemainingCommands();

  var len = this.marks.length;
  return [this.marks[len-1], this.cursor];
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

Editor.prototype._runRemainingCommands = function () {
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
