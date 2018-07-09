
const { TOKENS, SPECIAL } = require('./fixtures')

const getFlag = tok => tok.charAt(2) === 'u' ? 'u' : ''

const ALL_TOKENS = TOKENS.map((tok, index) => Array.isArray(tok)
  ? ([ tok, new RegExp(...tok) ]) : ([ tok, new RegExp(tok, getFlag(tok)) ]))

const getParent = (token) => {
  if (!token.char) return null
  let code = token.char.charCodeAt(0)
  if (
    (code >= 97 && code <= 122) ||
    (code >= 65 && code <= 90)
  ) {
    let tok = new Token('[A-Za-z]')
    tok.index = token.index
    return tok
  }
  if (code >= 48 && code <= 57) {
    let tok = new Token('\\d')
    tok.index = token.index
    return tok
  }
  return null
}

class Token {
  constructor (tok, re, index) {
    this.re = re || new RegExp(tok)
    this.tok = tok
    this.isRange = tok.startsWith('[') && tok.endsWith(']')
    this._index = index
  }

  getType () {
    switch (true) {
      case this.isNumber():
        return 'number'
      case this.parent && this.parent.tok === '[A-Za-z]':
        return 'letter'
      case this.special:
        return 'special'
      default:
        return 'unknown'
    }
  }

  set invariant (invariant) {
    this._invariant = invariant
  }

  get invariant () {
    return this._invariant
  }

  set special (special) {
    this._special = special
  }

  set index (index) {
    this._index = index
  }

  get index () {
    return this._index
  }

  get special () {
    return this._special
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

  set hasChildren (children) {
    this._hasChildren = children
  }

  get hasChildren () {
    return this._hasChildren
  }

  get parent () {
    return this._parent
  }

  isNumber () {
    return !isNaN(this._char)
  }

  static create (char, index) {
    let tok = ALL_TOKENS.find(([tok, re]) => re.test(char))
    let token = new Token(...tok, index)
    token.char = char
    token.parent = getParent({ char, index })
    return token
  }
}

module.exports = Token
