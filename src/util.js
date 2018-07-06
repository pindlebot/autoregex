const { SPECIAL, TOKENS, REGEXS } = require('./constants')

function getRegExp (str, index) {
  let char = str.charAt(index)
  let tok = REGEXS.find(({ re }) => re.test(char))
  tok.char = char
  return tok
}

function isSpecial (char) {
  return SPECIAL.includes(char)
}

function extract (value) {
  let { tok } = value
  const RE = /(?<=\[)(.*)(?=\])/
  return RE.test(tok) ? tok.match(RE)[0] : tok
}

module.exports = {
  isSpecial,
  extract,
  getRegExp
}