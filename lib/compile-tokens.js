var tokenMap = require('../commands/token-map');

function getMatches (pattern, input) {
  if (typeof pattern === 'string') {
    if (input === pattern) {
      return true;
    }
  }
  else if (typeof pattern === 'object') {
    return pattern.exec(input);
  }

  return false;
}

function createCommandFromToken (t) {
  var matchedItem;
  var matches;

  tokenMap.every(function (item) {
    var pattern = item.pattern;
    matches = getMatches(pattern, t);
    if (matches) {
      matchedItem = item;
      return false;
    }

    // keep looking
    return true;
  });

  if (!matchedItem) { return null; }

  return new (matchedItem.constructor)(t, matches);
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
