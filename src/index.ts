import { _stripLiteralJsTokens } from './js-tokens'
import { stripLiteralRegex } from './regex'
import type { StripLiteralOptions } from './types'

export { stripLiteralAcorn, createIsLiteralPositionAcorn } from './acorn'
export { stripLiteralRegex } from './regex'
export { _stripLiteralJsTokens } from './js-tokens'
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
  mode: 'js-tokens' | 'regex'
  result: string
  resultJsTokens: {
    tokens: any[]
    error?: any
  }
} {
  const resultJsTokens = _stripLiteralJsTokens(code, options)
  if (!resultJsTokens.error) {
    return {
      mode: 'js-tokens',
      result: resultJsTokens.result,
      resultJsTokens,
    }
  }
  return {
    mode: 'regex',
    result: stripLiteralRegex(resultJsTokens.result + code.slice(resultJsTokens.result.length), options),
    resultJsTokens,
  }
}
