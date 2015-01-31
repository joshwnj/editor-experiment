var isArray = require('is-array');
var commands = require('../commands');

function doesKeyMatch (key, input) {
  if (typeof key === 'string') {
    if (input === key) {
      return true;
    }
  }
  else if (typeof key === 'object') {
    if (key.exec(input)) {
      return true;
    }
  }

  return false;
}

// TODO: rename "range arg" to "movement"
module.exports = function parseRangeArg (arg) {
  var numeric = /^[0-9]+$/;

  if (!isArray(arg)) { arg = [arg]; }

  function parse (a) {

    var matchedItem;
    commands.keymap.every(function (item) {
      var key = item.key;
      if (doesKeyMatch(key, a)) {
        matchedItem = item;
        return false;
      }

      // keep looking
      return true;
    });

    if (!matchedItem) {
      throw new Error('unknown range arg: ' + a);
      return;
    }

    return new (matchedItem.constructor)(a);
  }

  return arg
    .map(parse)
    .filter(Boolean);
};
