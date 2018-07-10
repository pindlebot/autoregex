const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const isLowerCaseLetter = code => (code >= 97 && code <= 122)
const isUpperCaseLetter = code => (code >= 65 && code <= 90)
const lowercase = Array.from(new Array(123).keys()).filter(isLowerCaseLetter)
const uppercase = Array.from(new Array(123).keys()).filter(isUpperCaseLetter)
const controlCharacters = Array.from(new Array(19).keys()).map(c => (['\\' + 'u000' + c, 'u']))

const TOKENS = [
  ...numbers,
  ...String.fromCharCode(...lowercase).split(''),
  ...String.fromCharCode(...uppercase).split(''),
  ['[\u{1f600}-\u{1f642}]', 'u'],
  ['[\u{1f300}-\u{1f5ff}]', 'u'],
  ...controlCharacters,
  ['\u200B', 'u'],
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
  '\\n',
  '\\r',
  '\\t',
  '\\v', // vertical tab
  '\\f',
  '\\a', // alarm
  '\\b', // backspace
  '\\0',
  '\\s',
  '\\c',
  '\\e', // escape
  '\\.',
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
  '\\\\',
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
