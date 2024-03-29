import { describe, expect, it } from 'vitest'
import { stripLiteralDetailed } from '../src'
import { stripLiteralRegex } from '../src/regex'
import { executeWithVerify } from './utils'

describe('fixtures', () => {
  const cases = import.meta.glob('./fixtures/*.*', { as: 'raw' })
  for (const [path, input] of Object.entries(cases)) {
    if (path.includes('.output.'))
      continue
    it(path, async () => {
      const raw = await input()
      const code = executeWithVerify(raw)
      await expect(code)
        .toMatchFileSnapshot(path.replace(/\.(\w+)$/, '.output.$1'))
    })
  }
})

describe('counter examples', () => {
  const cases = import.meta.glob('./fixtures/counter/*.*', { as: 'raw' })
  for (const [path, input] of Object.entries(cases)) {
    if (path.includes('.output.'))
      continue
    it(path, async () => {
      const raw = await input()
      await expect(stripLiteralDetailed(raw).result)
        .toMatchFileSnapshot(path.replace(/\.(\w+)$/, '.output.js-token.$1'))
      await expect(stripLiteralRegex(raw))
        .toMatchFileSnapshot(path.replace(/\.(\w+)$/, '.output.regex.$1'))
    })
  }
})
