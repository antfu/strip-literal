import { describe, expect, it } from 'vitest'
import { executeWithVerify } from './utils'

describe('filter', () => {
  it('should filter correctly', () => {
    const items: string[] = []
    const result = executeWithVerify(
      `
// comment1
const a = 'aaaa'
/* comment2 */
const b = "bbbb"

const c = \`aaaa\${foo}dddd\${bar}\`
      `.trim(),
      true,
      {
        filter: (s) => {
          items.push(s)
          return s !== 'aaaa'
        },
      },
    )

    expect(result).toMatchInlineSnapshot(`
      "// mode: js-tokens
                 
      const a = 'aaaa'
                    
      const b = "    "

      const c = \`aaaa\${foo}    \${bar}\`"
    `)

    expect(items).toMatchInlineSnapshot(`
      [
        "aaaa",
        "bbbb",
        "aaaa",
        "dddd",
        "",
      ]
    `)
  })
})
