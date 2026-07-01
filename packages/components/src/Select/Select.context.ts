import {
  createContext,
  useContext,
  type MutableRefObject,
  type RefObject,
} from 'react'
import type { Placement } from '../internal/floating'
import type { SelectItemData } from './Select.types'

export type SelectFocusDirection = 'next' | 'prev' | 'first' | 'last'

export interface SelectContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  value: string | null
  setValue: (value: string) => void

  disabled: boolean
  required: boolean

  contentId: string
  triggerId: string
  labelId: string

  triggerRef: RefObject<HTMLElement | null>
  placement: Placement
  offset: number
  dir: 'ltr' | 'rtl'

  /** value → display text, so Select.Value can render the chosen label. */
  labelsRef: MutableRefObject<Map<string, string>>
  registerLabel: (value: string, text: string) => void

  /** Item registry for keyboard nav + typeahead. */
  itemsRef: MutableRefObject<SelectItemData[]>
  registerItem: (item: SelectItemData) => void
  unregisterItem: (value: string) => void

  /** The value currently visually highlighted in the open listbox. */
  highlighted: string | null
  setHighlighted: (value: string | null) => void
  moveHighlight: (direction: SelectFocusDirection) => void
  onTypeahead: (char: string) => void
}

export const SelectContext = createContext<SelectContextValue | null>(null)

export function useSelect(componentName: string): SelectContextValue {
  const ctx = useContext(SelectContext)
  if (!ctx) {
    throw new Error(`<${componentName}> must be used inside <Select>.`)
  }
  return ctx
}
