import {
  createContext,
  useContext,
  type MutableRefObject,
} from 'react'
import type {
  ToggleGroupOrientation,
  ToggleSize,
  ToggleVariant,
} from './Toggle.types'

export type ToggleFocusDirection = 'next' | 'prev' | 'first' | 'last'

export interface ToggleGroupContextValue {
  /** Whether a given value is currently pressed. */
  isPressed: (value: string) => boolean
  /** Toggle a value's pressed state (handles single vs multiple). */
  toggle: (value: string) => void

  size: ToggleSize
  variant: ToggleVariant
  orientation: ToggleGroupOrientation
  dir: 'ltr' | 'rtl'
  disabled: boolean

  itemsRef: MutableRefObject<Map<string, HTMLElement>>
  orderRef: MutableRefObject<string[]>
  registerItem: (value: string, node: HTMLElement | null) => void
  focusItem: (from: string, direction: ToggleFocusDirection) => void

  itemClass?: string
}

export const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(
  null,
)

/** Null when a Toggle is used standalone (not inside a ToggleGroup). */
export function useToggleGroup(): ToggleGroupContextValue | null {
  return useContext(ToggleGroupContext)
}
