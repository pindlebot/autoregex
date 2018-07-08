const Stack = require('./Stack')
const TokenSet = require('./TokenSet')
const Token = require('./Token')

const createTokenMap = dataset => {
  return new Map(
    dataset.map((string, index) => ([
      string, {
        tokens: new Map(
          string.split('').map((char, i) => ([
            i, Token.create(char)
          ]))
        ),
        string: string,
        index: index
      }
    ]))
  )
}

const createMatrix = (dataset) => {
  let size = dataset.sort((a, b) => b.length - a.length)[0].length
  let matrix = Array.from(new Array(size).keys()).map(i =>
    dataset.map(str => str.charAt(i))
  )
  return matrix.map(column => column.map(char =>
    Token.create(char)
  ))
}

class TokenMap {
  constructor (dataset) {
    this._dataset = dataset
    this._map = createTokenMap(dataset)
    // this._matrix = createMatrix(dataset)
    console.log(this)
  }

  getTokenForString (string, index) {
    return this._map.get(string).tokens.get(index)
  }

  getTokensForSubstring (string, index) {
    let { tokens } = this._map.get(string)
    return Array.from(tokens.entries()).slice(0, index)
  }

  hasRepeats (string, index, tok, subset) {
    let substring = string.substring(0, index)
    let subregex = this.getTokensForSubstring(string, index)
    let hasRepeats = subset
      .every(str =>
        str.substring(0, index) === substring
        // subregex.every((token, i) => fixture.get(str.charAt(i)) === token)
      )
    return hasRepeats && !this._dataset.every(str => str.charAt(index) === tok.char)
  }
}

class Autoregex {
  constructor (dataset) {
    dataset = Array.from(new Set(dataset))
    this.dataset = dataset
    this.tokenMap = new TokenMap(dataset)
    this.columns = []
    this.size = dataset.sort((a, b) => b.length - a.length)[0].length
    this.stack = new Stack()
  }

  test () {
    let re = this.stack.value()
    let results = this.dataset.reduce((acc, str, index) => {
      let result = re.test(str)
      acc.push({
        string: str,
        index,
        result
      })
      return acc
    }, [])
    return { results, re }
  }

  tokenizeString (string, [x, index], subset) {
    let tok = this.tokenMap.getTokenForString(string, index)
    let lastTokenSet = this.stack.getLastTokenSet()
    // add the first token
    if (!lastTokenSet) {
      this.stack.push(new TokenSet(tok, index))
      return
    }

    if (lastTokenSet.includes(tok) || lastTokenSet.includes(tok.parent)) {
      // we're on a different character, so extend the range
      if (index !== lastTokenSet.index) {
        this.stack.incrementRange(index)
      }
      return
    }

    if (index !== lastTokenSet.index) {
      if (
        tok.special ||
        lastTokenSet.last.special ||
        this.tokenMap.hasRepeats(string, index, tok, subset)
      ) {
        this.stack.push(new TokenSet(tok, index))
        return
      }
      this.stack.incrementRange(index)
    }

    if (this.dataset.every(str => str.charAt(index) === tok.char)) {
      this.stack.addToken(tok)
      return
    }

    if (
      tok.parent &&
      this.dataset.some(str => str.charAt(index) !== tok.char)
    ) {
      lastTokenSet.reduceTokens(tok, index)
    } else {
      this.stack.addToken(tok, index)
    }
  }

  tokenize () {
    let y = 0
    while (y < this.size) {
      let subset = this.dataset
        .filter(str => str.length > y)

      subset.forEach((str, x) =>
        this.tokenizeString(str, [x, y], subset)
      )

      if (this.dataset.some(str => str.length <= y)) {
        let lower = this.stack.getLastTokenSet().range.lower
        this.stack.getLastTokenSet().range.lower = Math.max(lower - 1, 0)
      }

      y++
    }
    return this
  }

  value () {
    return this.stack.value()
  }
}

module.exports = Autoregex
