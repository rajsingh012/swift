import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ReactNode,
} from 'react'

/**
 * Numeric steps on the spacing scale (`--space-*`). A plain number resolves
 * to its design token; any raw CSS string (`'2rem'`, `'auto'`, `'50%'`) is
 * passed straight through.
 */
export type SpaceScale =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 10
  | 12
  | 16
  | 20
  | 24

// `string & {}` keeps the scale autocomplete while still accepting any
// raw CSS length.
export type SpaceValue = SpaceScale | (string & {})

/** Sizing values: a number is treated as pixels, a string passes through. */
export type Dimension = number | (string & {})

export type BoxDisplay =
  | 'block'
  | 'inline-block'
  | 'inline'
  | 'flex'
  | 'inline-flex'
  | 'grid'
  | 'inline-grid'
  | 'none'
  | 'contents'

export type BoxRadius =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | 'full'

export type BoxShadow =
  | 'none'
  | 'level1'
  | 'level2'
  | 'level3'
  | 'level4'
  | 'level5'
  | 'level6'

/** Semantic background tokens (`--color-surface-*`). */
export type BoxBg =
  | 'transparent'
  | 'surface'
  | 'surface-muted'
  | 'surface-subtle'
  | 'surface-elevated'
  | 'surface-inverse'
  | 'brand'
  | 'brand-muted'
  | 'success-muted'
  | 'warning-muted'
  | 'critical-muted'
  | 'highlight-muted'

/** Border tone (`--color-stroke-*`). `true` is shorthand for `'default'`. */
export type BoxBorderTone =
  | 'default'
  | 'muted'
  | 'strong'
  | 'brand'
  | 'success'
  | 'warning'
  | 'critical'

export type BoxBorder = boolean | BoxBorderTone

export type BoxOverflow =
  | 'visible'
  | 'hidden'
  | 'clip'
  | 'scroll'
  | 'auto'

/**
 * The box-model style props. Every value is optional; an unset prop emits
 * no style at all (so it inherits / cascades as normal CSS).
 */
export interface BoxStyleProps {
  /** Padding — all sides. */
  p?: SpaceValue
  /** Padding — inline (left + right). */
  px?: SpaceValue
  /** Padding — block (top + bottom). */
  py?: SpaceValue
  pt?: SpaceValue
  pr?: SpaceValue
  pb?: SpaceValue
  pl?: SpaceValue
  /** Margin — all sides. */
  m?: SpaceValue
  /** Margin — inline (left + right). */
  mx?: SpaceValue
  /** Margin — block (top + bottom). */
  my?: SpaceValue
  mt?: SpaceValue
  mr?: SpaceValue
  mb?: SpaceValue
  ml?: SpaceValue
  display?: BoxDisplay
  width?: Dimension
  height?: Dimension
  minWidth?: Dimension
  minHeight?: Dimension
  maxWidth?: Dimension
  maxHeight?: Dimension
  overflow?: BoxOverflow
  /** Semantic background token. */
  bg?: BoxBg
  /** Corner radius token. */
  radius?: BoxRadius
  /** 1px border in a stroke tone. `true` → `'default'`. */
  border?: BoxBorder
  /** Elevation shadow token. */
  shadow?: BoxShadow
}

/* ── Polymorphism ────────────────────────────────────────────────────────── */

type AsProp<E extends ElementType> = { as?: E }

type PropsToOmit<E extends ElementType, P> = keyof (AsProp<E> & P)

export type PolymorphicProps<E extends ElementType, P = object> = P &
  AsProp<E> &
  Omit<ComponentPropsWithoutRef<E>, PropsToOmit<E, P>>

export type PolymorphicRef<E extends ElementType> =
  ComponentPropsWithRef<E>['ref']

export type BoxProps<E extends ElementType = 'div'> = PolymorphicProps<
  E,
  BoxStyleProps
> & { ref?: PolymorphicRef<E> }

export type BoxComponent = <E extends ElementType = 'div'>(
  props: BoxProps<E>,
) => ReactNode
