import { createContext, useContext } from 'react'
import type { ChipSelectionMode, ChipSize } from './Chip.types'

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
