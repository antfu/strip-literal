export interface StripLiteralOptions {
  /**
   * Will be called for each string literal. Return false to skip stripping.
   */
  filter?: (s: string) => boolean

  /**
   * Fill the stripped literal with this character.
   * It must be a single character.
   *
   * @default ' '
   */
  fillChar?: string
}
