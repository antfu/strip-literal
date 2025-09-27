import type { Token as JSToken } from 'js-tokens'
import type { StripLiteralOptions } from './types'
import jsTokens from 'js-tokens'

const FILL_COMMENT = ' '

function stripLiteralFromToken(token: JSToken, fillChar: NonNullable<StripLiteralOptions['fillChar']>, filter: NonNullable<StripLiteralOptions['filter']>): string {
  if (token.type === 'SingleLineComment') {
    return FILL_COMMENT.repeat(token.value.length)
  }

  if (token.type === 'MultiLineComment') {
    return token.value.replace(/[^\n]/g, FILL_COMMENT)
  }

  if (token.type === 'StringLiteral') {
    // js-token sees exotic vue prop value as an unclosed string literal
    if (!token.closed) {
      return token.value
    }
    const body = token.value.slice(1, -1)
    if (filter(body)) {
      return token.value[0] + fillChar.repeat(body.length) + token.value[token.value.length - 1]
    }
  }

  if (token.type === 'NoSubstitutionTemplate') {
    const body = token.value.slice(1, -1)
    if (filter(body)) {
      return `\`${body.replace(/[^\n]/g, fillChar)}\``
    }
  }

  if (token.type === 'RegularExpressionLiteral') {
    const body = token.value
    if (filter(body)) {
      return body.replace(/\/(.*)\/(\w?)$/g, (_, $1, $2) => `/${fillChar.repeat($1.length)}/${$2}`)
    }
  }

  // `start${
  if (token.type === 'TemplateHead') {
    const body = token.value.slice(1, -2)
    if (filter(body)) {
      return `\`${body.replace(/[^\n]/g, fillChar)}\${`
    }
  }

  // }end`
  if (token.type === 'TemplateTail') {
    const body = token.value.slice(0, -2)
    if (filter(body)) {
      return `}${body.replace(/[^\n]/g, fillChar)}\``
    }
  }

  // }middle${
  if (token.type === 'TemplateMiddle') {
    const body = token.value.slice(1, -2)
    if (filter(body)) {
      return `}${body.replace(/[^\n]/g, fillChar)}\${`
    }
  }
  return token.value
}

function optionsWithDefaults(options?: StripLiteralOptions) {
  return {
    fillChar: options?.fillChar ?? ' ',
    filter: options?.filter ?? (() => true),
  }
}

/**
 * Strip literal from code.
 */
export function stripLiteral(code: string, options?: StripLiteralOptions) {
  let result = ''

  const _options = optionsWithDefaults(options)

  // jsx: false is more correct when parsing html
  for (const token of jsTokens(code, { jsx: false })) {
    result += stripLiteralFromToken(token, _options.fillChar, _options.filter)
  }

  return result
}

/**
 * Strip literal from code, return more detailed information.
 */
export function stripLiteralDetailed(code: string, options?: StripLiteralOptions) {
  let result = ''
  const tokens: JSToken[] = []
  const _options = optionsWithDefaults(options)

  // jsx: false is more correct when parsing html
  for (const token of jsTokens(code, { jsx: false })) {
    tokens.push(token)
    result += stripLiteralFromToken(token, _options.fillChar, _options.filter)
  }
  return {
    result,
    tokens,
  }
}
