import type {
  HTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from 'react'

export type SliderOrientation = 'horizontal' | 'vertical'

/** Value is always an array — single-thumb sliders use `[n]`, ranges `[a, b, …]`. */
export type SliderValue = number[]

export type SliderDirection = 'ltr' | 'rtl'

export interface SliderClasses {
  root?: string
  track?: string
  range?: string
  thumb?: string
  mark?: string
  label?: string
  value?: string
}

export interface SliderOwnProps {
  /** Controlled value. Pair with `onValueChange`. */
  value?: SliderValue
  /** Uncontrolled initial value. Ignored when `value` is provided. */
  defaultValue?: SliderValue
  /**
   * Fires on every value change (each drag tick, each key press).
   * High-frequency — for save / network side effects use `onValueCommit`.
   */
  onValueChange?: (value: SliderValue) => void
  /**
   * Fires once at the END of an interaction — pointerup, key release.
   * Use this to persist the value (form submit, API call, URL sync).
   */
  onValueCommit?: (value: SliderValue) => void

  min?: number
  max?: number
  step?: number

  orientation?: SliderOrientation

  disabled?: boolean
  /** Focusable but unchangeable. Inputs accept focus but reject value updates. */
  readOnly?: boolean
  /** Flips the value direction (max at start, min at end). */
  inverted?: boolean

  /**
   * For range sliders — the minimum number of `step`s between adjacent thumbs.
   * Prevents thumbs from colliding past each other.
   * @default 0
   */
  minStepsBetweenThumbs?: number

  /** Hidden input name for native form submission. */
  name?: string
  /** Form id (forwarded to the hidden inputs). */
  form?: string
  /** Required field marker (forwarded to the hidden inputs). */
  required?: boolean

  /**
   * Reading direction. Auto-detected from a closest `dir` attribute if
   * not provided. Horizontal RTL flips both pointer math and keyboard
   * left/right semantics.
   */
  dir?: SliderDirection

  /**
   * Custom value formatter — used by `<Slider.Value>` and for aria-valuetext
   * (so screen readers announce "65 dollars" instead of just "65").
   */
  format?: (value: number) => string

  classes?: SliderClasses
  children?: ReactNode
}

export type SliderProps = SliderOwnProps &
  Omit<
    HTMLAttributes<HTMLSpanElement>,
    keyof SliderOwnProps | 'defaultValue' | 'onChange'
  >

/* ── Compound parts ─────────────────────────────────────────────── */

export interface SliderTrackProps extends HTMLAttributes<HTMLSpanElement> {}

export interface SliderRangeProps extends HTMLAttributes<HTMLSpanElement> {}

export interface SliderThumbProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Position in the values array. Required when composing more than one
   * thumb inside a single `<Slider>` to keep the mapping unambiguous;
   * a single-thumb consumer can omit it (auto-resolves to 0).
   */
  index?: number
  /** Children can be a node (custom handle) or a render-prop receiving the value. */
  children?: ReactNode | ((value: number) => ReactNode)
}

export interface SliderMarkProps extends HTMLAttributes<HTMLSpanElement> {
  /** Value position along the track where the mark sits. */
  value: number
}

export interface SliderValueProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Which thumb's value to display. @default 0 */
  index?: number
  /** Override the root's `format` for this readout only. */
  format?: (value: number) => string
  /** Render-prop variant — receives the current value. */
  children?: ReactNode | ((value: number) => ReactNode)
}

export interface SliderLabelProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> {
  htmlFor?: string
}
