const Autoregex = require('../src')
const uuid = require('uuid/v4')

function randomHex () {
  const c = Math.floor(Math.random() * 0x1000000);
  return '#' + ('000000' + c.toString(16)).substr(-6)
}

function randomId () {
  return Math.max(Math.floor(Math.random() * 100000), 10000)
}

const datasets = [{
  input: [
    '^^a',
    '&&a',
    '%%a'
  ],
  output: '/^[\\^&%]{2}a$/'
}, {
  input: [
    'a'
  ],
  output: '/^a$/'
}, {
  input: ['123', '45'],
  output: '/^[\\d]{2,3}$/'
}, {
  input: ['!', '1', 'a', '-', '11'],
  output: '/^[A-Za-z\\-1!]{1,2}$/'
}, {
  input: ['aa', 'aaa', 'aaaa'],
  output: '/^[a]{2,4}$/'
}, {
  input: ['zz', 'zzqqq'],
  output: '/^[z]{2}[q]{0,3}$/'
}, {
  input: ['g.1', 'g.2'],
  output: '/^g\\.\\d$/'
}, {
  input: [
    '!abcdef',
    '*abcdef',
    '1abcdef',
    '^'
  ],
  output: '/^[A-Za-z\\*\\d\\^!]*$/'
}, {
  input: [
    '******',
    'abcabc',
    'defdef'
  ],
  output: '/^[A-Za-z\\*]{6}$/'
}, {
  input: [
    'o888',
    'o887',
    'oh&&'
  ],
  output: '/^o[A-Za-z\\d&]{3}$/'
}, {
  input: Array.from(new Array(20).keys()).map(() => uuid()),
  output: '/^[A-Za-z\\d]{8}\\-[A-Za-z\\d]{4}\\-4[A-Za-z\\d]{3}\\-[A-Za-z\\d]{4}\\-[A-Za-z\\d]{12}$/'
}, {
  input: Array.from(new Array(20).keys()).map(() => randomHex()),
  output: '/^#[A-Za-z\\d]{6}$/'
}, {
  input: Array.from(new Array(5).keys()).map(() => 'https://stackoverflow.com/questions/' + randomId()),
  output: '/^h[t]{2}ps:[\\/]{2}stackoverflow\\.com\\/questions\\/[\\d]{5}$/'
}, {
  input: [
    'abc$$$111+++',
    'def%%%222---',
    'ghi$$$333]]]',
    'xyz%%%444[[['
  ],
  output: ''
}, {
  input: [
    'email@example.com',
    'firstname.lastname@example.com',
    'email@subdomain.example.com',
    'firstname+lastname@example.com',
    'email@123.123.123.123',
    'email@[123.123.123.123]',
    '"email"@example.com',
    '1234567890@example.com',
    'email@example-one.com',
    '_______@example.com',
    'email@example.name',
    'email@example.museum',
    'email@example.co.jp',
    'firstname-lastname@example.com'
  ],
  output: '/^[A-Za-z\\d\\["_@]{9}[A-Za-z\\-\\+\\.\\d\\]@]*$/'
}]

datasets.forEach((dataset, i) => {
  it('Autoregex - ' + dataset.input.join(', '), () => {
    let re = new Autoregex(dataset.input).tokenize().value()
    expect(re.toString()).toMatch(dataset.output)
  })
})

datasets.forEach((dataset, i) => {
  let re = new Autoregex(datasets[i].input).tokenize().value()
  dataset.input.forEach(string => {
    it(`Autregex. Test: "${string}", RegEx: "${re.toString()}"`, () => {
      expect(re.test(string)).toBe(true)
    })
  })
})
