import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  ReactNode,
} from 'react'

export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost'

export type CardSize = 'sm' | 'md' | 'lg'

export type CardRadius = 'none' | 'sm' | 'md' | 'lg' | 'full'

export interface CardClasses {
  root?: string
}

export interface CardOwnProps {
  variant?: CardVariant
  /** Padding scale applied to every compound part (Header / Content / Footer / Actions). */
  size?: CardSize
  radius?: CardRadius
  /** Adds button semantics, hover lift, focus ring, and keyboard activation. */
  clickable?: boolean
  /** Replaces children with skeleton placeholders. Sets aria-busy. */
  loading?: boolean
  disabled?: boolean
  /**
   * Render the single child element as the root, merging props onto it.
   * Useful for routing libraries: `<Card asChild><Link to="/" /></Card>`.
   */
  asChild?: boolean
  classes?: CardClasses
}

/* ── Polymorphic helpers (mirrors Button) ───────────────────────── */

type AsProp<E extends ElementType> = { as?: E }

type PropsToOmit<E extends ElementType, P> = keyof (AsProp<E> & P)

export type PolymorphicProps<E extends ElementType, P = object> = P &
  AsProp<E> &
  Omit<ComponentPropsWithoutRef<E>, PropsToOmit<E, P>>

export type PolymorphicRef<E extends ElementType> =
  ComponentPropsWithRef<E>['ref']

export type CardProps<E extends ElementType = 'div'> = PolymorphicProps<
  E,
  CardOwnProps
> & { ref?: PolymorphicRef<E> }

export type CardComponent = <E extends ElementType = 'div'>(
  props: CardProps<E>,
) => ReactNode
