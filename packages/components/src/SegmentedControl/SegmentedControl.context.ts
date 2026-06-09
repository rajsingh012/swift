import {
  createContext,
  useContext,
  type MutableRefObject,
  type RefObject,
} from 'react'
import type {
  SegmentedControlDirection,
  SegmentedControlOrientation,
  SegmentedControlSize,
} from './SegmentedControl.types'

export type SegmentedFocusDirection = 'next' | 'prev' | 'first' | 'last'

export interface SegmentedControlContextValue {
  /** Generated once via useId() in the root; combined with each value to
   *  produce stable item ARIA ids. */
  baseId: string
  value: string | null

  orientation: SegmentedControlOrientation
  size: SegmentedControlSize
  dir: SegmentedControlDirection

  disabled: boolean
  readOnly: boolean

  /** Map of value → item DOM node. Populated by SegmentedControl.Item via
   *  registerItem; consumed by focusItem for keyboard nav and by the
   *  Indicator for measurement. Kept in a ref to avoid re-rendering the tree
   *  on every item mount. */
  itemsRef: MutableRefObject<Map<string, HTMLElement>>
  /** Insertion-order list of registered values, so keyboard nav walks the
   *  user's DOM order (the map's iteration order is unspecified). */
  orderRef: MutableRefObject<string[]>

  /** Backref to the root element. The Indicator measures item offsets against
   *  it (items and indicator share the root as offset parent). */
  rootRef: RefObject<HTMLDivElement | null>

  /** Bumped each time the active value changes or an item remounts. The
   *  Indicator's effect depends on this so it re-measures. */
  measureToken: number

  setValue: (next: string) => void
  registerItem: (value: string, node: HTMLElement | null) => void
  focusItem: (from: string, direction: SegmentedFocusDirection) => void

  itemId: (value: string) => string

  /** Slot-level className overrides forwarded from the root's `classes` prop. */
  itemClass?: string
  indicatorClass?: string
}

export const SegmentedControlContext =
  createContext<SegmentedControlContextValue | null>(null)

export function useSegmentedControlRoot(
  componentName: string,
): SegmentedControlContextValue {
  const ctx = useContext(SegmentedControlContext)
  if (!ctx) {
    throw new Error(`<${componentName}> must be used inside <SegmentedControl>.`)
  }
  return ctx
}
