import { describe, expect, it } from 'vitest'
import { executeWithVerify } from './utils'

describe('custom-fill', () => {
  it('acorn', () => {
    const result = executeWithVerify(
      `
// comment1
const a = 'aaaa'
/* comment2 */
const b = "bbbb"

const c = \`aaaa\${foo}dddd\${bar}\`
      `.trim(),
      {
        fillChar: '-',
        filter: s => s !== 'aaaa',
      },
    )

    expect(result).toMatchInlineSnapshot(`
      "           
      const a = 'aaaa'
                    
      const b = "----"

      const c = \`aaaa\${foo}----\${bar}\`"
    `)
  })
})
