const { TOKENS, SPECIAL } = require('./fixtures')

const ALL_TOKENS = TOKENS.map((tok, index) =>
  new RegExp(...(Array.isArray(tok) ? tok : [tok]))
)

const getParent = (token) => {
  if (!token.char) return null
  let code = token.char.charCodeAt(0)
  if (
    (code >= 97 && code <= 122) ||
    (code >= 65 && code <= 90)
  ) {
    let tok = new Token('[A-Za-z]', token.displacement)
    return tok
  }
  if (code >= 48 && code <= 57) {
    let tok = new Token('\\d', token.displacement)
    return tok
  }
  // return new Token('.', token.index)
  return null
}

class Token {
  constructor (regex, displacement) {
    let re = typeof regex === 'string'
      ? new RegExp(regex)
      : regex
    let tok = typeof regex === 'string'
      ? regex
      : regex.toString().slice(1, regex.toString().length - 1)
    let flags = typeof regex === 'string' ? ''
      : re.flags
    this.regex = re
    this.token = tok
    this._isRange = tok.startsWith('[') && tok.endsWith(']')
    this._displacement = displacement
    this.flags = flags
    this._special = false
  }

  set special (special) {
    this._special = special
  }

  set displacement (displacement) {
    this._displacement = displacement
  }

  get displacement () {
    return this._displacement
  }

  isSpecialCharacter () {
    return this._special
  }

  isRange () {
    return this._isRange
  }

  isWildcard () {
    return this.token === '.'
  }

  set char (char) {
    if (SPECIAL.includes(char)) {
      this.special = true
    }
    this._char = char
  }

  get char () {
    return this._char
  }

  set parent (parent) {
    this._parent = parent
  }

  get parent () {
    return this._parent
  }

  isNumber () {
    return !isNaN(this._char)
  }

  static create (char, displacement) {
    let re = ALL_TOKENS.find(regex => regex.test(char))
    let token = new Token(re, displacement)
    token.char = char
    token.parent = getParent({ char, displacement })
    return token
  }
}

module.exports = Token
