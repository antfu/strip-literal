const multilineCommentsRE = /\/\*([^*\/])*?\*\//gms
const singlelineCommentsRE = /(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/gm
const templateLiteralRE = /\$\{(\s*(?:|{.*}|(?!\$\{).|\n|\r)*?\s*)\}/g
const quotesRE = [
  /(["'`])((?:\\\1|(?!\1)|.|\r)*?)\1/gm,
  /([`])((?:\\\1|(?!\1)|.|\n|\r)*?)\1/gm, // multi-line strings (i.e. template literals only)
]

/**
 * Strip literal using RegExp.
 *
 * This will be faster and can work on non-JavaScript input.
 * But will have some caveats on distinguish strings and comments.
 */
export function stripLiteralRegex(code: string) {
  code = code
    .replace(multilineCommentsRE, s => ' '.repeat(s.length))
    .replace(singlelineCommentsRE, s => ' '.repeat(s.length))

  let expanded = code
  // Recursively replace ${} to support nested constructs (e.g. ${`${x}`})
  for (let i = 0; i < 16; i++) {
    const before = expanded
    expanded = expanded.replace(templateLiteralRE, '` $1`')
    if (expanded === before)
      break
  }

  quotesRE.forEach((re) => {
    expanded = expanded
      .replace(re, (s, quote, body, index) => {
        code = code.slice(0, index + 1) + ' '.repeat(s.length - 2) + code.slice(index + s.length - 1)
        return quote + ' '.repeat(s.length - 2) + quote
      })
  })

  return code
}
