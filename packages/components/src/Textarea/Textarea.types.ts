import type { ReactNode, TextareaHTMLAttributes } from 'react'

export type TextareaSize = 'sm' | 'md' | 'lg'
export type TextareaVariant = 'outlined' | 'filled' | 'flushed'
export type TextareaState = 'default' | 'success' | 'warning' | 'error'

/** Vertical resize behaviour of the underlying `<textarea>`. */
export type TextareaResize = 'none' | 'vertical' | 'auto'

export interface TextareaClasses {
  root?: string
  wrapper?: string
  label?: string
  field?: string
  helperText?: string
  errorMessage?: string
  count?: string
}

export interface TextareaOwnProps {
  size?: TextareaSize
  variant?: TextareaVariant
  /** Non-error semantic state. `invalid` overrides this with error chrome. */
  state?: TextareaState

  label?: ReactNode
  helperText?: ReactNode
  errorMessage?: ReactNode

  invalid?: boolean
  required?: boolean
  fullWidth?: boolean

  /**
   * `'vertical'` (default) — native vertical resize handle.
   * `'auto'` — grow with content, no handle (auto-resize).
   * `'none'` — fixed height.
   */
  resize?: TextareaResize
  /** Minimum rows of visible text. @default 3 */
  minRows?: number
  /** Maximum rows before the textarea scrolls (auto-resize only). */
  maxRows?: number

  /** Show `value.length / maxLength` under the field. Requires `maxLength`. */
  showCount?: boolean

  classes?: TextareaClasses
}

export type TextareaProps = TextareaOwnProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof TextareaOwnProps | 'rows'>
