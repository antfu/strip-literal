import { stripLiteralJsTokens } from './js-tokens'
import type { StripLiteralOptions } from './types'

export { stripLiteralJsTokens } from './js-tokens'
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
  result: string
  resultJsTokens: {
    tokens: any[]
  }
} {
  const resultJsTokens = stripLiteralJsTokens(code, options)
  return {
    result: resultJsTokens.result,
    resultJsTokens,
  }
}
