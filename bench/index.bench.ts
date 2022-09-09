import { describe, bench } from 'vitest'
import { stripLiteralAcorn, stripLiteralRegex } from '../src'
import { readFile } from 'fs/promises'

let code = await readFile('./node_modules/vue/dist/vue.runtime.global.js', 'utf-8')

describe('bench', () => {
  bench('regex', ()=>{
    stripLiteralRegex(code)
  })
  bench('acorn', ()=>{
    stripLiteralAcorn(code)
  })
})
