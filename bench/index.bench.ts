import { describe, bench } from 'vitest'
import { stripLiteralAcorn, stripLiteralRegex } from '../src'
import { readFile } from 'fs/promises'

const modules = {
  'vue-global': './node_modules/vue/dist/vue.runtime.global.js',
  'three': './node_modules/three/build/three.module.js'
}

Object.entries(modules).map(([name, path]) => {
  describe('bench ' + name, async () => {
    let code = await readFile(path, 'utf-8')
    bench('regex', ()=>{
      stripLiteralRegex(code)
    })
    bench('acorn', ()=>{
      stripLiteralAcorn(code)
    })
  })
})
