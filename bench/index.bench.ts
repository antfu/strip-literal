import { readFile } from 'fs/promises'
import { bench, describe } from 'vitest'
import { stripLiteralAcorn, stripLiteralRegex } from '../src'

const modules = {
  'vue-global': './node_modules/vue/dist/vue.runtime.global.js',
  'three': './node_modules/three/build/three.module.js',
}

Object.entries(modules).forEach(([name, path]) => {
  describe(`bench ${name}`, async () => {
    const code = await readFile(path, 'utf-8')
    bench('regex', () => {
      stripLiteralRegex(code)
    })
    bench('acorn', () => {
      stripLiteralAcorn(code)
    })
  })
})
