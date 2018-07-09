const Stack = require('./Stack')
const Layer = require('./Layer')
const Token = require('./Token')
const Matrix = require('./Matrix')

class Autoregex {
  constructor (dataset) {
    dataset = Array.from(new Set(dataset))
    this.dataset = dataset
    this.tokens = new Matrix(dataset)
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
    let currentLayer = this.stack.getCurrentLayer()

    if (!currentLayer) {
      this.stack.push(token)
      return
    }  

    if (token.displacement !== currentLayer.index) {
      // if (currentLayer.last.tok === '.') {
      //  this.stack.splitLayer(token)
      //  return
      // }
      // if (this.tokens.isHeterogeneous(token.displacement)) {
      //  this.stack.push(new Token('.', new RegExp('.'), token.displacement))
      //  return
      // }
      if (currentLayer.includes(token) || currentLayer.includes(token.parent)) {
        currentLayer.range.increment()
        currentLayer.index = token.displacement
        return
      }
      if (
        (token.isSpecialCharacter() || currentLayer.last.isSpecialCharacter()) ||
        this.tokens.isUniform(token.displacement) ||
        this.tokens.isUniformByChar(token.displacement - 1)
      ) {
        this.stack.push(token)
        return
      }
    }

    this.stack.getCurrentLayer().addToken(token)
  }
  
  adjustRangeIfNeeded = (column) => {
    if (column.some(tok => tok === null)) {
      this.stack.getCurrentLayer().range.decrement()
    }
  }

  tokenize () {
    this.tokens.matrix.forEach(column => {
      column.forEach(token => {
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
