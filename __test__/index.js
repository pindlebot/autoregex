const Autoregex = require('../src')

const uuid = require('uuid/v4')
const fixture = [
	'sindresorhus@gmail.com',
	'foo@bar',
	'test@about.museum',
	'test@nominet.org.uk',
	'test.test@sindresorhus.com',
	'test@255.255.255.255',
	'a@sindresorhus.com',
	'test@e.com',
	'test@xn--hxajbheg2az3al.xn--jxalpdlp',
	'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklm@sindresorhus.com',
	'!#$%&amp;`*+/=?^`{|}~@sindresorhus.com',
	'test@g--a.com',
	'a@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg.hij',
	'123@sindresorhus.com',
	'"\\a"@sindresorhus.com',
	'""@sindresorhus.com',
	'"test"@sindresorhus.com',
	'"\\""@sindresorhus.com',
	'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklmn@sindresorhus.com',
	'test@iana.co-uk',
	'a@a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v',
	'test@foo-bar.com',
	'foo@x.solutions',
	'foo@[IPv6:2001:db8::2]'
];

const fixtureNot = [
	'@',
	'@io',
	'@sindresorhus.com',
	'test..sindresorhus.com',
	'test@iana..com',
	'test@sindresorhus.com.',
	'.test@sindresorhus.com',
	'sindre@sindre@sindre.com',
	'mailto:sindresorhus@gmail.com',
	'foo.example.com',
	'test.@example.com'
];

const _fixtures = [
  'http://google.com',
	'http://example.com',
	'http://abc.com'
];
let results = new Autoregex(_fixtures).tokenize().test([])
console.log(results)