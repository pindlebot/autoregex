class Range {
  constructor (lower = 1, upper = 1) {
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

  increment () {
    this._lower++
    this._upper++
  }

  decrement () {
    console.log('decrement', this)
    this._lower = Math.max(this._lower - 1, 0)
  }

  toString () {
    let lower = this._lower
    let upper = this._upper
    switch (true) {
      case upper > 50:
      case upper > 6 && (upper / 2) > lower:
        return '*'
      case upper === 1 && !lower:
        return '?'
      case upper === 1:
        return ''
      case upper === lower:
        return `{${lower}}`
      default:
        return `{${lower},${upper}}`
    }
  }
}

module.exports = Range
