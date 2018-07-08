
const { TOKENS } = require('./fixtures')

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
  ']',
  '-',
  '\\',
  '/'
]

const ALL_TOKENS = TOKENS.map((tok, index) => ({ tok, re: new RegExp(tok), index }))

const getParent = (token) => {
  if (!token.char) return null
  let code = token.char.charCodeAt(0)
  if (code > 96 && code < 124) {
    return Token.createFromRegEx('[A-Za-z]', token.char)
  }
  if (code > 48 && code < 58) {
    return Token.createFromRegEx('\\d')
  }
  return null
}

class Token {
  constructor ({ re, tok, index }, char) {
    console.log({ re, tok, index, char })
    this._char = char
    this.re = re
    this.tok = tok
    this.index = index
    this.special = index > 28
    this._parent = getParent(this)
  }

  set invariant (invariant) {
    this._invariant = invariant
    return this
  }

  get invariant () {
    return this._invariant
  }

  set char (char) {
    this._char = char
    return this
  }

  get char () {
    return this._char
  }

  set parent (parent) {
    this._parent = parent
    return this
  }

  get parent () {
    return this._parent
  }

  static createFromRegEx (re, char) {
    let token = ALL_TOKENS.find(tok => tok.tok === re)
    return new Token(token, char)
  }

  static create (char) {
    let token = ALL_TOKENS.find(tok => tok.re.test(char))
    return new Token(token, char)
  }
}

module.exports = Token
