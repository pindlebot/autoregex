const Range = require('./Range')
const { extract } = require('./util')

class Group {
  constructor (tokens, range, index) {
    this._tokens = tokens
    this._range = new Range(...range)
    this._index = index
  }

  get range () {
    return this._range
  }

  get index () {
    return this._index
  }

  get tokens () {
    return this._tokens
  }

  get length () {
    return this._tokens.length
  }

  get first () {
    return this._tokens[0]
  }

  get last () {
    return this._tokens[this._tokens.length - 1]
  }

  set token (tok) {
    this._tokens.push(tok)
  }

  set index (index) {
    this._index = index
  }

  includes (token) {
    return this._tokens.some(({ tok }) => tok === token.tok)
  }

  collapse (tok) {
    this.last.tok = tok.parent
    delete this.last.tok.parent
  }

  value () {
    let token = this._tokens.map(extract).join('')
    console.log(this._tokens)
    let range = this._range.toString()
    return `[${token}]${range}`
  }
}

module.exports = Group
