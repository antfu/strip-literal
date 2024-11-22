/* eslint-disable no-template-curly-in-string */
import { expect, it } from 'vitest'
import { executeWithVerify } from './utils'

it('works', () => {
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

it('escape character', () => {
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

it('regexp affect', () => {
  expect(executeWithVerify(`
[
  /'/,
  '1',
  /"/,
  "1",
  /a[/]/
]
  `)).toMatchSnapshot()
})

it('strings comment nested', () => {
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

it('multiline string', () => {
  expect(executeWithVerify(`
const a = \`

  some text

message

\`
  `)).toMatchSnapshot()
})

it('acorn syntax error', () => {
  expect(executeWithVerify(`
foo(\`fooo \${foo({ class: "foo" })} bar\`)
  `))
    .toMatchInlineSnapshot(`"foo(\`     \${foo({ class: "   " })}    \`)"`)
})

it('template string nested', () => {
  let str = '`aaaa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`"\`    \`"`)

  str = '`aaaa` `aaaa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`"\`    \` \`    \`"`)

  str = '`aa${a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`"\`  \${a}  \`"`)

  str = '`aa${a + `a` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`"\`  \${a + \` \` + a}  \`"`)

  str = '`aa${a + `a` + a}aa` `aa${a + `a` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`"\`  \${a + \` \` + a}  \` \`  \${a + \` \` + a}  \`"`)

  str = '`aa${a + `aaaa${c + (a = {b: 1}) + d}` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`"\`  \${a + \`    \${c + (a = {b: 1}) + d}\` + a}  \`"`)

  str = '`aa${a + `aaaa${c + (a = {b: 1}) + d}` + a}aa` `aa${a + `aaaa${c + (a = {b: 1}) + d}` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`"\`  \${a + \`    \${c + (a = {b: 1}) + d}\` + a}  \` \`  \${a + \`    \${c + (a = {b: 1}) + d}\` + a}  \`"`)
})

it('backtick escape', () => {
  const str = [
    'this.error(`\\`new URL(url, import.meta.url)\\` is not supported in SSR.`)',
    'this.error(`\\\\`)',
    'this.error(`\\``)',
  ].join('\n')
  expect(executeWithVerify(str)).toMatchInlineSnapshot(`
    "this.error(\`                                                          \`)
    this.error(\`  \`)
    this.error(\`  \`)"
  `)
})
