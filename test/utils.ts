import { parse } from 'acorn'
import { expect } from 'vitest'
import { stripLiteralAcorn, stripLiteralRegex } from '../src'

export function executeWithVerify(code: string, verifyAst = true) {
  code = code.trim()
  let result: string
  let mode = 'acorn'
  // let parseError: any
  try {
    result = stripLiteralAcorn(code)
  }
  catch (e) {
    result = stripLiteralRegex(code)
    mode = 'regex'
    // parseError = e
  }

  // if (verifyAst && parseError)
  //   console.error(parseError)

  for (let i = 0; i < result.length; i++) {
    if (!result[i].match(/\s/))
      expect(result[i]).toBe(code[i])
  }

  expect(result.length).toBe(code.length)

  // make sure no syntax errors
  if (verifyAst)
    parse(result, { ecmaVersion: 'latest', sourceType: 'module' })

  return {
    code: result,
    mode,
  }
}
