const SPECIAL = [
  '.',
  '@',
  '#', 
  '$', 
  '%', 
  '^', 
  '&', 
  '*', 
  '(', 
  ')', 
  '~', 
  `'`, 
  '`', 
  '"', 
  '[',
  ']'
]

const TOKENS = [
  '\\\d',
  '[A-Za-z]',
  '@',
  '\\\s',
  '\\\.',
  '\\\\',
  '\\\^',
  '\\\$',
  '\\\*',
  '\\\+',
  '\\\?',
  '\\\(',
  '\\\)',
  '\\\[',
  '\\\]',
  '\\|'
]

const REGEXS = TOKENS.map(tok => ({ re: new RegExp(tok), tok: tok }))
module.exports = {
  SPECIAL,
  TOKENS,
  REGEXS
}