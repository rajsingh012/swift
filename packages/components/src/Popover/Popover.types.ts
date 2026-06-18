import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  RefObject,
} from 'react'
import type { Placement } from '../internal/floating'

export type { Placement, Side, Align } from '../internal/floating'

export type PopoverState = 'open' | 'closed'

export interface PopoverRootProps {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean
  /** Fires with the next open state on every open/close request. */
  onOpenChange?: (open: boolean) => void
  /**
   * Modal popover traps focus and blocks the background like a dialog.
   * Non-modal (default) leaves the page interactive and only manages the
   * roving focus into the panel. @default false
   */
  modal?: boolean
  /** Preferred placement before collision handling. @default 'bottom' */
  placement?: Placement
  /** Gap between trigger and panel, in px. @default 8 */
  offset?: number
  /** Writing direction for placement mirroring. Auto-detected when omitted. */
  dir?: 'ltr' | 'rtl'
  /** Override the generated content id. */
  id?: string
  children?: ReactNode
}

export interface PopoverTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Merge props onto the single child element instead of rendering a button. */
  asChild?: boolean
}

export interface PopoverAnchorProps extends HTMLAttributes<HTMLDivElement> {
  /** Render the single child as the positioning anchor instead of a wrapper. */
  asChild?: boolean
}

export interface PopoverPortalProps {
  /** Portal target. Defaults to `document.body`. */
  container?: HTMLElement | null
  children?: ReactNode
}

export interface PopoverContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Keep mounted while closed (for external animation control). */
  forceMount?: boolean
  /** @default true */
  closeOnEscape?: boolean
  /** @default true */
  closeOnInteractOutside?: boolean
  /** Element to focus when the popover opens. Falls back to first focusable. */
  initialFocusRef?: RefObject<HTMLElement | null>
  /** Escape keydown — `preventDefault()` to keep it open. */
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  /** Pointer down outside — `preventDefault()` to keep it open. */
  onInteractOutside?: (event: PointerEvent) => void
  /** Auto-focus on open — `preventDefault()` to manage focus yourself. */
  onOpenAutoFocus?: (event: Event) => void
  /** Focus restore on close — `preventDefault()` to manage focus yourself. */
  onCloseAutoFocus?: (event: Event) => void
  children?: ReactNode
}

export type PopoverArrowProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'>

export interface PopoverCloseProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}
