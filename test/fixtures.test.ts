import { describe, expect, test } from 'vitest'
import { executeWithVerify } from './utils'

describe('fixtures', () => {
  const cases = import.meta.glob('./fixtures/*.*', { as: 'raw' })
  for (const [path, input] of Object.entries(cases)) {
    if (path.includes('.output.'))
      continue
    test(path, async () => {
      const result = executeWithVerify(await input(), !!path.match(/\.(ts|js)$/))
      const code = `// mode: ${result.mode}\n${result.code}`
      await expect(code)
        .toMatchFileSnapshot(path.replace(/\.(\w+)$/, '.output.$1'))
    })
  }
})
