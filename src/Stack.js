const Group = require('./Group')

class Stack {
  constructor () {
    this._stack = []
  }

  last () {
    return this._stack[this._stack.length - 1]
  }

  set (value, index) {
    let last = this.last()
    //if (last.length > 2) {
    //  this.push([value], [1, 1], index)
    // return this
    //}
    this.last().token = value
    return this
  }

  push (...args) {
    this._stack.push(new Group(...args))
    return this
  }

  increment (index) {
    let last = this.last()
    let { range } = last
    this._stack[this._stack.length - 1].range.range = [range.lower + 1, range.upper + 1]
    this._stack[this._stack.length - 1].index = index
  }

  value () {
    let re = this._stack.map(token => token.value()).join('')
    return new RegExp(`^${re}$`)
  }
}

module.exports = Stack
