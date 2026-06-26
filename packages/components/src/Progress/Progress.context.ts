import { createContext, useContext } from 'react'
import { DEFAULT_MAX, DEFAULT_MIN, DEFAULT_SIZE, DEFAULT_VARIANT } from './Progress.constants'
import type { ProgressSize, ProgressVariant } from './Progress.types'

/**
 * Value cascaded from `<Progress>` (or `<Progress.Root>`) to its compound
 * parts (`Progress.Track`, `Progress.Indicator`, `Progress.Label`,
 * `Progress.Value`) so they can size and fill themselves without prop
 * drilling. Parts remain usable standalone via the fallback below.
 */
export interface ProgressContextValue {
  /** Clamped current value; 0 while indeterminate. */
  value: number
  min: number
  max: number
  /** Resolved fill percentage in [0, 100]. */
  percent: number
  /** Rounded percentage for readouts. */
  roundedPercent: number
  indeterminate: boolean
  size: ProgressSize
  variant: ProgressVariant
  /** Formatted readout string, or null while indeterminate. */
  readout: string | null
  /** True when provided by a `<Progress>` root (vs. the standalone fallback). */
  inRoot: boolean
}

const FALLBACK_CONTEXT: ProgressContextValue = {
  value: 0,
  min: DEFAULT_MIN,
  max: DEFAULT_MAX,
  percent: 0,
  roundedPercent: 0,
  indeterminate: false,
  size: DEFAULT_SIZE,
  variant: DEFAULT_VARIANT,
  readout: '0%',
  inRoot: false,
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)

/**
 * Reads the nearest Progress context. Parts are usable standalone, so this
 * never throws — it falls back to sensible defaults outside a `<Progress>`.
 */
export function useProgressContext(componentName: string): ProgressContextValue {
  void componentName
  return useContext(ProgressContext) ?? FALLBACK_CONTEXT
}
