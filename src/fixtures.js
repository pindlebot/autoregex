const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const isLowerCaseLetter = code => (code >= 97 && code <= 122)
const isUpperCaseLetter = code => (code >= 65 && code <= 90)
const lowercase = Array.from(new Array(123).keys()).filter(isLowerCaseLetter)
const uppercase = Array.from(new Array(123).keys()).filter(isUpperCaseLetter)

const TOKENS = [
  ...numbers,
  ...String.fromCharCode(...lowercase).split(''),
  ...String.fromCharCode(...uppercase).split(''),
  ['[\u{1f300}-\u{1f5ff}]', 'u'],
  '[A-Z]',
  '[a-z]',
  '[A-Za-z]',
  '\\d',
  '@',
  '!',
  '#',
  ':',
  ';',
  '>',
  '<',
  '"',
  `'`,
  '&',
  '%',
  '=',
  '~',
  '`',
  '_',
  ',',
  '\\-',
  '\\{',
  '\\}',
  '\\/',
  '\\s',
  '\\c',
  '\\.',
  '\\\\',
  '\\^',
  '\\$',
  '\\*',
  '\\+',
  '\\?',
  '\\(',
  '\\)',
  '\\[',
  '\\]',
  '\\|',
  '\\/',
  '\\xhh',
  '\\Oxxx',
  '.'
]

const SPECIAL = [
  '.',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '(',
  ')',
  '~',
  `'`,
  '`',
  '"',
  '[',
  ']',
  '-',
  '\\',
  '/'
]

module.exports.SPECIAL = SPECIAL
module.exports.TOKENS = TOKENS
