import { tokenizer } from 'acorn'

export function stripLiteral(code: string, forgiving = false) {
  const FILL = ' '
  let result = ''
  function fulfill(index: number) {
    if (index > result.length)
      result += code.slice(result.length, index).replace(/[^\n]/g, FILL)
  }

  const tokens = tokenizer(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    allowHashBang: true,
    allowAwaitOutsideFunction: true,
    allowImportExportEverywhere: true,
  })
  const inter = tokens[Symbol.iterator]()

  while (true) {
    try {
      const { done, value: token } = inter.next()
      if (done)
        break
      fulfill(token.start)
      if (token.type.label === 'string')
        result += code[token.start] + FILL.repeat(token.end - token.start - 2) + code[token.end - 1]
      else if (token.type.label === 'template')
        result += FILL.repeat(token.end - token.start)
      else
        result += code.slice(token.start, token.end)
    }
    catch (e) {
      if (!forgiving)
        throw e
    }
  }

  fulfill(code.length)

  return result
}
