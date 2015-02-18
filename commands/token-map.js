var intRegexp = /^[0-9]+$/;
var commands = require('./index');
var tokenMap = [
  {
    pattern: intRegexp,
    constructor: commands.GotoLine
  },

  {
    pattern: ':',
    constructor: commands.SetMark
  },

  {
    pattern: 'e',
    constructor: commands.EndOfPrevious
  },

  {
    pattern: /^\//,
    constructor: commands.Search
  },

  {
    pattern: /^\./,
    constructor: commands.SetFactor
  },

  // replacement commands
  {
    pattern: 'x',
    constructor: commands.Delete
  },

  {
    pattern: 'U',
    constructor: commands.Uppercase
  },

  {
    pattern: /r\n([\s\S]+)\n\./,
    constructor: commands.ReplaceWithText
  }
];

module.exports = tokenMap;
