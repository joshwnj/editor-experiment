var tokenMap = require('../commands/token-map');

function doesMatch (pattern, input) {
  if (typeof pattern === 'string') {
    if (input === pattern) {
      return true;
    }
  }
  else if (typeof pattern === 'object') {
    if (pattern.exec(input)) {
      return true;
    }
  }

  return false;
}

function createCommandFromToken (t) {
  var matchedItem;
  tokenMap.every(function (item) {
    var pattern = item.pattern;
    if (doesMatch(pattern, t)) {
      matchedItem = item;
      return false;
    }

    // keep looking
    return true;
  });

  if (!matchedItem) { return null; }

  return new (matchedItem.constructor)(t);
}

module.exports = function compileTokens (tokens) {
  var commands = [];
  var c;
  var t;
  var m;
  while (tokens.length) {
    // create a command from the first token
    t = tokens.shift();
    c = createCommandFromToken(t);
    if (!c) { throw new Error('unknown token: ' + t); }

    // apply subsequent modifiers
    while (tokens.length) {
      t = tokens[0];
      m = createCommandFromToken(t);
      if (!m) { throw new Error('unknown token: ' + t); }
      if (!m.isModifier) { break; }

      tokens.shift();
      m.modifyCommand(c);
    }

    commands.push(c);
  }

  return commands;
}
