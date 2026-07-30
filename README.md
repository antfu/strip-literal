# strip-literal

[![NPM version](https://img.shields.io/npm/v/strip-literal?color=a1b858&label=)](https://www.npmjs.com/package/strip-literal)

Strip comments and string literals from JavaScript code. Powered by [`js-tokens`](https://github.com/lydell/js-tokens).

## Usage

> [!NOTE]
> Since v4.0.0, this package is ESM-only. Use v3.x if you need CommonJS.


```ts
import { stripLiteral } from 'strip-literal'

stripLiteral('const foo = `//foo ${bar}`') // 'const foo = `       ${bar}`'
```

Comments, string literals will be replaced by spaces with the same length to keep the source map untouched.

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg' alt="Sponsors"/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2022 [Anthony Fu](https://github.com/antfu)
