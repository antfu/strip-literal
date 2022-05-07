import { parse } from 'acorn'
import { describe, expect, it } from 'vitest'
import { stripLiteral } from '../src'

describe('works', () => {
  function executeWithVerify(code: string) {
    const result = stripLiteral(code)

    for (let i = 0; i < result.length; i++) {
      if (!result[i].match(/\s/))
        expect(result[i]).toBe(code[i])
    }

    expect(result.length).toBe(code.length)

    // make sure no syntax errors
    parse(result, { ecmaVersion: 'latest', sourceType: 'module' })

    return result
  }

  it('exported', () => {
    expect(executeWithVerify(`
    // comment1
    const a = 'aaaa'
    /* comment2 */
    const b = "bbbb"
    /*
      // comment3
    */
    /* // comment3 */
    // comment 4 /* comment 5 */
    const c = \`ccc\${a}\`

    let d = /re\\\\ge/g
  `))
      .toMatchInlineSnapshot(`
        "
                       
            const a = '    '
                          
            const b = \\"    \\"
              
                         
              
                             
                                        
            const c = \`   \${a}\`
        
            let d = /re\\\\\\\\ge/g
          "
      `)
  })
})
