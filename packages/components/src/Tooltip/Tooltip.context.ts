import { createContext, useContext, type RefObject } from 'react'
import type { Placement } from '../internal/floating'

/* ------------------------------------------------------------------ *
 * Two contexts:
 *  - TooltipContext: per-tooltip state shared by Trigger / Content /
 *    Arrow. Throws if a part is used outside a <Tooltip> root.
 *  - TooltipProviderContext: optional ancestor supplying default delays
 *    and the shared "skip delay" window. Read null-safely so a Tooltip
 *    works with or without a Provider.
 * ------------------------------------------------------------------ */

export interface TooltipContextValue {
  open: boolean
  contentId: string

  /** Trigger node — any element (asChild), so typed as HTMLElement. */
  triggerRef: RefObject<HTMLElement | null>
  /** Arrow node, registered for live size measurement by the engine. */
  arrowRef: RefObject<HTMLSpanElement | null>
  /** True while the pointer is over the trigger OR (interactive) content. */
  isPointerInside: RefObject<boolean>

  // ── Intent API — timers live in the root. ──
  /** Open after `openDelay` (or immediately within the skip window). */
  scheduleOpen: () => void
  /** Close after `closeDelay`. */
  scheduleClose: () => void
  /** Open now, cancelling any pending timer (focus / long-press). */
  openImmediate: () => void
  /** Close now, cancelling any pending timer (Escape / blur). */
  closeImmediate: () => void
  /** Cancel any pending open/close timer (pointer re-entered). */
  cancelScheduled: () => void
  /** Click toggle: pins open if closed/hover-open, dismisses if already pinned. */
  toggle: () => void

  // ── Config consumed by the parts. ──
  placement: Placement
  offset: number
  dir: 'ltr' | 'rtl'
  interactive: boolean
  disableTouch: boolean
  disabled: boolean
  /** Open on hover / focus / touch long-press. */
  hoverEnabled: boolean
  /** Open on click; dismiss on outside-click / Escape. */
  clickEnabled: boolean
}

export const TooltipContext = createContext<TooltipContextValue | null>(null)

export function useTooltipContext(consumer: string): TooltipContextValue {
  const ctx = useContext(TooltipContext)
  if (!ctx) {
    throw new Error(`${consumer} must be rendered inside a <Tooltip> root.`)
  }
  return ctx
}

export interface TooltipProviderContextValue {
  openDelay: number
  closeDelay: number
  /** Start the skip-delay window — called when a tooltip closes. */
  registerClose: () => void
  /** True while inside the skip-delay window (next tooltip opens instantly). */
  shouldSkipDelay: () => boolean
}

export const TooltipProviderContext =
  createContext<TooltipProviderContextValue | null>(null)

export function useTooltipProvider(): TooltipProviderContextValue | null {
  return useContext(TooltipProviderContext)
}
