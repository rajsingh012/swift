import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import type { CSSPropertiesWithVars } from '../internal/types'
import { DEFAULT_ELEMENT } from './Box.constants'
import { buildBoxStyle } from './Box.styles'
import type { BoxComponent, BoxStyleProps } from './Box.types'

type BoxRenderProps = BoxStyleProps &
  Omit<HTMLAttributes<HTMLElement>, keyof BoxStyleProps> & {
    as?: ElementType
    children?: ReactNode
  }

/**
 * The lowest-level layout primitive: a polymorphic element with token-driven
 * box-model props (spacing, sizing, background, radius, border, shadow). Adds
 * no classes of its own — everything resolves to an inline style built from
 * design tokens, so a consumer `style`/`className` always wins the cascade.
 */
const BoxRoot = forwardRef<HTMLElement, BoxRenderProps>(function Box(
  props,
  ref,
) {
  const {
    as,
    // style props — pulled out so they never leak onto the DOM element
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
    border,
    shadow,
    style,
    ...rest
  } = props

  const Component: ElementType = as ?? DEFAULT_ELEMENT

  const boxStyle = buildBoxStyle({
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
    border,
    shadow,
  })

  // Consumer `style` wins per-property over the token-derived style.
  const mergedStyle: CSSPropertiesWithVars = {
    ...boxStyle,
    ...(style as CSSProperties | undefined),
  }

  return <Component ref={ref} style={mergedStyle} {...rest} />
})

BoxRoot.displayName = 'Box'

export const Box = Object.assign(BoxRoot as unknown as BoxComponent, {
  Root: BoxRoot,
}) as BoxComponent & { Root: typeof BoxRoot }
