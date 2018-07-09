const Layer = require('../src/Layer')
const Token = require('../src/Token')
const Stack = require('../src/Stack')
const Matrix = require('../src/Matrix')

it('Layer 1', () => {
  let layer = new Layer('a')
  expect(layer.length).toBe(1)
  expect(layer.index).toBe(0)
  expect(layer.range.upper).toBe(1)
  expect(layer.range.lower).toBe(1)
})

/* it('Layer 2', () => {
  let layer = new Layer('2', 0)
  layer.addToken('1')
  expect(layer.last.tok).toMatch('1')
})

let tok = new Token('a')
tok.parent = new Token('[A-Za-z]')
tok.parent.hasChildren = true

let second = new Token('b')
second.parent = new Token('[A-Za-z]')
second.parent.hasChildren = true
let column = [second, second]

it ('stack', () => {
  let stack = new Stack()
  stack.push(new Layer(tok), 0))
  stack.head.range.increment(2)
  expect(stack.head.range.upper).toEqual(2)
  expect(stack.head.range.lower).toEqual(2)
  // stack.head.reduceTokens(second, column)
  // expect(stack.head.last.tok).toMatch('[A-Za-z]')
  // expect(stack.head.length).toBe(1)
  // expect(stack.value().toString()).toMatch('[A-Za-z]{2}')
})

it ('stack 2', () => {
  let stack = new Stack()
  stack.push(new Layer('a', 0, [1, 1]))
  stack.head.addToken('b')
  stack.head.addToken('c')
  stack.head.range.increment()
  stack.push(new Layer('e', 1, [1, 1]))
  stack.head.addToken('b')
  expect(stack.value().toString()).toMatch('[A-Za-z]')
})
*/
// it('Layer 3', () => {
//  let layer = new Layer(tok, 0, [1, 1])
//  let stack = new Stack()
//  stack.push(Layer)
//  layer.addToken(second)
//  expect(layer.last.tok).toMatch('[1-2]')
// })
