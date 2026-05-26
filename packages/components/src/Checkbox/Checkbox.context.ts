import { createContext, useContext } from 'react'
import { DEFAULT_SIZE } from './Checkbox.constants'
import type { CheckboxSize, CheckboxState } from './Checkbox.types'

export interface CheckboxContextValue {
  id: string
  descriptionId: string
  errorMessageId: string

  size: CheckboxSize
  checked: CheckboxState
  disabled: boolean
  readOnly: boolean
  required: boolean
  invalid: boolean

  hasDescription: boolean
  hasErrorMessage: boolean

  /** Indicator glyph supplied by the consumer (overrides default tick). */
  indicator?: React.ReactNode

  onCheckedChange?: (next: CheckboxState) => void
  name?: string
  value?: string
}

export const CheckboxContext = createContext<CheckboxContextValue | null>(null)

export function useCheckboxContext(): CheckboxContextValue {
  const ctx = useContext(CheckboxContext)
  if (ctx) return ctx
  return {
    id: '',
    descriptionId: '',
    errorMessageId: '',
    size: DEFAULT_SIZE,
    checked: false,
    disabled: false,
    readOnly: false,
    required: false,
    invalid: false,
    hasDescription: false,
    hasErrorMessage: false,
  }
}

/* ── Group ──────────────────────────────────────────────────────── */

export interface CheckboxGroupContextValue {
  value: string[]
  size: CheckboxSize
  disabled: boolean
  readOnly: boolean
  required: boolean
  invalid: boolean
  name?: string
  onItemChange: (itemValue: string, next: boolean) => void
}

export const CheckboxGroupContext =
  createContext<CheckboxGroupContextValue | null>(null)

export function useCheckboxGroupContext(): CheckboxGroupContextValue | null {
  return useContext(CheckboxGroupContext)
}
