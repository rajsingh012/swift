import { createContext, useContext, type RefObject } from 'react'
import type { Placement } from '../internal/floating'

export interface PopoverContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  modal: boolean
  contentId: string
  triggerId: string
  /** Trigger node — any element via asChild, so HTMLElement. */
  triggerRef: RefObject<HTMLElement | null>
  /** Optional separate anchor; falls back to the trigger for positioning. */
  anchorRef: RefObject<HTMLElement | null>
  arrowRef: RefObject<HTMLSpanElement | null>
  placement: Placement
  offset: number
  dir: 'ltr' | 'rtl'
}

export const PopoverContext = createContext<PopoverContextValue | null>(null)

export function usePopover(componentName: string): PopoverContextValue {
  const ctx = useContext(PopoverContext)
  if (!ctx) {
    throw new Error(`<${componentName}> must be used inside <Popover>.`)
  }
  return ctx
}
