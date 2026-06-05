import {
  createContext,
  useContext,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import { DEFAULT_SIZE, DEFAULT_VARIANT } from './Switch.constants'
import type { SwitchSize, SwitchVariant } from './Switch.types'

/* ── Group ──────────────────────────────────────────────────────── */

export interface SwitchGroupContextValue {
  value: string[]
  size: SwitchSize
  variant: SwitchVariant
  disabled: boolean
  readOnly: boolean
  required: boolean
  invalid: boolean
  name?: string
  onItemChange: (itemValue: string, next: boolean) => void
}

export const SwitchGroupContext =
  createContext<SwitchGroupContextValue | null>(null)

export function useSwitchGroupContext(): SwitchGroupContextValue | null {
  return useContext(SwitchGroupContext)
}

/* ── Per-switch context ─────────────────────────────────────────── */

export interface SwitchContextValue {
  id: string
  descriptionId: string
  errorMessageId: string

  size: SwitchSize
  variant: SwitchVariant
  checked: boolean
  disabled: boolean
  readOnly: boolean
  required: boolean
  invalid: boolean
  loading: boolean

  hasDescription: boolean
  hasErrorMessage: boolean

  /** Default glyphs rendered inside the thumb. Per-Thumb props override. */
  checkedIcon?: ReactNode
  uncheckedIcon?: ReactNode

  onCheckedChange?: (next: boolean) => void
  name?: string
  value?: string

  /** Populated by Switch.Input so SwitchRoot can expose focus/blur via
   *  its `apiRef`. Optional because the bare context fallback used by
   *  orphan parts doesn't own one. */
  inputRef?: MutableRefObject<HTMLInputElement | null>

  /** Enables the drag-to-toggle gesture inside Switch.Input. */
  dragToToggle: boolean
}

export const SwitchContext = createContext<SwitchContextValue | null>(null)

export function useSwitchContext(): SwitchContextValue {
  const ctx = useContext(SwitchContext)
  if (ctx) return ctx
  return {
    id: '',
    descriptionId: '',
    errorMessageId: '',
    size: DEFAULT_SIZE,
    variant: DEFAULT_VARIANT,
    checked: false,
    disabled: false,
    readOnly: false,
    required: false,
    invalid: false,
    loading: false,
    hasDescription: false,
    hasErrorMessage: false,
    dragToToggle: true,
  }
}
