import {
  createContext,
  useContext,
  type MutableRefObject,
} from 'react'
import { DEFAULT_SIZE, DEFAULT_VARIANT } from './Toggle.constants'
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

/**
 * Value cascaded from a single `<Toggle>` root to its compound parts
 * (`Toggle.Label`, `Toggle.Icon`). Distinct from `ToggleGroupContext`, which
 * cascades pressed state across a `<ToggleGroup>`.
 */
export interface ToggleItemContextValue {
  size: ToggleSize
  variant: ToggleVariant
  pressed: boolean
  disabled: boolean
  /** True when provided by a `<Toggle>` root (vs. the standalone fallback). */
  inRoot: boolean
}

const FALLBACK_ITEM_CONTEXT: ToggleItemContextValue = {
  size: DEFAULT_SIZE,
  variant: DEFAULT_VARIANT,
  pressed: false,
  disabled: false,
  inRoot: false,
}

export const ToggleItemContext = createContext<ToggleItemContextValue | null>(
  null,
)

/**
 * Reads the nearest single-toggle context. Parts are usable standalone, so
 * this never throws — it falls back to sensible defaults outside a `<Toggle>`.
 */
export function useToggleItemContext(
  componentName: string,
): ToggleItemContextValue {
  void componentName
  return useContext(ToggleItemContext) ?? FALLBACK_ITEM_CONTEXT
}
