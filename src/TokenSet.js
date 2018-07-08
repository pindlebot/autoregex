const Range = require('./Range')
const Token = require('./Token')

function extract (value) {
  let { tok } = value
  const RE = /(?<=\[)(.*)(?=\])/
  return RE.test(tok) ? tok.match(RE)[0] : tok
}

class TokenSet {
  constructor (tokens, index, range = [1,1]) {
    tokens = Array.isArray(tokens) ? tokens : [tokens]
    tokens = tokens.map(tok => tok instanceof Token ? tok : Token.create(tok))
    this._tokens = new Set(tokens)
    this._range = range instanceof Range ? range : new Range(...range)
    this._index = index
    console.log(this)
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
    return this._tokens.size
  }

  get first () {
    return [...this._tokens][0]
  }

  get last () {
    return Array.from(this._tokens)[this._tokens.size - 1]
  }

  set token (tok) {
    this._tokens.add(tok instanceof Token ? tok : Token.create(tok))
  }

  set index (index) {
    this._index = index
  }

  set range (range) {
    this._range = new Range(...range)
  }

  includes (token) {
    // return this._tokens.has(token)
    if (!token) return false
    return [...this._tokens].some(({ tok }) => tok === token.tok)
  }

  remove (token) {
    this._tokens.delete(token)
  }

  reduceTokens (tok) {
    let { parent } = tok
    if (this.includes(parent)) {
      return
    }
    Array.from(this._tokens)
      .filter(token => token.parent && token.parent.tok === parent.tok)
      .forEach(token => {
        this.remove(token)
      })
    this.token = tok.parent
  }

  value () {
    console.log(this)
    let token = Array.from(this._tokens).map(extract).join('')
    let range = this._range.toString(this._tokens)
    if (this.length === 1) {
      if (this.range.upper === 1 && this.range.lower === 1) {
        if (!token.includes('A-Za-z')) {
          return token
        }
      }
    }
    return `[${token}]${range}`
  }
}

module.exports = TokenSet
