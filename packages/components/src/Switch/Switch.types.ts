import type {
  ChangeEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  Ref,
} from 'react'

export type SwitchSize = 'sm' | 'md' | 'lg'
export type SwitchVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'info'
  | 'neutral'

/**
 * Imperative handle exposed via `apiRef`. Useful when the consumer needs
 * to drive the switch from outside React's render tree — programmatic
 * toggles from a parent button, focus from a form library, or reading
 * the current value without subscribing.
 *
 * The native input ref is exposed separately through the regular `ref`
 * prop, so this handle is purely about high-level intent.
 */
export interface SwitchApi {
  /** Flip checked. Respects disabled / readOnly / loading just like a click. */
  toggle: () => void
  /** Set checked to a specific value. Same gates as `toggle`. */
  setChecked: (next: boolean) => void
  /** Focus the underlying native input. */
  focus: (options?: FocusOptions) => void
  /** Blur the underlying native input. */
  blur: () => void
  /** Read the current checked value without re-rendering. */
  getChecked: () => boolean
}

export interface SwitchClasses {
  root?: string
  control?: string
  track?: string
  thumb?: string
  input?: string
  label?: string
  description?: string
  errorMessage?: string
  text?: string
}

export interface SwitchOwnProps {
  size?: SwitchSize
  variant?: SwitchVariant

  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void

  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  /** While true, interaction is suppressed and the thumb shows a spinner. */
  loading?: boolean

  description?: ReactNode
  errorMessage?: ReactNode

  /** Optional glyph rendered inside the thumb when checked. */
  checkedIcon?: ReactNode
  /** Optional glyph rendered inside the thumb when unchecked. */
  uncheckedIcon?: ReactNode

  value?: string

  classes?: SwitchClasses

  /** Imperative handle. See {@link SwitchApi}. */
  apiRef?: Ref<SwitchApi>

  /** Enable drag-to-toggle: the thumb tracks the pointer, and a release
   *  past the midpoint flips state. Click + Space still work unchanged.
   *  Default true; set false for click-only environments. */
  dragToToggle?: boolean
}

export type SwitchProps = SwitchOwnProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    keyof SwitchOwnProps | 'size' | 'type' | 'onChange'
  > & {
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  }

/* ── Compound parts ─────────────────────────────────────────────── */

export interface SwitchRootProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'defaultChecked'> {
  size?: SwitchSize
  variant?: SwitchVariant
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  loading?: boolean
  /** Override the generated input id (so Switch.Label htmlFor lines up). */
  id?: string
  value?: string
  name?: string
  classes?: SwitchClasses
  children?: ReactNode

  /** Imperative handle. See {@link SwitchApi}. */
  apiRef?: Ref<SwitchApi>

  /** Enable drag-to-toggle on the thumb. Default true. */
  dragToToggle?: boolean
}

export interface SwitchInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'size' | 'checked' | 'defaultChecked'
  > {
  className?: string
  /** Override children rendered inside the control wrapper (Track + Thumb). */
  children?: ReactNode
}

export interface SwitchTrackProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string
  children?: ReactNode
  /** Render as the single child element instead of a <span>. */
  asChild?: boolean
}

export interface SwitchThumbProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string
  /** Glyph rendered inside the thumb when checked. Overrides context. */
  checkedIcon?: ReactNode
  /** Glyph rendered inside the thumb when unchecked. Overrides context. */
  uncheckedIcon?: ReactNode
  /** Render as the single child element instead of a <span>. When true,
   *  the default icon resolution is skipped — the consumer's element
   *  owns its own glyph (the spinner during loading is still rendered
   *  inside the consumer's element via the cloned children prop). */
  asChild?: boolean
}

export interface SwitchLabelProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, 'htmlFor'> {
  htmlFor?: string
  /** Render as the single child element instead of a <label>. When true,
   *  the auto-appended required asterisk is suppressed — the consumer's
   *  element is responsible for any additional chrome. */
  asChild?: boolean
}

export interface SwitchDescriptionProps {
  id?: string
  className?: string
  children?: ReactNode
}

export interface SwitchErrorMessageProps {
  id?: string
  className?: string
  children?: ReactNode
}

/* ── Group ──────────────────────────────────────────────────────── */

export interface SwitchGroupOwnProps {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void

  size?: SwitchSize
  variant?: SwitchVariant
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean

  /** Shared name attribute applied to every nested switch input. */
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

export type SwitchGroupProps = SwitchGroupOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof SwitchGroupOwnProps>
