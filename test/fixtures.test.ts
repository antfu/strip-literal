import { describe, expect, it } from 'vitest'
import { executeWithVerify } from './utils'

describe('fixtures', () => {
  const cases = import.meta.glob('./fixtures/*.*', { query: '?raw', import: 'default' })
  for (const [path, input] of Object.entries(cases)) {
    if (path.includes('.output.'))
      continue
    it(path, async () => {
      const raw = await input() as string
      const code = executeWithVerify(raw)
      await expect(code)
        .toMatchFileSnapshot(path.replace(/\.(\w+)$/, '.output.$1'))
    })
  }
})
