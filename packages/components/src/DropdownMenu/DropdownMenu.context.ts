import {
  createContext,
  useContext,
  type MutableRefObject,
  type RefObject,
} from 'react'
import type { Placement } from '../internal/floating'

export type MenuFocusDirection = 'next' | 'prev' | 'first' | 'last'

export interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  contentId: string
  triggerId: string
  triggerRef: RefObject<HTMLElement | null>
  placement: Placement
  offset: number
  dir: 'ltr' | 'rtl'

  /** Item registry for roving focus. Map value→node keeps DOM order via orderRef. */
  itemsRef: MutableRefObject<HTMLElement[]>
  registerItem: (node: HTMLElement | null) => void
  /** Move focus among enabled items. */
  focusItem: (from: HTMLElement | null, direction: MenuFocusDirection) => void
  /** Typeahead: focus the next item whose text starts with the typed string. */
  onTypeahead: (char: string) => void
}

export const DropdownMenuContext =
  createContext<DropdownMenuContextValue | null>(null)

export function useDropdownMenu(componentName: string): DropdownMenuContextValue {
  const ctx = useContext(DropdownMenuContext)
  if (!ctx) {
    throw new Error(`<${componentName}> must be used inside <DropdownMenu>.`)
  }
  return ctx
}
