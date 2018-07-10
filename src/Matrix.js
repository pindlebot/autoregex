const Token = require('./Token')
const takeWhile = require('lodash.takewhile')

const createMatrix = (dataset, size) => {
  return Array.from(new Array(size).keys()).map(i =>
    dataset.map(str =>
      str.charAt(i) ? str.charAt(i) : null
    )
  ).map((column, i) =>
    column
      .map(char => char ? Token.create(char, i) : null)
  )
}

class Matrix {
  constructor (dataset) {
    let size = dataset.sort((a, b) => b.length - a.length)[0].length

    this._dataset = dataset
    this._matrix = createMatrix(dataset, size)
    this.maxSize = size
  }

  get length () {
    return this._matrix.length
  }

  get matrix () {
    return this._matrix
  }

  first (x) {
    return this._matrix[x][0]
  }

  toArray () {
    return [...this._matrix]
  }

  getToken (x, y) {
    return this._matrix[x][y]
  }

  peek (x) {
    return this._matrix[x + 1]
  }

  isUniform (x) {
    return x > -1 && this._matrix[x].every(token =>
      token && token.token === this.first(x).token
    )
  }

  isUniformByChar (x) {
    return x > -1 && this._matrix[x].every(token =>
      token && token.char === this.first(x).char
    )
  }

  takeUntil (x) {
    return this._matrix.reduce((acc, val, index) => {
      if (val && index <= x) {
        acc.push(val)
      }
      return acc
    }, [])
  }

  isHeterogeneous (x) {
    return this._matrix[x]
      .filter(tok => tok !== null && !tok.parent)
      .reduce((acc, val) => {
        if (!acc.includes(val.char)) {
          acc.push(val.char)
        }
        return acc
      }, []).length > 2
  }
}

module.exports = Matrix
