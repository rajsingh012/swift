import { createContext, useContext } from 'react'
import {
  DEFAULT_LABEL_PLACEMENT,
  DEFAULT_SIZE,
  DEFAULT_STATE,
  DEFAULT_VARIANT,
} from './Input.constants'
import type {
  InputLabelPlacement,
  InputSize,
  InputState,
  InputVariant,
} from './Input.types'

export interface InputContextValue {
  /** Stable id for the underlying <input> — `<label htmlFor>` reads this. */
  id: string
  helperTextId: string
  errorMessageId: string

  size: InputSize
  variant: InputVariant
  state: InputState
  labelPlacement: InputLabelPlacement

  invalid: boolean
  disabled: boolean
  readOnly: boolean
  required: boolean

  /** True when there is helper text rendered — drives aria-describedby. */
  hasHelperText: boolean
  hasErrorMessage: boolean
  /** True when a startAdornment is rendered — shifts the floating label
   *  right in its in-field state so it doesn't collide with the icon. */
  hasStartAdornment: boolean
}

export const InputContext = createContext<InputContextValue | null>(null)

/**
 * Compound parts read the input id and state from context so they can wire
 * up aria-* relationships without prop drilling. Outside of a Root, they
 * still render with safe fallback values.
 */
export function useInputContext(): InputContextValue {
  const ctx = useContext(InputContext)
  if (ctx) return ctx
  return {
    id: '',
    helperTextId: '',
    errorMessageId: '',
    size: DEFAULT_SIZE,
    variant: DEFAULT_VARIANT,
    state: DEFAULT_STATE,
    labelPlacement: DEFAULT_LABEL_PLACEMENT,
    invalid: false,
    disabled: false,
    readOnly: false,
    required: false,
    hasHelperText: false,
    hasErrorMessage: false,
    hasStartAdornment: false,
  }
}
