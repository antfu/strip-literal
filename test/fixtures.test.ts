import { describe, expect, test } from 'vitest'
import { executeWithVerify } from './utils'

describe('fixtures', () => {
  const cases = import.meta.glob('./fixtures/*.*', { as: 'raw' })
  for (const [path, input] of Object.entries(cases)) {
    if (path.includes('.output.'))
      continue
    test(path, async () => {
      const raw = await input()
      const code = executeWithVerify(raw, !!path.match(/\.(ts|js)$/) && !raw.includes('skip-verify'))
      await expect(code)
        .toMatchFileSnapshot(path.replace(/\.(\w+)$/, '.output.$1'))
    })
  }
})
