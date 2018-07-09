const Layer = require('./Layer')
const Token = require('./Token')

class Stack {
  constructor (matrix) {
    this._stack = []
    this._x = 0
    this.matrix = matrix
  }

  get head () {
    return this._stack[this._stack.length - 1]
  }

  addToken (token) {
    this.head.addToken(token)
    return this
  }

  push (layer) {
    this._stack.push(layer)
  }

  splitLayer (token) {
    let layer = new Layer(token)
    this.push(layer)
  }

  value () {
    // console.table(this._stack.map(layer => Array.from(layer.tokens).map(t => t.tok)))
    let re = this._stack.map(layer => layer.value()).join('')
    return new RegExp(`^${re}$`)
  }
}

module.exports = Stack
