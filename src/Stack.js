const Layer = require('./Layer')
const Token = require('./Token')

class Stack {
  constructor (matrix) {
    this._stack = []
    this.matrix = matrix
  }

  getCurrentLayer () {
    return this._stack[this._stack.length - 1]
  }

  push (maybeLayer) {
    this._stack.push(
      maybeLayer instanceof Layer ? maybeLayer : new Layer(maybeLayer)
    )
  }

  value () {
    let re = this._stack.map(layer => layer.value()).join('')
    return new RegExp(`^${re}$`)
  }
}

module.exports = Stack
