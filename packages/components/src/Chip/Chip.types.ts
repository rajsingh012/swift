import type {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  MouseEvent,
  ReactNode,
} from 'react'

export type ChipVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export type ChipAppearance = 'solid' | 'soft' | 'outline'

export type ChipSize = 'sm' | 'md' | 'lg'

export type ChipRadius = 'sm' | 'md' | 'full'

export type ChipSelectionMode = 'single' | 'multiple' | 'none'

export interface ChipClasses {
  root?: string
  startIcon?: string
  endIcon?: string
  avatar?: string
  label?: string
  removeButton?: string
  check?: string
}

export interface ChipOwnProps {
  variant?: ChipVariant
  appearance?: ChipAppearance
  size?: ChipSize
  radius?: ChipRadius
  /** Toggled state. Controlled by `<ChipGroup>` if a `value` prop is set and a group ancestor exists. */
  selected?: boolean
  /** Fires when the toggled state changes (Enter / Space / click). */
  onSelectedChange?: (selected: boolean) => void
  /** Identifier used by `<ChipGroup>` to track selection. Ignored without a group. */
  value?: string
  disabled?: boolean
  loading?: boolean
  removable?: boolean
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void
  startIcon?: ReactNode
  endIcon?: ReactNode
  /** Leading thumbnail slot — rounded, edge-aligned. Useful for user / channel chips. */
  avatar?: ReactNode
  /** Show a leading check glyph when selected. Defaults to true. */
  showCheckOnSelected?: boolean
  classes?: ChipClasses
}

export interface ChipGroupClasses {
  root?: string
}

export interface ChipGroupOwnProps {
  /** Controlled selection. Use a string for `selectionMode="single"`, an array for `"multiple"`. */
  value?: string | readonly string[] | null
  /** Initial uncontrolled selection. */
  defaultValue?: string | readonly string[]
  onValueChange?: (value: string | readonly string[] | null) => void
  selectionMode?: ChipSelectionMode
  disabled?: boolean
  size?: ChipSize
  orientation?: 'horizontal' | 'vertical'
  /** Visually-hidden label or `aria-labelledby` reference for the group. */
  'aria-label'?: string
  'aria-labelledby'?: string
  classes?: ChipGroupClasses
}

/* ── Polymorphic helpers (mirrors Button) ───────────────────────── */

type AsProp<E extends ElementType> = { as?: E }

type PropsToOmit<E extends ElementType, P> = keyof (AsProp<E> & P)

export type PolymorphicProps<E extends ElementType, P = object> = P &
  AsProp<E> &
  Omit<ComponentPropsWithoutRef<E>, PropsToOmit<E, P>>

export type PolymorphicRef<E extends ElementType> =
  ComponentPropsWithRef<E>['ref']

export type ChipProps<E extends ElementType = 'button'> = PolymorphicProps<
  E,
  ChipOwnProps
> & { ref?: PolymorphicRef<E> }

export type ChipComponent = <E extends ElementType = 'button'>(
  props: ChipProps<E>,
) => ReactNode
