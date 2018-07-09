const Stack = require('./Stack')
const Layer = require('./Layer')
const Token = require('./Token')
const Matrix = require('./Matrix')

class Autoregex {
  constructor (dataset) {
    dataset = Array.from(new Set(dataset))
    this.dataset = dataset
    this.tokens = new Matrix(dataset)
    this.columns = []
    this.size = dataset.sort((a, b) => b.length - a.length)[0].length
    this.stack = new Stack(this.tokens)
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

  tokenizeString (token) {
    let head = this.stack.head

    if (!head) {
      this.stack.splitLayer(this.tokens.isMessy(token.index) ? new Token('.', new RegExp('.'), token.index) : token)
      return
    }  

    if (token.index !== head.index) {
      if (head.last.tok === '.') {
        this.stack.splitLayer(token)
        return
      }
      if (this.tokens.isMessy(token.index)) {
        this.stack.splitLayer(new Token('.', new RegExp('.'), token.index))
        return
      }
      if (head.includes(token) || head.includes(token.parent)) {
        head.range.increment()
        head.index = token.index
        console.warn(`increment range to [${head.range.lower}, ${head.range.upper}]`)
        return
      }
      if (
        token.special ||
        head.last.special ||
        this.tokens.isUniform(token.index) ||
        this.tokens.isUniformByChar(token.index - 1)
      ) {
        this.stack.splitLayer(token)
        return
      }
    }

    this.stack.head.addToken(token)
  }
  
  adjustRangeIfNeeded = (column) => {
    if (column.some(tok => tok === null)) {
      this.stack.head.range.decrement()
    }
  }

  tokenize () {
    this.tokens.matrix.forEach(column => {
      column.forEach((token, y) => {
        if (token) this.tokenizeString(token)
      })
      this.adjustRangeIfNeeded(column)
    })
    return this
  }

  value () {
    return this.stack.value()
  }
}

module.exports = Autoregex
