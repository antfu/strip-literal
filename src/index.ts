import { _stripLiteralAcorn } from './acorn'
import { _stripLiteralJsTokens } from './js-tokens'
import { stripLiteralRegex } from './regex'
import type { StripLiteralOptions } from './types'

export { stripLiteralAcorn, createIsLiteralPositionAcorn } from './acorn'
export { stripLiteralRegex } from './regex'
export * from './types'

/**
 * Strip literal from code.
 *
 * Using Acorn's tokenizer first, and fallback to Regex if Acorn fails.
 */
export function stripLiteral(code: string, options?: StripLiteralOptions) {
  return stripLiteralDetailed(code, options).result
}

/**
 * Strip literal from code, return more detailed information.
 *
 * Using Acorn's tokenizer first, and fallback to Regex if Acorn fails.
 */
export function stripLiteralDetailed(code: string, options?: StripLiteralOptions): {
  mode: 'acorn' | 'regex'
  result: string
  acorn: {
    tokens: any[]
    error?: any
  }
} {
  const acorn = _stripLiteralJsTokens(code, options)
  if (!acorn.error) {
    return {
      mode: 'acorn',
      result: acorn.result,
      acorn,
    }
  }
  return {
    mode: 'regex',
    result: stripLiteralRegex(acorn.result + code.slice(acorn.result.length), options),
    acorn,
  }
}
