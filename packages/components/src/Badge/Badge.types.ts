import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  MouseEvent,
  ReactNode,
} from 'react'

export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export type BadgeAppearance = 'solid' | 'soft' | 'outline' | 'subtle'

export type BadgeSize = 'sm' | 'md' | 'lg'

export type BadgeRadius = 'sm' | 'md' | 'full'

export type BadgeStatus = 'online' | 'offline' | 'away' | 'busy'

export interface BadgeClasses {
  root?: string
  dot?: string
  startIcon?: string
  endIcon?: string
  label?: string
  removeButton?: string
}

export interface BadgeOwnProps {
  variant?: BadgeVariant
  appearance?: BadgeAppearance
  size?: BadgeSize
  radius?: BadgeRadius
  /** Shorthand for `radius="full"`. Wins over `radius` if both passed. */
  pill?: boolean
  /** Renders a leading coloured dot before children. */
  dot?: boolean
  /** Renders a dot-only status indicator. Maps onto variant colours. */
  status?: BadgeStatus
  /** Numeric content — replaces children. Capped by `max` (default 99). */
  count?: number
  /** Cap for `count`. Anything above renders as `${max}+`. */
  max?: number
  startIcon?: ReactNode
  endIcon?: ReactNode
  /** Shows a trailing close button. Pair with `onRemove` for behaviour. */
  removable?: boolean
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void
  /** Adds button semantics (role, tabIndex, keyboard activation). */
  clickable?: boolean
  /** Replaces leading slot with a spinner; sets aria-busy. */
  loading?: boolean
  disabled?: boolean
  classes?: BadgeClasses
}

type AsProp<E extends ElementType> = { as?: E }

type PropsToOmit<E extends ElementType, P> = keyof (AsProp<E> & P)

export type PolymorphicProps<E extends ElementType, P = object> = P &
  AsProp<E> &
  Omit<ComponentPropsWithoutRef<E>, PropsToOmit<E, P>>

export type PolymorphicRef<E extends ElementType> =
  ComponentPropsWithRef<E>['ref']

export type BadgeProps<E extends ElementType = 'span'> = PolymorphicProps<
  E,
  BadgeOwnProps
> & { ref?: PolymorphicRef<E> }

export type BadgeComponent = <E extends ElementType = 'span'>(
  props: BadgeProps<E>,
) => ReactNode
