const Token = require('../src/Token')

it ('token should correctly set isRange', () => {
  let token = new Token('[0-3]')
  expect(token.isRange).toBe(true)
}) 

it ('token should correctly set isRange', () => {
  let token = new Token('3')
  expect(token.isRange).toBe(false)
}) 
