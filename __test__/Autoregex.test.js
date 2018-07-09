const Autoregex = require('../src')

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
  output: '/^[1!A-Za-z\\-]{1,2}$/'
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
  output: '/^[!\\*\\d\\^][A-Za-z]{0,6}$/'
}, {
  input: [
    '******',
    'abcabc',
    'defdef'
  ],
  output: '/^[\\*A-Za-z]{6}$/'
}, {
  input: [
    'o888',
    'o887',
    'oh&&'
  ],
  output: ''
}]

datasets.forEach((dataset, i) => {
  it(`${JSON.stringify(dataset[i])}`, () => {
    let re = new Autoregex(datasets[i].input).tokenize().value()
    console.log(re)
    expect(re.toString()).toMatch(datasets[i].output)
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
