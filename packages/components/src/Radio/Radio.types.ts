import type {
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from 'react'

export type RadioSize = 'sm' | 'md' | 'lg'

export interface RadioClasses {
  root?: string
  control?: string
  box?: string
  input?: string
  indicator?: string
  label?: string
  description?: string
  errorMessage?: string
  text?: string
}

export interface RadioOwnProps {
  size?: RadioSize

  /** Required. The string value that the surrounding RadioGroup tracks. */
  value: string

  checked?: boolean
  defaultChecked?: boolean
  /** Fires after each toggle with the next checked value. */
  onChange?: (checked: boolean) => void

  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean

  description?: ReactNode
  errorMessage?: ReactNode

  /** Custom indicator rendered when checked. Defaults to a filled dot. */
  indicator?: ReactNode

  classes?: RadioClasses
}

export type RadioProps = RadioOwnProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    keyof RadioOwnProps | 'size' | 'type' | 'onChange'
  >

/* ── Compound parts ─────────────────────────────────────────────── */

export interface RadioRootProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'defaultChecked' | 'onChange'> {
  size?: RadioSize
  value: string
  checked?: boolean
  defaultChecked?: boolean
  /** Fires after each toggle with the next checked value. */
  onChange?: (checked: boolean) => void
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  /** Override the generated input id (so Radio.Label htmlFor lines up). */
  id?: string
  name?: string
  classes?: RadioClasses
  children?: ReactNode
}

export interface RadioInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size' | 'checked' | 'defaultChecked'
  > {
  className?: string
  /** Children override the default dot indicator. */
  children?: ReactNode
}

export interface RadioIndicatorProps
  extends HTMLAttributes<HTMLSpanElement> {
  /** Force a particular state's glyph regardless of context. */
  forceChecked?: boolean
}

export interface RadioLabelProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> {
  htmlFor?: string
}

export interface RadioDescriptionProps {
  id?: string
  className?: string
  children?: ReactNode
}

export interface RadioErrorMessageProps {
  id?: string
  className?: string
  children?: ReactNode
}

/* ── Group ──────────────────────────────────────────────────────── */

export interface RadioGroupOwnProps {
  /** Controlled value. `null` means no selection. */
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string) => void

  size?: RadioSize
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean

  /** Shared name attribute applied to every nested radio input. Auto-generated if omitted. */
  name?: string

  label?: ReactNode
  description?: ReactNode
  errorMessage?: ReactNode

  orientation?: 'vertical' | 'horizontal'

  classes?: {
    root?: string
    label?: string
    description?: string
    errorMessage?: string
    items?: string
  }
}

export type RadioGroupProps = RadioGroupOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof RadioGroupOwnProps>
