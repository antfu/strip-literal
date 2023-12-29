/* eslint-disable test/consistent-test-it */
import { readFile } from 'node:fs/promises'
import { bench, describe } from 'vitest'
import { _stripLiteralJsTokens, stripLiteralAcorn, stripLiteralRegex } from '../src'

const modules = {
  'vue-global': './node_modules/vue/dist/vue.runtime.global.js',
  'three': './node_modules/three/build/three.module.js',
}

Object.entries(modules).forEach(([name, path]) => {
  describe(`bench ${name}`, async () => {
    const code = await readFile(path, 'utf-8')
    bench('stripLiteral (js-tokens)', () => {
      _stripLiteralJsTokens(code)
    })
    bench('stripLiteral (regex)', () => {
      stripLiteralRegex(code)
    })
    bench('stripLiteral (acorn)', () => {
      stripLiteralAcorn(code)
    })
  })
})
