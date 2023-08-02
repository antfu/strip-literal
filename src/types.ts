export interface StripLiteralOptions {
  /**
   * Will be called for each string literal. Return false to skip stripping.
   */
  filter?: (s: string) => boolean
}
