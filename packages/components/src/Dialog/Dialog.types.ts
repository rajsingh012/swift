import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  JSX,
  ReactNode,
  RefObject,
} from 'react'

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export type DialogState = 'open' | 'closed'

export interface DialogRootProps {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean
  /** Fires with the next open state on every open/close request. */
  onOpenChange?: (open: boolean) => void
  /**
   * Modal blocks the background (scroll lock, inert siblings, scrim, focus
   * trap). Non-modal leaves the page interactive. @default true
   */
  modal?: boolean
  children?: ReactNode
}

export interface DialogTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export interface DialogPortalProps {
  container?: HTMLElement | null
  children?: ReactNode
}

export interface DialogOverlayProps extends HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean
}

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  size?: DialogSize
  forceMount?: boolean
  /** @default true */
  closeOnEscape?: boolean
  /** @default true */
  closeOnInteractOutside?: boolean
  initialFocusRef?: RefObject<HTMLElement | null>
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onInteractOutside?: (event: PointerEvent) => void
  onOpenAutoFocus?: (event: Event) => void
  onCloseAutoFocus?: (event: Event) => void
}

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>
export type DialogBodyProps = HTMLAttributes<HTMLDivElement>
export type DialogFooterProps = HTMLAttributes<HTMLDivElement>

export type DialogTitleTag = Extract<
  keyof JSX.IntrinsicElements,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
>

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: DialogTitleTag
}

export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>

export interface DialogCloseProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}
