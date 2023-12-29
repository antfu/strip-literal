import jsTokens, { type Token as JSToken } from 'js-tokens'
import type { StripLiteralOptions } from './types'

export function _stripLiteralJsTokens(code: string, options?: StripLiteralOptions) {
  const FILL = options?.fillChar ?? ' '
  const FILL_COMMENT = ' '
  let result = ''

  const filter = options?.filter ?? (() => true)

  const tokens: JSToken[] = []

  let error: any
  try {
    for (const token of jsTokens(code, { jsx: false })) {
      tokens.push(token)

      if (token.type === 'SingleLineComment') {
        result += FILL_COMMENT.repeat(token.value.length)
        continue
      }

      if (token.type === 'MultiLineComment') {
        result += token.value.replace(/[^\n]/g, FILL_COMMENT)
        continue
      }

      if (token.type === 'StringLiteral') {
        const body = token.value.slice(1, -1)
        if (filter(body)) {
          result += token.value[0] + FILL.repeat(body.length) + token.value[token.value.length - 1]
          continue
        }
      }

      if (token.type === 'NoSubstitutionTemplate') {
        const body = token.value.slice(1, -1)
        if (filter(body)) {
          result += `\`${body.replace(/[^\n]/g, FILL_COMMENT)}\``
          continue
        }
      }

      if (token.type === 'RegularExpressionLiteral') {
        const body = token.value
        if (filter(body)) {
          result += body.replace(/\/(.*)\/(\w?)$/g, (_, $1, $2) => `/${FILL.repeat($1.length)}/${$2}`)
          continue
        }
      }

      // `start${
      if (token.type === 'TemplateHead') {
        const body = token.value.slice(1, -2)
        if (filter(body)) {
          result += `\`${body.replace(/[^\n]/g, FILL_COMMENT)}\${`
          continue
        }
      }

      // }end`
      if (token.type === 'TemplateTail') {
        const body = token.value.slice(0, -2)
        if (filter(body)) {
          result += `}${body.replace(/[^\n]/g, FILL_COMMENT)}\``
          continue
        }
      }

      // }middle${
      if (token.type === 'TemplateMiddle') {
        const body = token.value.slice(1, -2)
        if (filter(body)) {
          result += `}${body.replace(/[^\n]/g, FILL_COMMENT)}\${`
          continue
        }
      }

      result += token.value
    }
  }
  catch (e) {
    error = e
  }

  return {
    error,
    result,
    tokens,
  }
}
