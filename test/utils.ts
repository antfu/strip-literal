import { parse } from 'acorn'
import { expect } from 'vitest'
import type { StripLiteralOptions } from '../src'
import { stripLiteralDetailed } from '../src'

export function executeWithVerify(code: string, verifyAst = true, options?: StripLiteralOptions) {
  code = code.trim()
  const result = stripLiteralDetailed(code, options)

  // if (verifyAst && result.acorn.error)
  //   console.error(result.acorn.error)

  const stripped = result.result

  for (let i = 0; i < stripped.length; i++) {
    if (!stripped[i].match(/\s/))
      expect(stripped[i]).toBe(code[i])
  }

  expect(stripped.length).toBe(code.length)

  // make sure no syntax errors
  if (verifyAst)
    parse(stripped, { ecmaVersion: 'latest', sourceType: 'module' })

  return `// mode: ${result.mode}\n${stripped}`
}
