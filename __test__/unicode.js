const Token = require('./src/Token')
let values = Array.from(new Array(100).keys()).map(i => String.fromCharCode(i))
const filterFunction = ({ token, char }) => {
  return token !== char &&
  token !== '\\' + char &&
  token !== '\\\\' + char
}
let notFound = values.map(Token.create).filter(filterFunction)