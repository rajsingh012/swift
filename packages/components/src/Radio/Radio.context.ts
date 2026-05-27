import { createContext, useContext, type ReactNode } from 'react'
import { DEFAULT_SIZE } from './Radio.constants'
import type { RadioSize } from './Radio.types'

export interface RadioContextValue {
  id: string
  descriptionId: string
  errorMessageId: string

  size: RadioSize
  checked: boolean
  disabled: boolean
  readOnly: boolean
  required: boolean
  invalid: boolean

  hasDescription: boolean
  hasErrorMessage: boolean

  /** Indicator glyph supplied by the consumer (overrides the default dot). */
  indicator?: ReactNode

  onChange?: (next: boolean) => void
  name?: string
  value: string
}

export const RadioContext = createContext<RadioContextValue | null>(null)

export function useRadioContext(): RadioContextValue {
  const ctx = useContext(RadioContext)
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
    value: '',
  }
}

/* ── Group ──────────────────────────────────────────────────────── */

export interface RadioGroupContextValue {
  value: string | null
  size: RadioSize
  disabled: boolean
  readOnly: boolean
  required: boolean
  invalid: boolean
  name: string
  onItemChange: (itemValue: string) => void
}

export const RadioGroupContext =
  createContext<RadioGroupContextValue | null>(null)

export function useRadioGroupContext(): RadioGroupContextValue | null {
  return useContext(RadioGroupContext)
}
