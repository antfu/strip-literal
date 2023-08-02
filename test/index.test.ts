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
      {
        "code": "foo(\`     \${foo({ class: \\"   \\" })}    \`)",
        "mode": "regex",
      }
    `)
})

test('template string nested', () => {
  let str = '`aaaa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    {
      "code": "\`    \`",
      "mode": "acorn",
    }
  `)

  str = '`aaaa` `aaaa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    {
      "code": "\`    \` \`    \`",
      "mode": "acorn",
    }
  `)

  str = '`aa${a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    {
      "code": "\`  \${a}  \`",
      "mode": "acorn",
    }
  `)

  str = '`aa${a + `a` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    {
      "code": "\`  \${a + \` \` + a}  \`",
      "mode": "acorn",
    }
  `)

  str = '`aa${a + `a` + a}aa` `aa${a + `a` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    {
      "code": "\`  \${a + \` \` + a}  \` \`  \${a + \` \` + a}  \`",
      "mode": "acorn",
    }
  `)

  str = '`aa${a + `aaaa${c + (a = {b: 1}) + d}` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    {
      "code": "\`  \${a + \`    \${c + (a = {b: 1}) + d}\` + a}  \`",
      "mode": "acorn",
    }
  `)

  str = '`aa${a + `aaaa${c + (a = {b: 1}) + d}` + a}aa` `aa${a + `aaaa${c + (a = {b: 1}) + d}` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    {
      "code": "\`  \${a + \`    \${c + (a = {b: 1}) + d}\` + a}  \` \`  \${a + \`    \${c + (a = {b: 1}) + d}\` + a}  \`",
      "mode": "acorn",
    }
  `)
})

test('backtick escape', () => {
  const str = [
    'this.error(`\\`new URL(url, import.meta.url)\\` is not supported in SSR.`)',
    'this.error(`\\\\`)',
    'this.error(`\\``)',
  ].join('\n')
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    {
      "code": "this.error(\`                                                          \`)
    this.error(\`  \`)
    this.error(\`  \`)",
      "mode": "acorn",
    }
  `)
})
