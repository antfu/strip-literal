import jsTokens, { type Token as JSToken } from 'js-tokens'
import type { StripLiteralOptions } from './types'

export function _stripLiteralJsTokens(code: string, options?: StripLiteralOptions) {
  const FILL = options?.fillChar ?? ' '
  const FILL_COMMENT = ' '
  let result = ''

  const filter = options?.filter ?? (() => true)

  const tokens: JSToken[] = []

  const factories: Partial<Record<JSToken['type'], [(value: string) => string, (body: string, token: JSToken) => string, boolean?]>> = {
    StringLiteral: [
      token => token.slice(1, -1),
      (body, token) => token.value[0] + FILL.repeat(body.length) + token.value[token.value.length - 1],
    ],
    SingleLineComment: [
      token => token,
      body => FILL_COMMENT.repeat(body.length),
      true,
    ],
    MultiLineComment: [
      token => token,
      body => body.replace(/[^\n]/g, FILL_COMMENT),
      true,
    ],
    RegularExpressionLiteral: [
      token => token,
      body => body.replace(/\/(.*)\/(\w?)$/g, (_, $1, $2) => `/${FILL.repeat($1.length)}/${$2}`),
    ],
    // `start${
    TemplateHead: [
      token => token.slice(1, -2),
      body => `\`${FILL.repeat(body.length)}\${`,
    ],
    // }end`
    TemplateTail: [
      token => token.slice(0, -2),
      body => `}${FILL.repeat(body.length)}\``,
    ],
    // }middle${
    TemplateMiddle: [
      token => token.slice(1, -2),
      body => `}${FILL.repeat(body.length)}\${`,
    ],
    NoSubstitutionTemplate: [
      token => token.slice(1, -1),
      body => `\`${FILL.repeat(body.length)}\``,
    ],
  }

  let error: any
  try {
    for (const token of jsTokens(code, { jsx: false })) {
      tokens.push(token)

      const factory = factories[token.type]
      if (factory) {
        const [getBody, getReplacement, skipFilter] = factory
        const body = getBody(token.value)
        if (skipFilter || filter(body)) {
          result += getReplacement(body, token)
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
