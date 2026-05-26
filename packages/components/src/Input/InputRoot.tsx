import { forwardRef, useId, useMemo, type HTMLAttributes, type ReactNode } from 'react'
import {
  DEFAULT_LABEL_PLACEMENT,
  DEFAULT_SIZE,
  DEFAULT_STATE,
  DEFAULT_VARIANT,
} from './Input.constants'
import { InputContext, type InputContextValue } from './Input.context'
import { cx, rootClasses } from './Input.styles'
import type {
  InputLabelPlacement,
  InputSize,
  InputState,
  InputVariant,
} from './Input.types'

export interface InputRootProps extends HTMLAttributes<HTMLDivElement> {
  size?: InputSize
  variant?: InputVariant
  state?: InputState
  labelPlacement?: InputLabelPlacement
  invalid?: boolean
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  /** Manual override of the generated input id. */
  id?: string
  fullWidth?: boolean
  /** Set when composing a startAdornment alongside Input.Field — shifts the
   *  floating label past the icon in its in-field state. */
  hasStartAdornment?: boolean
  children?: ReactNode
}

/**
 * Compound-mode root. Provides the InputContext (id, ARIA ids, size, variant,
 * state) but renders no chrome — consumers compose Input.Label / Input.Field /
 * Input.HelperText / Input.ErrorMessage themselves.
 *
 * Use the convenience `<Input />` for the common path; reach for `<Input.Root>`
 * only when you need a non-standard layout (e.g. label on the right, action
 * row between input and helper text, etc.).
 */
export const InputRoot = forwardRef<HTMLDivElement, InputRootProps>(
  function InputRoot(props, ref) {
    const {
      size = DEFAULT_SIZE,
      variant = DEFAULT_VARIANT,
      state = DEFAULT_STATE,
      labelPlacement = DEFAULT_LABEL_PLACEMENT,
      invalid = false,
      disabled = false,
      readOnly = false,
      required = false,
      id: idProp,
      fullWidth = false,
      hasStartAdornment = false,
      className,
      children,
      ...rest
    } = props

    const reactId = useId()
    const id = idProp ?? `swift-input-${reactId}`
    const helperTextId = `${id}-helper`
    const errorMessageId = `${id}-error`

    // In compound mode we can't know if helper/error are rendered until the
    // user composes them, so we assume both could be present and let the
    // describedby string include both ids. Browsers tolerate refs to missing
    // ids — they're simply ignored.
    const ctx = useMemo<InputContextValue>(
      () => ({
        id,
        helperTextId,
        errorMessageId,
        size,
        variant,
        state,
        labelPlacement,
        invalid,
        disabled,
        readOnly,
        required,
        hasHelperText: true,
        hasErrorMessage: invalid,
        hasStartAdornment,
      }),
      [
        id,
        helperTextId,
        errorMessageId,
        size,
        variant,
        state,
        labelPlacement,
        invalid,
        disabled,
        readOnly,
        required,
        hasStartAdornment,
      ],
    )

    return (
      <InputContext.Provider value={ctx}>
        <div
          ref={ref}
          className={cx(rootClasses, fullWidth && 'flex w-full', className)}
          data-disabled={disabled || undefined}
          data-invalid={invalid || undefined}
          data-size={size}
          data-variant={variant}
          {...rest}
        >
          {children}
        </div>
      </InputContext.Provider>
    )
  },
)
