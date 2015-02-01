var LineMap = require('/Users/josh/projects/personal/linemap');

function Editor (source) {
  this.source = source;
  this.lineMap = new LineMap(source);
  this.commands = [];
  this.range = [0,0];
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
  return this.range;
};

Editor.prototype._runRemainingCommands = function () {
  var c;

  while (this.commands.length) {
    c = this.commands.shift();
    this._runCommand(c);
  }
};

Editor.prototype._runCommand = function (cmd) {
  var i;
  var times = cmd.times || 1;

  // run the command, with repeats
  for (i=0; i<times; i+=1) {
    this.cursor = cmd.run(this, this.cursor);
  }

  this.range[cmd.isStart ? 0 : 1] = this.cursor;
};

module.exports = Editor;
