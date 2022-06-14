import { stripLiteralAcorn } from './acorn'
import { stripLiteralRegex } from './regex'

/**
 * Strip literal from code.
 *
 * Using Acorn's tokenizer first, and fallback to Regex if Acorn fails.
 */
export function stripLiteral(code: string) {
  try {
    return stripLiteralAcorn(code)
  }
  catch (e) {
    return stripLiteralRegex(code)
  }
}

