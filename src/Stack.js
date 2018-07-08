const TokenSet = require('./TokenSet')

class Stack {
  constructor () {
    this._stack = []
  }

  getLastTokenSet () {
    return this._stack[this._stack.length - 1]
  }

  addToken (value, index) {
    this._stack[this._stack.length - 1].token = value
    return this
  }

  incrementRange (index) {
    let { range } = this.getLastTokenSet()
    this._stack[this._stack.length - 1].range = [range.lower + 1, range.upper + 1]
    this._stack[this._stack.length - 1].index = index
  }

  push (tokenSet) {
    this._stack.push(
      tokenSet
    )
    return this
  }

  value () {
    console.log(this)
    let re = this._stack.map(token => token.value()).join('')
    return new RegExp(`^${re}$`)
  }
}

module.exports = Stack
