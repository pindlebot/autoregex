class Range {
  constructor (lower, upper) {
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

  toString () {
    let lower = this._lower
    let upper = this._upper
    if (upper === 1) {
      if (!lower) {
        return '?'
      }
      return ''
    }
    if (!lower) {
      return '*'
    }
    if (lower === upper) {
      return `{${lower}}`
    }
    return `{${lower},${upper}}`
  }
}

module.exports = Range
