const Range = require('./Range')
const Token = require('./Token')

function extract (value) {
  let { token } = value
  const RE = /(?<=\[)(.*)(?=\])/
  return RE.test(token) ? token.match(RE)[0] : token
}

class Layer {
  constructor (tokens) {
    tokens = Array.isArray(tokens) ? tokens : [tokens]
    tokens = tokens.map((tok, i) => tok instanceof Token ? tok : Token.create(tok, i))
    this._tokens = new Set(tokens)
    this._range = new Range()
    this._index = tokens[0].displacement
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
    return Array.from(this._tokens)[0]
  }

  get last () {
    return Array.from(this._tokens)[this._tokens.size - 1]
  }

  add (tok) {
    this._tokens.add(tok instanceof Token ? tok : Token.create(tok, 0))
  }

  set index (index) {
    this._index = index
  }

  set range (range) {
    this._range = new Range(range instanceof Range ? range : new Range(...range))
  }

  includes (token) {
    if (!token) return false
    return Array.from(this._tokens)
      .some((tok) => tok.token === token.token || tok.token === '.')
  }

  has (token) {
    return this.includes(token)
  }

  remove (token) {
    this._tokens.delete(token)
  }

  addNumberToken (tok) {
    this.collapse(tok.parent)
    let nums = this.column.filter(t => !isNaN(1)).map(t => parseInt(t.char))
    let min = Math.min(...nums)
    let max = Math.max(...nums)
    if ((max - min) < 3) {
      let token = new Token(`[${min}-${max}]`, tok.displacement)
      token.char = tok.char
      token.parent = new Token(`\\d`)
      this.add(token)
      return
    }
    this.add(tok.parent)
  }

  collapse (parent) {
    Array.from(this._tokens)
      .filter(token => token.parent && token.parent.token === parent.token)
      .forEach(token => {
        console.warn(`Removing ${token.tok}`)
        this.remove(token)
      })
  }

  addToken (token) {
    if (token.displacement !== this.index) {
      //  we're on a new column, so extend the range
      this.range.increment()
      this._index = token.displacement
    }
    const { parent } = token

    if (this.includes(token) || this.includes(parent)) {
      console.warn('Not adding ' + token.token)
      return
    }

    if (parent) {
      this.collapse(parent)
      parent.index = token.displacement
      this.add(parent)
      return
    }

    this.add(token)
  }

  value () {
    let tokens = Array.from(this._tokens)
    let token = tokens.map(extract).join('')
    let range = this._range.toString(this._tokens)
    if (this.length === 1) {
      if (!tokens.some(tok => tok.isRange())) {
        if (tokens[0].token === '.') {
          return token
        }
        if (this.range.upper === 1 && this.range.lower === 1) {
          return token
        }
        if (this.range.upper === 1 && this.range.lower === 0) {
          return token + '?'
        }
      }
    }
    return `[${token}]${range}`
  }
}

module.exports = Layer
