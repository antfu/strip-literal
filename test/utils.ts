import { expect } from 'vitest'
import type { StripLiteralOptions } from '../src'
import { stripLiteralDetailed } from '../src'

export function executeWithVerify(code: string, options?: StripLiteralOptions) {
  code = code.trim()
  const result = stripLiteralDetailed(code, options)

  // if (verifyAst && result.acorn.error)
  //   console.error(result.acorn.error)

  const stripped = result.result

  if (!options?.fillChar) {
    for (let i = 0; i < stripped.length; i++) {
      if (!stripped[i].match(/\s/))
        expect(stripped[i]).toBe(code[i])
    }
  }

  expect(stripped.length).toBe(code.length)

  return stripped
}
