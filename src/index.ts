import { _stripLiteralAcorn } from './acorn'
import { stripLiteralRegex } from './regex'

export { stripLiteralAcorn, createIsLiteralPositionAcorn } from './acorn'
export { stripLiteralRegex } from './regex'

/**
 * Strip literal from code.
 *
 * Using Acorn's tokenizer first, and fallback to Regex if Acorn fails.
 */
export function stripLiteral(code: string) {
  return stripLiteralDetailed(code).result
}

/**
 * Strip literal from code, return more detailed information.
 *
 * Using Acorn's tokenizer first, and fallback to Regex if Acorn fails.
 */
export function stripLiteralDetailed(code: string): {
  mode: 'acorn' | 'regex'
  result: string
  acorn: {
    tokens: any[]
    error?: any
  }
} {
  const acorn = _stripLiteralAcorn(code)
  if (!acorn.error) {
    return {
      mode: 'acorn',
      result: acorn.result,
      acorn,
    }
  }
  return {
    mode: 'regex',
    result: stripLiteralRegex(acorn.result + code.slice(acorn.result.length)),
    acorn,
  }
}
