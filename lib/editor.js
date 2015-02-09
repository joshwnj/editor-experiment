var LineMap = require('linemap');

function Editor (source) {
  this.source = source;
  this.lineMap = new LineMap(source);
  this.commands = [];
  this.commandRanges = [];
  this.marks = [];
  this.cursor = 0;
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

Editor.prototype.getLastCommandRange = function () {
  var r = this.commandRanges;
  return r[r.length-1];
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
  var range = cmd.run(this, this.cursor);
  this.commandRanges.push(range);
  this.cursor = range[cmd.selectEnd ? 1 : 0];
};

module.exports = Editor;
