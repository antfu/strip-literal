import { tokenizer } from 'acorn'
import type { Parser, Token } from 'acorn'

/**
 * Strip literal using Acorn's tokenizer.
 *
 * Will throw error if the input is not valid JavaScript.
 */
export function _stripLiteralAcorn(code: string) {
  const FILL = ' '
  let result = ''
  function fulfill(index: number) {
    if (index > result.length)
      result += code.slice(result.length, index).replace(/[^\n]/g, FILL)
  }

  const tokens: Token[] = []
  const pasers = tokenizer(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    allowHashBang: true,
    allowAwaitOutsideFunction: true,
    allowImportExportEverywhere: true,
  }) as Parser & ReturnType<typeof tokenizer>
  const iter = pasers[Symbol.iterator]()

  let error: any
  try {
    while (true) {
      const { done, value: token } = iter.next()
      if (done)
        break
      tokens.push(token)
      fulfill(token.start)
      if (token.type.label === 'string')
        result += code[token.start] + FILL.repeat(token.end - token.start - 2) + code[token.end - 1]
      else if (token.type.label === 'template')
        result += FILL.repeat(token.end - token.start)
      else if (token.type.label === 'regexp')
        result += code.slice(token.start, token.end).replace(/\/(.*)\/(\w?)$/g, (_, $1, $2) => `/${FILL.repeat($1.length)}/${$2}`)
      else
        result += code.slice(token.start, token.end)
    }

    fulfill(code.length)
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

/**
 * Strip literal using Acorn's tokenizer.
 *
 * Will throw error if the input is not valid JavaScript.
 */
export function stripLiteralAcorn(code: string) {
  const result = _stripLiteralAcorn(code)
  if (result.error)
    throw result.error
  return result.result
}

/**
 * Returns a function that returns whether the position is
 * in a literal using Acorn's tokenizer.
 *
 * Will throw error if the input is not valid JavaScript.
 */
export function createIsLiteralPositionAcorn(code: string) {
  // literal start position, non-literal start position, literal start position, ...
  const positionList: number[] = []

  const tokens = tokenizer(code, {
    ecmaVersion: 'latest',
    sourceType: 'module',
    allowHashBang: true,
    allowAwaitOutsideFunction: true,
    allowImportExportEverywhere: true,
    onComment(_isBlock, _text, start, end) {
      positionList.push(start)
      positionList.push(end)
    },
  })
  const inter = tokens[Symbol.iterator]()

  while (true) {
    const { done, value: token } = inter.next()
    if (done)
      break
    if (token.type.label === 'string') {
      positionList.push(token.start + 1)
      positionList.push(token.end - 1)
    }
    else if (token.type.label === 'template') {
      positionList.push(token.start)
      positionList.push(token.end)
    }
  }

  return (position: number) => {
    const i = binarySearch(positionList, v => position < v)
    return (i - 1) % 2 === 0
  }
}

function binarySearch(array: ArrayLike<number>, pred: (v: number) => boolean) {
  let low = -1
  let high = array.length
  while (1 + low < high) {
    const mid = low + ((high - low) >> 1)
    if (pred(array[mid]))
      high = mid
    else
      low = mid
  }
  return high
}
