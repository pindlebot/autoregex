const Range = require('../src/Range')

it ('range should handle [0,1]', () => {
  expect(new Range(0, 1).toString()).toMatch('?')
})

it ('range should handle [0,2]', () => {
  expect(new Range(0, 2).toString()).toMatch('{0,2}')
})

it ('range should handle [1,1]', () => {
  expect(new Range(1, 1).toString()).toMatch('')
})

it ('range should handle [1,9]', () => {
  expect(new Range(1, 9).toString()).toMatch('*')
})

it ('range should handle [4,5]', () => {
  expect(new Range(4, 5).toString()).toMatch('{4,5}')
})

