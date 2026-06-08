import type { CSSProperties } from 'react'

/**
 * `React.CSSProperties` extended with CSS custom-property keys.
 *
 * React's stock `CSSProperties` only lists the canonical CSS property
 * names, so writing `style={{ '--my-var': '12px' }}` errors out unless
 * each key is cast individually (`['--my-var' as never]` / `as string`).
 * The template-literal `--${string}` key signature lets the standard
 * properties stay strictly typed while opening the door for any
 * `--foo` custom property without casts.
 *
 * Use anywhere a component composes inline styles that include CSS
 * custom properties — Toast / Switch / overlay components, etc.
 *
 *     const style: CSSPropertiesWithVars = {
 *       color: 'red',                  // typed against CSSProperties
 *       '--toast-index': String(idx),  // typed against the var signature
 *     }
 */
export type CSSPropertiesWithVars = CSSProperties & {
  [key: `--${string}`]: string | number | undefined
}
