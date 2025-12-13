declare module "css.escape" {
  /**
   * Minimal typing for the css.escape polyfill.
   * Matches the browser's CSS.
   */
  export default function cssEscape(ident: string): string;
}