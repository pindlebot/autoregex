const { SPECIAL, TOKENS, REGEXS } = require('./constants')
const { isSpecial, getRegExp, extract } = require('./util')

class Range {
  constructor(lower, upper) {
    this._lower = lower
    this._upper = upper
  }

  get lower () {
    return this._lower
  }

  get upper () {
    return this._upper
  }

  get range () {
    return [this._lower, this._upper]
  }

  set lower (lower) {
    this._lower = lower
  }

  set upper (upper) {
    this._upper = upper
  }

  set range ([lower, upper]) {
    this._lower = lower
    this._upper = upper
  }

  toString() {
    let lower = this._lower
    let upper = this._upper
    if (upper === 1) {
      if (!lower) {
        return '?'
      }
      return ''
    }
    if (!lower) {
      return '*'
    }
    if (lower === upper) {
      return `{${lower}}`
    }
    return `{${lower},${upper}}`
  }
}

class Token {
  constructor(tokens, range, index) {
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

  value () {
    let token = this._tokens.map(extract).join('')
    console.log(this._tokens)
    let range = this._range.toString()
    return `[${token}]${range}`
  }
}

class Tokens {
  constructor() {
    this._tokens = []
  }

  last () {
    return this._tokens[this._tokens.length - 1]
  }

  set (value) {
    this.last().token = value
    return this
  }

  push (...args) {
    this._tokens.push(new Token(...args))
    return this
  }

  increment (index) {
    let { range } = this.last()
    this._tokens[this._tokens.length - 1].range.range = [range.lower + 1, range.upper + 1]
    this._tokens[this._tokens.length - 1].index = index
  }

  value () {
    console.log(this._tokens)
    return new RegExp(
      '^' +
      this._tokens.map(token => token.value()).join('') +
      '$'
    )
  }
}

class Autoregex {
  constructor (dataset) {
    this.dataset = dataset
    this.columns = []
    this.size = dataset.sort((a,b) => b.length - a.length)[0].length
    this.tokens = new Tokens()
  }

  test (fixtureNot) {
    let failed = []
    let succeeded 
    let re = this.tokens.value()
    let results = this.dataset.reduce((acc, str) => {
      let result = re.test(str)
      acc[result ? 'succeeded' : 'failed'].push(str)
      return acc
    }, { failed: [], succeeded: [] })
    let shouldFail = fixtureNot.reduce((acc, str) => {
      let result = re.test(str)
      acc[result ? 'failed' : 'succeeded'].push(str)
      return acc
    }, { failed: [], succeeded: [] })
    return { results, re, shouldFail }
  }

  tokenizeString (str, index) {
    let prev = this.tokens.last()
    let tok = getRegExp(str, index)
    if (typeof tok === 'undefined') {
      console.log(`${str.charAt(index)} not found.`)
      return
    }
    // add the first token
    if (!prev) {
      this.tokens.push([tok], [1, 1], index)
      return
    }

    let char = str.charAt(index)
    let special = isSpecial(char)
    let prevCharSpecial = isSpecial(prev.last.char)

    if (index !== prev.index) {
      if (special || prevCharSpecial) {
        this.tokens.push([tok], [1, 1], index)
        return
      }
      this.tokens.increment(index)
    }

    if (prev.tokens.includes(tok)) {
      // we're on a different character, so extend the range
      if (index !== prev.index) {
        this.tokens.increment(index)
      }
      return
    }
    
    this.tokens.set(tok)
  }

  tokenize () {
    let index = 0
    while (index < this.size) {
      this.dataset.filter(str => str.length > index)
        .forEach(str => this.tokenizeString(str, index))
  
      if (this.dataset.some(str => str.length <= index)) {
        let [lower, upper] = this.tokens.last().range.range
        this.tokens.last().range.lower = Math.max(lower - 1, 0)
      }
  
      index++
    }
    return this
  }
}

module.exports = Autoregex
