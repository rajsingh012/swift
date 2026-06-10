import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
} from 'react'
import type { Placement } from '../internal/floating'

export type { Placement, Side, Align } from '../internal/floating'

/** Colour scheme of the tooltip surface. */
export type TooltipVariant = 'default' | 'brand'

/**
 * How the tooltip is opened.
 *  - `'hover'`: pointer hover + keyboard focus + touch long-press (default).
 *  - `'click'`: click / Enter / Space toggles it; closes on outside click
 *    or Escape. Pass both (`['hover', 'click']`) to let hover open it and a
 *    click "pin" it open until dismissed.
 */
export type TooltipTriggerEvent = 'hover' | 'click'

/** Per-slot className overrides for the tooltip surface. */
export interface TooltipClasses {
  content?: string
  arrow?: string
}

export interface TooltipRootOwnProps {
  /** Controlled open state. */
  open?: boolean
  /** Uncontrolled initial open state. Default `false`. */
  defaultOpen?: boolean
  /** Fires on every open/close request. */
  onOpenChange?: (open: boolean) => void

  /**
   * What opens the tooltip — `'hover'` (default), `'click'`, or both as an
   * array. See {@link TooltipTriggerEvent}.
   */
  trigger?: TooltipTriggerEvent | TooltipTriggerEvent[]

  /** Preferred placement before collision handling. Default `'top'`. */
  placement?: Placement
  /** Gap between trigger and tooltip, in px. Default `8`. */
  offset?: number

  /** Hover/focus dwell before opening, in ms. Inherits from `TooltipProvider`. */
  openDelay?: number
  /** Grace period before closing, in ms. Inherits from `TooltipProvider`. */
  closeDelay?: number

  /**
   * Allow the pointer to move into the tooltip without closing it (rich
   * content with links/buttons). Interactive tooltips also dismiss on
   * Escape. Default `false`.
   */
  interactive?: boolean

  /** Disable the touch long-press trigger. Default `false`. */
  disableTouch?: boolean

  /** Fully disable the tooltip — it never opens. Default `false`. */
  disabled?: boolean

  /** Writing direction for placement mirroring. Auto-detected when omitted. */
  dir?: 'ltr' | 'rtl'

  /** Override the generated tooltip id (wired into `aria-describedby`). */
  id?: string

  children?: ReactNode
}

export type TooltipRootProps = TooltipRootOwnProps

export interface TooltipTriggerOwnProps {
  /**
   * Render the single child element as the trigger instead of wrapping it
   * in a `<span>`. Default `true` — tooltips usually decorate an existing
   * element (a Button, an icon) and an extra wrapper would disrupt layout.
   */
  asChild?: boolean
  children?: ReactNode
}

export type TooltipTriggerProps = TooltipTriggerOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof TooltipTriggerOwnProps>

export interface TooltipContentOwnProps {
  /** Colour scheme — `'default'` (light surface) or `'brand'`. Default `'default'`. */
  variant?: TooltipVariant
  /** Keep the content mounted even while closed (for entrance/exit control). */
  forceMount?: boolean
  /** Close interactive tooltips on Escape. Default `true`. */
  closeOnEscape?: boolean
  /** Called on Escape; call `preventDefault()` to keep the tooltip open. */
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  /** Per-slot className overrides. */
  classes?: TooltipClasses
  children?: ReactNode
}

export type TooltipContentProps = TooltipContentOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof TooltipContentOwnProps>

export type TooltipArrowProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children'
>

export interface TooltipCloseProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Runs before the tooltip closes; call `preventDefault()` to keep it open. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  /** Accessible label for the close button. Default `'Close'`. */
  'aria-label'?: string
  children?: ReactNode
}

export interface TooltipPortalProps {
  /** Portal target. Defaults to `document.body`. */
  container?: HTMLElement | null
  children?: ReactNode
}

export interface TooltipProviderProps {
  /** Default open delay (ms) for descendant tooltips. Default `700`. */
  openDelay?: number
  /** Default close delay (ms) for descendant tooltips. Default `300`. */
  closeDelay?: number
  /**
   * Window (ms) after one tooltip closes during which the next opens
   * instantly. Default `300`.
   */
  skipDelayDuration?: number
  children?: ReactNode
}
