import type { StripLiteralOptions } from '../src'
import { expect } from 'vitest'
import { stripLiteral } from '../src'

export function executeWithVerify(code: string, options?: StripLiteralOptions): string {
  code = code.trim()
  // if (verifyAst && result.acorn.error)
  //   console.error(result.acorn.error)

  const stripped = stripLiteral(code, options)

  if (!options?.fillChar) {
    for (let i = 0; i < stripped.length; i++) {
      if (!/\s/.test(stripped[i]))
        expect(stripped[i]).toBe(code[i])
    }
  }

  expect(stripped.length).toBe(code.length)

  return stripped
}
