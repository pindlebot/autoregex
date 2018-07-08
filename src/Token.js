
const { TOKENS, SPECIAL } = require('./fixtures')

const ALL_TOKENS = TOKENS.map((tok, index) => ([tok, new RegExp(tok)]))

const getParent = (token) => {
  if (!token.char) return null
  let code = token.char.charCodeAt(0)
  if (code > 96 && code < 124) {
    let tok = new Token('[A-Za-z]')
    tok.isRange = true
    return tok
  }
  if (code > 48 && code < 58) {
    let tok = new Token('\\d')
    return tok
  }
  return null
}

class Token {
  constructor (tok, re) {
    this.re = re || new RegExp(tok)
    this.tok = tok
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
    parent.hasChildren = true
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

  get isRange () {
    return this._isRange
  }

  set isRange (isRange) {
    this._isRange = isRange
  }

  static create (char) {
    let tok = ALL_TOKENS.find(([tok, re]) => re.test(char))
    let token = new Token(...tok)
    token.char = char
    token.parent = getParent({ char })
    return token
  }
}

module.exports = Token
