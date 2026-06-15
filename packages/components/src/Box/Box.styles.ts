import type { CSSPropertiesWithVars } from '../internal/types'
import {
  bgVar,
  borderColorVar,
  radiusVar,
  shadowVar,
} from './Box.constants'
import type {
  BoxBorder,
  BoxStyleProps,
  Dimension,
  SpaceValue,
} from './Box.types'

/** A scale step → `var(--space-N)`; any raw string passes through. */
function space(value: SpaceValue | undefined): string | undefined {
  if (value == null) return undefined
  return typeof value === 'number' ? `var(--space-${value})` : value
}

/** A number → pixels; any raw string passes through. */
function dimension(value: Dimension | undefined): string | undefined {
  if (value == null) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

/** Resolve `border` (boolean | tone) to a CSS border shorthand. */
function border(value: BoxBorder | undefined): string | undefined {
  if (value == null || value === false) return undefined
  const tone = value === true ? 'default' : value
  return `1px solid ${borderColorVar[tone]}`
}

/**
 * Translate Box's style props into a plain inline-style object built from
 * design tokens. Inline styles (not Tailwind classes) keep the scale
 * dynamic without depending on the consumer's Tailwind JIT picking up
 * arbitrary class names — and they always win the cascade over the token
 * defaults, exactly like a hand-written `style`.
 *
 * Precedence for spacing: the side prop (`pt`) beats the axis (`py`) beats
 * the shorthand (`p`) — mirroring how Tailwind's `pt-* py-* p-*` resolve.
 */
export function buildBoxStyle(props: BoxStyleProps): CSSPropertiesWithVars {
  const {
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    display,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    overflow,
    bg,
    radius,
    border: borderProp,
    shadow,
  } = props

  const style: CSSPropertiesWithVars = {}
  const out = style as Record<string, string>

  const set = (key: string, value: string | undefined) => {
    if (value !== undefined) out[key] = value
  }

  set('paddingTop', space(pt ?? py ?? p))
  set('paddingRight', space(pr ?? px ?? p))
  set('paddingBottom', space(pb ?? py ?? p))
  set('paddingLeft', space(pl ?? px ?? p))

  set('marginTop', space(mt ?? my ?? m))
  set('marginRight', space(mr ?? mx ?? m))
  set('marginBottom', space(mb ?? my ?? m))
  set('marginLeft', space(ml ?? mx ?? m))

  set('display', display)
  set('width', dimension(width))
  set('height', dimension(height))
  set('minWidth', dimension(minWidth))
  set('minHeight', dimension(minHeight))
  set('maxWidth', dimension(maxWidth))
  set('maxHeight', dimension(maxHeight))
  set('overflow', overflow)

  set('backgroundColor', bg ? bgVar[bg] : undefined)
  set('borderRadius', radius ? radiusVar[radius] : undefined)
  set('border', border(borderProp))
  set('boxShadow', shadow ? shadowVar[shadow] : undefined)

  return style
}
