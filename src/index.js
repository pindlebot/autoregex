const { isSpecial, getRegExp } = require('./util')
const Stack = require('./Stack')

class Autoregex {
  constructor (dataset) {
    this.dataset = dataset
    this.columns = []
    this.size = dataset.sort((a, b) => b.length - a.length)[0].length
    this.stack = new Stack()
  }

  test (fixtureNot) {
    let re = this.stack.value()
    let results = this.dataset.reduce((acc, str) => {
      let result = re.test(str)
      acc[result ? 'succeeded' : 'failed'].push(str)
      return acc
    }, { failed: [], succeeded: [] })
    let shouldFail = fixtureNot.reduce((acc, str) => {
      let result = re.test(str)
      acc[result ? 'failed' : 'succeeded'].push(str)
      return acc
    }, { failed: [], succeeded: [] })
    return { results, re, shouldFail }
  }

  tokenizeString (str, index) {
    let prev = this.stack.last()
    let tok = getRegExp(str, index)
    console.log({ tok, index })
    if (typeof tok === 'undefined') {
      console.log(`${str.charAt(index)} not found.`)
      return
    }
    // add the first token
    if (!prev) {
      this.stack.push([tok], [1, 1], index)
      return
    }

    let char = str.charAt(index)
    let special = isSpecial(char)
    let prevCharSpecial = isSpecial(prev.last.char)

    if (index !== prev.index) {
      if (special || prevCharSpecial) {
        this.stack.push([tok], [1, 1], index)
        return
      }
      this.stack.increment(index)
    }

    if (prev.tokens.includes(tok)) {
      // we're on a different character, so extend the range
      if (index !== prev.index) {
        this.stack.increment(index)
      }
      return
    }
    
    this.stack.set(tok, index)
    /*if (
      tok.parent &&
      prev.last.parent &&
      tok.parent === prev.last.parent &&
      !this.dataset.some(str => str.charAt(index) !== tok.char)
    ) {
      prev.collapse(tok)
    } else {
      this.stack.set(tok)
    }*/
  }

  tokenize () {
    let index = 0
    while (index < this.size) {
      this.dataset.filter(str => str.length > index)
        .forEach(str => this.tokenizeString(str, index))

      if (this.dataset.some(str => str.length <= index)) {
        let lower = this.stack.last().range.lower
        this.stack.last().range.lower = Math.max(lower - 1, 0)
      }

      index++
    }
    return this
  }
}

module.exports = Autoregex
