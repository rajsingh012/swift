import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  RefObject,
} from 'react'
import type { Placement } from '../internal/floating'

export type { Placement, Side, Align } from '../internal/floating'

export type DropdownMenuState = 'open' | 'closed'

export interface DropdownMenuRootProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Preferred placement before collision handling. @default 'bottom-start' */
  placement?: Placement
  /** Gap between trigger and menu, in px. @default 6 */
  offset?: number
  dir?: 'ltr' | 'rtl'
  id?: string
  children?: ReactNode
}

export interface DropdownMenuTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export interface DropdownMenuPortalProps {
  container?: HTMLElement | null
  children?: ReactNode
}

export interface DropdownMenuContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  forceMount?: boolean
  /** @default true */
  closeOnEscape?: boolean
  /** @default true */
  closeOnInteractOutside?: boolean
  /** Element to focus when the menu opens. Defaults to the first item. */
  initialFocusRef?: RefObject<HTMLElement | null>
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onInteractOutside?: (event: PointerEvent) => void
  children?: ReactNode
}

export interface DropdownMenuItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  disabled?: boolean
  /** Fired on click / Enter / Space. Call `preventDefault()` to keep the menu open. */
  onSelect?: (event: { preventDefault: () => void; defaultPrevented: boolean }) => void
  /** Keep the menu open after selecting. @default false */
  closeOnSelect?: boolean
  /** Leading icon / visual. */
  icon?: ReactNode
  /** Trailing content (shortcut hint, chevron…). */
  shortcut?: ReactNode
  children?: ReactNode
}

export interface DropdownMenuCheckboxItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'onChange'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  /** Keep the menu open after toggling. @default true */
  closeOnSelect?: boolean
  shortcut?: ReactNode
  children?: ReactNode
}

export type DropdownMenuLabelProps = HTMLAttributes<HTMLDivElement>

export type DropdownMenuSeparatorProps = HTMLAttributes<HTMLDivElement>

export interface DropdownMenuGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional group label, wired via aria-labelledby. */
  label?: ReactNode
}
