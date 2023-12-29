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
      false,
      {
        fillChar: '-',
        filter: s => s !== 'aaaa',
      },
    )

    expect(result).toMatchInlineSnapshot(`
      "// mode: acorn
                 
      const a = 'aaaa'
                    
      const b = "----"

      const c = \`aaaa\${foo}----\${bar}\`"
    `)
  })
})
