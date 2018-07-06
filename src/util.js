const { SPECIAL, TOKENS, REGEXS } = require('./constants')

function getRegExp (str, index) {
  return REGEXS.find(({ re }) =>
    re.test(str.charAt(index))
  )
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