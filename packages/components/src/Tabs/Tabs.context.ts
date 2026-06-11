import {
  createContext,
  useContext,
  type MutableRefObject,
  type RefObject,
} from 'react'
import type {
  TabsActivationMode,
  TabsDirection,
  TabsOrientation,
} from './Tabs.types'

export type TabsFocusDirection = 'next' | 'prev' | 'first' | 'last'

export interface TabsRootContextValue {
  /** Generated once via useId() in the root; combined with each value to
   *  produce stable trigger/content ARIA ids. */
  baseId: string
  value: string | null

  orientation: TabsOrientation
  activationMode: TabsActivationMode
  dir: TabsDirection

  lazyMount: boolean
  /** Horizontal pointer swipe on the active content flips tabs. */
  swipeable: boolean
  /** Arrow-key (and swipe) navigation wraps past the ends. */
  loop: boolean

  /** Map of value → trigger DOM node. Populated by TabsTrigger via
   *  registerTrigger; consumed by focusTrigger for keyboard nav and by
   *  TabsIndicator for measurement. Kept in a ref to avoid re-rendering
   *  the tree every time a trigger mounts. */
  triggersRef: MutableRefObject<Map<string, HTMLElement>>
  /** Insertion-order list of registered values. Maintained alongside the
   *  map so keyboard nav can walk in the user's DOM order, not in the
   *  map iteration order (which the spec leaves unspecified). */
  orderRef: MutableRefObject<string[]>

  /** Backref to the active <TabsList>. TabsIndicator measures against it
   *  so the indicator coordinates are relative to the list, not the
   *  document. */
  listRef: RefObject<HTMLDivElement | null>

  /** Bumped each time the active trigger changes or a trigger remounts.
   *  TabsIndicator's effect depends on this so it re-measures. */
  measureToken: number

  setValue: (next: string) => void
  registerTrigger: (value: string, node: HTMLElement | null) => void
  focusTrigger: (from: string, direction: TabsFocusDirection) => void

  triggerId: (value: string) => string
  contentId: (value: string) => string
}

export const TabsRootContext = createContext<TabsRootContextValue | null>(null)

export function useTabsRoot(componentName: string): TabsRootContextValue {
  const ctx = useContext(TabsRootContext)
  if (!ctx) {
    throw new Error(`<${componentName}> must be used inside <Tabs>.`)
  }
  return ctx
}
