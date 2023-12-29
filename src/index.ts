import { stripLiteralJsTokens } from './js-tokens'
import type { StripLiteralOptions } from './types'

export { stripLiteralJsTokens } from './js-tokens'
export * from './types'

/**
 * Strip literal from code.
 */
export function stripLiteral(code: string, options?: StripLiteralOptions) {
  return stripLiteralDetailed(code, options).result
}

/**
 * Strip literal from code, return more detailed information.
 */
export function stripLiteralDetailed(code: string, options?: StripLiteralOptions) {
  return stripLiteralJsTokens(code, options)
}
