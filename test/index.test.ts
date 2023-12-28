/* eslint-disable no-template-curly-in-string */
import { expect, test } from 'vitest'
import { executeWithVerify } from './utils'

test('works', () => {
  expect(executeWithVerify(`
// comment1
const a = 'aaaa'
/* comment2 */
const b = "bbbb"
/*
  // comment3
*/
/* // comment3 */
// comment 4 /* comment 5 */
const c = \`ccc\${a}\`

let d = /re\\\\ge/g
    `)).toMatchSnapshot()
})

test('escape character', () => {
  expect(executeWithVerify(`
'1\\'1'
"1\\"1"
"1\\"1\\"1"
"1\\'1'\\"1"
"1'1'"
"1'\\'1\\''\\"1\\"\\""
'1"\\"1\\""\\"1\\"\\"'
'""1""'
'"""1"""'
'""""1""""'
"''1''"
"'''1'''"
"''''1''''"
  `)).toMatchSnapshot()
})

test('regexp affect', () => {
  expect(executeWithVerify(`
[
  /'/,
  '1',
  /"/,
  "1"
]
  `)).toMatchSnapshot()
})

test('strings comment nested', () => {
  expect(executeWithVerify(`
// comment 1 /* " */
const a = "a //"
// comment 2 /* " */
  `)).toMatchSnapshot()

  expect(executeWithVerify(`
// comment 1 /* ' */
const a = "a //"
// comment 2 /* ' */
  `)).toMatchSnapshot()

  expect(executeWithVerify(`
// comment 1 /* \` */
const a = "a //"
// comment 2 /* \` */
  `)).toMatchSnapshot()

  expect(executeWithVerify(`
const a = "a //"
console.log("console")
  `)).toMatchSnapshot()

  expect(executeWithVerify(`
const a = "a /*"
console.log("console")
const b = "b */"
  `)).toMatchSnapshot()

  expect(executeWithVerify(`
const a = "a ' "
console.log("console")
const b = "b ' "
  `)).toMatchSnapshot()

  expect(executeWithVerify(`
const a = "a \` "
console.log("console")
const b = "b \` "
  `)).toMatchSnapshot()
})

test('acorn syntax error', () => {
  expect(executeWithVerify(`
foo(\`fooo \${foo({ class: "foo" })} bar\`)
  `, false))
    .toMatchInlineSnapshot(`
      "// mode: acorn
      foo(\`     \${foo({ class: "   " })}    \`)"
    `)
})

test('template string nested', () => {
  let str = '`aaaa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    "// mode: acorn
    \`    \`"
  `)

  str = '`aaaa` `aaaa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    "// mode: acorn
    \`    \` \`    \`"
  `)

  str = '`aa${a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    "// mode: acorn
    \`  \${a}  \`"
  `)

  str = '`aa${a + `a` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    "// mode: acorn
    \`  \${a + \` \` + a}  \`"
  `)

  str = '`aa${a + `a` + a}aa` `aa${a + `a` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    "// mode: acorn
    \`  \${a + \` \` + a}  \` \`  \${a + \` \` + a}  \`"
  `)

  str = '`aa${a + `aaaa${c + (a = {b: 1}) + d}` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    "// mode: acorn
    \`  \${a + \`    \${c + (a = {b: 1}) + d}\` + a}  \`"
  `)

  str = '`aa${a + `aaaa${c + (a = {b: 1}) + d}` + a}aa` `aa${a + `aaaa${c + (a = {b: 1}) + d}` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    "// mode: acorn
    \`  \${a + \`    \${c + (a = {b: 1}) + d}\` + a}  \` \`  \${a + \`    \${c + (a = {b: 1}) + d}\` + a}  \`"
  `)
})

test('backtick escape', () => {
  const str = [
    'this.error(`\\`new URL(url, import.meta.url)\\` is not supported in SSR.`)',
    'this.error(`\\\\`)',
    'this.error(`\\``)',
  ].join('\n')
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    "// mode: acorn
    this.error(\`                                                          \`)
    this.error(\`  \`)
    this.error(\`  \`)"
  `)
})
