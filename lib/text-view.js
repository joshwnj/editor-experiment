function TextView (src) {
  this.src = src;
}

TextView.prototype.narrow = function (start, end) {
  this.narrowRange = [start, end];
};

TextView.prototype.convertOffset = function (offset) {
  return offset - this.narrowRange[0];
};

TextView.prototype.toString = function () {
  return this.src.substring(this.narrowRange[0], this.narrowRange[1]);
};

module.exports = TextView;
