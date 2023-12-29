/* eslint-disable no-template-curly-in-string */
import { expect, it } from 'vitest'
import { createIsLiteralPositionAcorn } from '../src'

function execute(code: string) {
  const isLiteralPosition = createIsLiteralPositionAcorn(code)

  const positions = Array.from({ length: code.length }, (_, i) => i)
  const result = positions
    .map((pos) => {
      if (code[pos] === '\n')
        return isLiteralPosition(pos) ? '+\n' : '\n'
      return isLiteralPosition(pos) ? '*' : code[pos]
    })
    .join('')

  return result
}

it('works', () => {
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

it('template string nested', () => {
  expect(execute(
    '`aa${a + `a`}aa`',
  )).toMatchSnapshot()
})
