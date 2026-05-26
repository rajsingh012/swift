import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  Ref,
} from 'react'

export type InputSize = 'sm' | 'md' | 'lg'
export type InputVariant = 'outlined' | 'filled' | 'flushed'
export type InputState = 'default' | 'success' | 'warning' | 'error'
export type InputLabelPlacement = 'top' | 'floating'

export interface InputClasses {
  root?: string
  wrapper?: string
  label?: string
  field?: string
  helperText?: string
  errorMessage?: string
  startAdornment?: string
  endAdornment?: string
  count?: string
}

export interface InputOwnProps {
  size?: InputSize
  variant?: InputVariant
  /** Non-error semantic state. `invalid` overrides this with the error chrome. */
  state?: InputState
  labelPlacement?: InputLabelPlacement

  label?: ReactNode
  helperText?: ReactNode
  errorMessage?: ReactNode

  invalid?: boolean
  required?: boolean
  /** Visual full-width. Defaults to `false` (inline). */
  fullWidth?: boolean

  startAdornment?: ReactNode
  endAdornment?: ReactNode

  /** Show a clear (✕) button while the field has a value. */
  clearable?: boolean
  /** Eye toggle for type="password". Ignored for other types. */
  showPasswordToggle?: boolean
  /** Spinner in the end slot. Sets `aria-busy`. Does not block input. */
  loading?: boolean
  /** Show `value.length / maxLength` under the field. Requires `maxLength`. */
  showCount?: boolean

  classes?: InputClasses

  /** Called when the clear button is pressed. If omitted, clears via DOM. */
  onClear?: () => void
}

export type InputProps = InputOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, keyof InputOwnProps | 'size'>

/* ── Compound part prop shapes ──────────────────────────────────── */

export interface InputLabelProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> {
  /** Optional override; otherwise reads from InputContext. */
  htmlFor?: string
}

export interface InputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  ref?: Ref<HTMLInputElement>
}

export interface InputHelperTextProps {
  id?: string
  className?: string
  children?: ReactNode
}

export interface InputErrorMessageProps {
  id?: string
  className?: string
  children?: ReactNode
}

/* ── Input.Group (OTP) ──────────────────────────────────────────── */

export type InputGroupType = 'numeric' | 'alphanumeric' | 'all'

export interface InputGroupOwnProps {
  /** Number of cells. */
  length: number
  /** Controlled value. Length always equals `length`; missing chars are ''. */
  value?: string
  defaultValue?: string
  onChange?: (next: string) => void
  /** Fired when every cell is filled. */
  onComplete?: (next: string) => void

  /** Restricts allowed characters. `numeric` keeps digits only. */
  type?: InputGroupType
  /** Render cells as type="password" (dots), but still emit raw chars. */
  mask?: boolean

  size?: InputSize
  variant?: InputVariant
  state?: InputState

  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
  required?: boolean
  autoFocus?: boolean

  /** Per-cell label for screen readers. Receives the 1-indexed cell number. */
  ariaLabel?: (cellNumber: number) => string

  className?: string
  classes?: {
    root?: string
    cell?: string
  }
}

export type InputGroupProps = InputGroupOwnProps &
  Omit<
    React.HTMLAttributes<HTMLDivElement>,
    keyof InputGroupOwnProps | 'onChange' | 'defaultValue'
  >
