const Stack = require('./Stack')
const TokenSet = require('./TokenSet')
const Token = require('./Token')

const createMatrix = (dataset) => {
  let size = dataset.sort((a, b) => b.length - a.length)[0].length
  return Array.from(new Array(size).keys()).map(i =>
    dataset.map(str => str.charAt(i) ? str.charAt(i) : null)
  ).map(column =>
    column
      .map(char => char ? Token.create(char) : null)
  )
}

class TokenMap {
  constructor (dataset) {
    this._dataset = dataset
    this._matrix = createMatrix(dataset)
    console.log(this)
  }

  get length () {
    return this._matrix.length
  }

  get matrix () {
    return this._matrix
  }

  getToken (x, y) {
    return this._matrix[x][y]
  }

  peek (x) {
    return this._matrix[x + 1]
  }

  isUniform (x) {
    let first = this._matrix[x][0]
    return this._matrix[x].every(token => token && token.tok === first.tok)
  }

  isUniformByChar (x) {
    let first = this._matrix[x][0]
    return this._matrix[x].every(token => token && token.char === first.char)
  }

  takeUntil (x) {
    return this._matrix.reduce((acc, val, index) => {
      if (val && index <= x) {
        acc.push(val)
      }
      return acc
    }, [])
  }

  hasRepeats (x, y) {
    return this.isUniform && !this.isUniformByChar(x)
  }
}

class Autoregex {
  constructor (dataset) {
    dataset = Array.from(new Set(dataset))
    this.dataset = dataset
    this.tokens = new TokenMap(dataset)
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

  tokenizeString (tok, [x, y]) {
    let lastTokenSet = this.stack.getLastTokenSet()
    // add the first token
    if (!lastTokenSet) {
      this.stack.push(new TokenSet(tok, x))
      return
    }

    if (lastTokenSet.includes(tok) || lastTokenSet.includes(tok.parent)) {
      // we're on a different character, so extend the range
      if (x !== lastTokenSet.index) {
        this.stack.incrementRange(x)
      }
      return
    }

    if (x !== lastTokenSet.index) {
      if (
        tok.special ||
        lastTokenSet.last.special ||
        this.tokens.hasRepeats(x, y)
      ) {
        this.stack.push(new TokenSet(tok, x))
        return
      }
      this.stack.incrementRange(x)
    }

    if (this.tokens.isUniformByChar(x)) {
      this.stack.addToken(tok)
      return
    }

    if (tok.parent) {
      lastTokenSet.reduceTokens(tok, this.tokens.matrix[x])
      return
    }

    this.stack.addToken(tok, x)
  }

  tokenize () {
    this.tokens.matrix.forEach((column, x) => {
      column.filter(tok => tok).forEach((token, y) => {
        if (token) {
          this.tokenizeString(token, [x, y])
        }
      })
      console.log(this.tokens.matrix)
      if (this.tokens.matrix[x].some(tok => tok === null)) {
        let lower = this.stack.getLastTokenSet().range.lower
        this.stack.getLastTokenSet().range.lower = Math.max(lower - 1, 0)
      }
    })
    return this
  }

  value () {
    return this.stack.value()
  }
}

module.exports = Autoregex
