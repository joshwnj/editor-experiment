var LineMap = require('/Users/josh/projects/personal/linemap');

function Editor (source) {
  this.source = source;
  this.lineMap = new LineMap(source);
  this.lastCmd = null;
  this.lastDelta = 0;
}

Editor.prototype.getSource = function () {
  return this.source;
};

Editor.prototype.getLineMap = function () {
  return this.lineMap;
};

Editor.prototype.runCmd = function (cursor, cmd) {
  this.lastCursor = cursor;
  cursor = cmd.run(this, cursor);

  // remember the command (unless it's a repeat of a previous command)
  if (!cmd.isRepeat) {
    this.lastCmd = cmd;
  }

  return cursor;
};

Editor.prototype.getLastCmd = function () {
  var cmd = this.lastCmd;
  if (!cmd) { return null; }

  // create a copy of the command to send back
  var lastCmd = new (cmd.constructor)(cmd.arg);
  if (cmd.selectEnd) {
    lastCmd.selectEnd = true;
  }
  return lastCmd;
};

module.exports = Editor;
