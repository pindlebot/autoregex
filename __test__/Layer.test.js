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
