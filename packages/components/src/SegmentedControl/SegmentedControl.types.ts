import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from 'react'

export type SegmentedControlOrientation = 'horizontal' | 'vertical'
export type SegmentedControlSize = 'sm' | 'md' | 'lg'
export type SegmentedControlDirection = 'ltr' | 'rtl'

export interface SegmentedControlClasses {
  root?: string
  item?: string
  indicator?: string
}

export interface SegmentedControlRootProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'defaultValue' | 'onChange' | 'dir'
  > {
  /** Controlled selected value. Pair with `onValueChange`. */
  value?: string
  /** Uncontrolled initial value. When neither `value` nor `defaultValue` is
   *  given, the first non-disabled item is selected on mount (Radix-style) —
   *  a segmented control always shows a selection. */
  defaultValue?: string
  onValueChange?: (value: string) => void

  orientation?: SegmentedControlOrientation
  size?: SegmentedControlSize

  /** Disable the whole control — no item can be selected, arrow nav is inert. */
  disabled?: boolean
  /** Focusable but immutable — receives focus, ignores selection attempts. */
  readOnly?: boolean

  /** Stretch to fill the container; items share the available width equally. */
  fullWidth?: boolean
  /** Every item takes the width of the widest item (container stays
   *  content-sized). Ignored when `fullWidth` is set. */
  equalWidth?: boolean

  /** When false, arrow-key navigation stops at the first / last item instead
   *  of wrapping around. Default true. */
  loop?: boolean

  /** Explicit direction. Otherwise sniffed from `closest('[dir]')` on mount. */
  dir?: SegmentedControlDirection

  /** Override the generated id prefix used for item ARIA wiring. */
  id?: string

  /** Submitted with the surrounding form via a hidden input carrying the
   *  selected value. */
  name?: string

  classes?: SegmentedControlClasses
  children?: ReactNode
}

export interface SegmentedControlItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string
  disabled?: boolean
  /** Render the consumer's single child element instead of a <button>. */
  asChild?: boolean
  className?: string
  children?: ReactNode
}

export interface SegmentedControlIndicatorProps
  extends HTMLAttributes<HTMLSpanElement> {
  className?: string
}
