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

  getTokens () {
    return this._tokens
  }

  getLength () {
    return this._tokens.size
  }

  getCurrentToken() {
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

  hasToken (token) {
    return this.includes(token)
  }

  remove (token) {
    this._tokens.delete(token)
  }

  addNumberToken (tok) {
    this.collapseLayer(tok.parent)
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

  removeSiblingsIfNeeded (token) {
    let { parent } = token
    if (parent) {
      Array.from(this._tokens)
        .filter(token => token.parent && token.parent.token === parent.token)
        .forEach(tok => {
          this.remove(tok)
        })
      parent.index = token.displacement
      this.add(parent)
      return null
    }
    return token
  }

  addToken (token) {
    // if we've moved to a new index in the string, increment the range.
    // e.g., [A-Za-z]{3} => [A-Za-z]{4}
    if (token.displacement !== this.index) {
      //  we're on a new column, so extend the range
      this.range.increment()
      this._index = token.displacement
    }

    if (this._tokens.size > 4) {
      // console.log('replacing',this._tokens)
      // this._tokens = new Set([Token.create('.', token.displacement)])
      // return
    }
    // if the token is already present in the set, forego adding it again
    if (this.hasToken(token) || this.hasToken(token.parent)) {
      return
    }
    // convert [abc] to [A-Za-z]+
    token = this.removeSiblingsIfNeeded(token)

    // finally add the token
    if (token) {
      this.add(token)
    }
  }

  value () {
    let tokens = Array.from(this._tokens).sort((a,b) => b.token.length - a.token.length)
    let token = tokens.map(extract).join('')
    let range = this._range.toString(this._tokens)
    if (this.getLength() === 1) {
      if (!tokens.some(tok => tok.isRange())) {
        // if (tokens[0].token === '.') {
        //  return token
        // }
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
