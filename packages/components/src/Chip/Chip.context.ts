import { createContext, useContext } from 'react'
import { DEFAULT_SIZE, DEFAULT_VARIANT } from './Chip.constants'
import type { ChipSelectionMode, ChipSize, ChipVariant } from './Chip.types'

export interface ChipGroupContextValue {
  selectionMode: ChipSelectionMode
  selectedValues: ReadonlySet<string>
  toggle: (value: string) => void
  disabled?: boolean
  size?: ChipSize
}

export const ChipGroupContext = createContext<ChipGroupContextValue | null>(null)

export function useOptionalChipGroup(): ChipGroupContextValue | null {
  return useContext(ChipGroupContext)
}

/**
 * Value cascaded from a single `<Chip>` root to its compound parts
 * (`Chip.Label`, `Chip.LeftIcon`, `Chip.RightIcon`, `Chip.Remove`). Distinct
 * from `ChipGroupContext`, which cascades selection across a `<ChipGroup>`.
 */
export interface ChipContextValue {
  size: ChipSize
  variant: ChipVariant
  selected: boolean
  disabled: boolean
  /** True when provided by a `<Chip>` root (vs. the standalone fallback). */
  inRoot: boolean
}

const FALLBACK_CHIP_CONTEXT: ChipContextValue = {
  size: DEFAULT_SIZE,
  variant: DEFAULT_VARIANT,
  selected: false,
  disabled: false,
  inRoot: false,
}

export const ChipContext = createContext<ChipContextValue | null>(null)

/**
 * Reads the nearest single-chip context. Parts are usable standalone, so this
 * never throws — it falls back to sensible defaults outside a `<Chip>` root.
 */
export function useChipContext(componentName: string): ChipContextValue {
  void componentName
  return useContext(ChipContext) ?? FALLBACK_CHIP_CONTEXT
}
