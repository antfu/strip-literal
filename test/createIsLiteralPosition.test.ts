/* eslint-disable no-template-curly-in-string */
import { expect, test } from 'vitest'
import { createIsLiteralPositionAcorn } from '../src'

function execute(code: string) {
  const isLiteralPosition = createIsLiteralPositionAcorn(code)

  const positions = new Array(code.length)
    .fill(0)
    .map((_, i) => i)
  const result = positions
    .map((pos) => {
      if (code[pos] === '\n')
        return isLiteralPosition(pos) ? '+\n' : '\n'
      return isLiteralPosition(pos) ? '*' : code[pos]
    })
    .join('')

  return result
}

test('works', () => {
  expect(execute(`
const a = 0
  `)).toMatchSnapshot()
  expect(execute(`
// a
const a = 0
  `)).toMatchSnapshot()
  expect(execute(`
/* a */
const a = 0
  `)).toMatchSnapshot()
  expect(execute(`
/*
  a
*/
const a = 0
  `)).toMatchSnapshot()
  expect(execute(`
const a = 'a'
  `)).toMatchSnapshot()
  expect(execute(`
const a = "a"
  `)).toMatchSnapshot()
  expect(execute(`
const a = \`c\${b}\`
  `)).toMatchSnapshot()
})

test('template string nested', () => {
  expect(execute(
    '`aa${a + `a`}aa`',
  )).toMatchSnapshot()
})
