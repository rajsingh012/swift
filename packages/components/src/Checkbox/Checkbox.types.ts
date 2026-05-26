import type {
  ChangeEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from 'react'

export type CheckboxSize = 'sm' | 'md' | 'lg'
export type CheckboxState = boolean | 'indeterminate'

export interface CheckboxClasses {
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

export interface CheckboxOwnProps {
  size?: CheckboxSize

  checked?: CheckboxState
  defaultChecked?: CheckboxState
  onCheckedChange?: (checked: CheckboxState) => void

  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean

  description?: ReactNode
  errorMessage?: ReactNode

  /** Custom glyph rendered inside the box when checked. Default is a tick. */
  indicator?: ReactNode

  /** Per-Checkbox value, only used inside a CheckboxGroup. */
  value?: string

  classes?: CheckboxClasses
}

export type CheckboxProps = CheckboxOwnProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    keyof CheckboxOwnProps | 'size' | 'type' | 'onChange'
  > & {
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  }

/* ── Compound parts ─────────────────────────────────────────────── */

export interface CheckboxRootProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'defaultChecked'> {
  size?: CheckboxSize
  checked?: CheckboxState
  defaultChecked?: CheckboxState
  onCheckedChange?: (checked: CheckboxState) => void
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  /** Override the generated input id (so Checkbox.Label htmlFor lines up). */
  id?: string
  /** Value used inside a CheckboxGroup. */
  value?: string
  name?: string
  classes?: CheckboxClasses
  children?: ReactNode
}

export interface CheckboxInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size' | 'checked' | 'defaultChecked'
  > {
  className?: string
  /** Children override the default indicator glyph. */
  children?: ReactNode
}

export interface CheckboxIndicatorProps
  extends HTMLAttributes<HTMLSpanElement> {
  /** Forces a particular state's glyph regardless of context. */
  forceState?: CheckboxState
}

export interface CheckboxLabelProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> {
  htmlFor?: string
}

export interface CheckboxDescriptionProps {
  id?: string
  className?: string
  children?: ReactNode
}

export interface CheckboxErrorMessageProps {
  id?: string
  className?: string
  children?: ReactNode
}

/* ── Group ──────────────────────────────────────────────────────── */

export interface CheckboxGroupOwnProps {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void

  size?: CheckboxSize
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean

  /** Shared name attribute applied to every nested checkbox input. */
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

export type CheckboxGroupProps = CheckboxGroupOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof CheckboxGroupOwnProps>
