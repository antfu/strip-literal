/* eslint-disable no-template-curly-in-string */
import { parse } from 'acorn'
import { expect, test } from 'vitest'
import { stripLiteral } from '../src'

function executeWithVerify(code: string) {
  code = code.trim()
  const result = stripLiteral(code)

  for (let i = 0; i < result.length; i++) {
    if (!result[i].match(/\s/))
      expect(result[i]).toBe(code[i])
  }

  expect(result.length).toBe(code.length)

  // make sure no syntax errors
  parse(result, { ecmaVersion: 'latest', sourceType: 'module' })

  return result
}

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

test('special char', () => {
  expect(executeWithVerify(`
function ssrRender(_ctx, _push, _parent, _attrs) {
  _push(\`<div\${_ssrRenderAttrs(_mergeProps({ class: "text-sm" }, _attrs))}><a href="#" class="font-medium text-blue-600 hover:text-blue-500"> ¿Olvidaste tu contraseña? </a></div>\`)
}
  `)).toMatchSnapshot()
})

test('template string nested', () => {
  let str = '`aaaa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot('"`    `"')

  str = '`aaaa` `aaaa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot('"`    ` `    `"')

  str = '`aa${a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot('"`  \${a}  `"')

  str = '`aa${a + `a` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot('"`  \${a + ` ` + a}  `"')

  str = '`aa${a + `a` + a}aa` `aa${a + `a` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot('"`  \${a + ` ` + a}  ` `  \${a + ` ` + a}  `"')

  str = '`aa${a + `aaaa${c + (a = {b: 1}) + d}` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot('"`  \${a + `    \${c + (a = {b: 1}) + d}` + a}  `"')

  str = '`aa${a + `aaaa${c + (a = {b: 1}) + d}` + a}aa` `aa${a + `aaaa${c + (a = {b: 1}) + d}` + a}aa`'
  expect(executeWithVerify(str)).toMatchInlineSnapshot('"`  \${a + `    \${c + (a = {b: 1}) + d}` + a}  ` `  \${a + `    \${c + (a = {b: 1}) + d}` + a}  `"')
})

test('backtick escape', () => {
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

test('forgiving', () => {
  expect(stripLiteral(`
<script type="module">
  const rawModules = import.meta.globEager('/dir/*.json', {
    as: 'raw'
  })
  const globraw = {}
  Object.keys(rawModules).forEach((key) => {
    globraw[key] = JSON.parse(rawModules[key])
  })
  document.querySelector('.globraw').textContent = JSON.stringify(
    globraw,
    null,
    2
  )
</script>
`, true)).toMatchInlineSnapshot(`
  "
  <script type=\\"      \\">
    const rawModules = import.meta.globEager('           ', {
      as: '   '
    })
    const globraw = {}
    Object.keys(rawModules).forEach((key) => {
      globraw[key] = JSON.parse(rawModules[key])
    })
    document.querySelector('        ').textContent = JSON.stringify(
      globraw,
      null,
      2
    )
  <        
  "
`)
})
