import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  JSX,
  ReactNode,
  RefObject,
} from 'react'

export type SheetSide = 'left' | 'right' | 'top' | 'bottom'

export type SheetSize = 'sm' | 'md' | 'lg' | 'full'

export type SheetState = 'open' | 'closed'

export interface SheetRootProps {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean
  /** Uncontrolled initial open state. Ignored when `open` is provided. */
  defaultOpen?: boolean
  /** Fires with the next open state on every open/close request. */
  onOpenChange?: (open: boolean) => void
  /**
   * Modal blocks the background (scroll lock, inert siblings, overlay).
   * Non-modal leaves the page interactive — for inspector / side panels.
   * @default true
   */
  modal?: boolean
  children?: ReactNode
}

export interface SheetTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Merge props onto the single child element instead of rendering a button. */
  asChild?: boolean
}

export interface SheetPortalProps {
  /** Where to render. Defaults to `document.body`. */
  container?: HTMLElement | null
  children?: ReactNode
}

export interface SheetOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /** Keep mounted while closed so an external animation lib can own exit. */
  forceMount?: boolean
}

export interface SheetContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: SheetSide
  size?: SheetSize
  /** Keep mounted while closed (e.g. for Framer Motion). Skips exit handling. */
  forceMount?: boolean
  /** @default true */
  closeOnEscape?: boolean
  /** @default true */
  closeOnInteractOutside?: boolean
  /** Element to focus when the sheet opens. Falls back to first focusable. */
  initialFocusRef?: RefObject<HTMLElement | null>
  /** Escape keydown — call `preventDefault()` to keep the sheet open. */
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  /** Pointer down outside the content — `preventDefault()` to keep it open. */
  onInteractOutside?: (event: PointerEvent) => void
  /** Auto-focus on open — `preventDefault()` to manage focus yourself. */
  onOpenAutoFocus?: (event: Event) => void
  /** Focus restore on close — `preventDefault()` to manage focus yourself. */
  onCloseAutoFocus?: (event: Event) => void
}

export interface SheetHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export interface SheetBodyProps extends HTMLAttributes<HTMLDivElement> {}

export interface SheetFooterProps extends HTMLAttributes<HTMLDivElement> {}

export type SheetTitleTag = Extract<
  keyof JSX.IntrinsicElements,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
>

export interface SheetTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: SheetTitleTag
}

export interface SheetDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export interface SheetCloseProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Merge props onto the single child element instead of rendering a button. */
  asChild?: boolean
}
