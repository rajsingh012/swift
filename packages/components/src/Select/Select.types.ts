import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  RefObject,
} from 'react'
import type { Placement } from '../internal/floating'

export type { Placement, Side, Align } from '../internal/floating'

export type SelectSize = 'sm' | 'md' | 'lg'
export type SelectVariant = 'outlined' | 'filled' | 'flushed'
export type SelectState = 'default' | 'success' | 'warning' | 'error'

export interface SelectClasses {
  trigger?: string
  content?: string
  item?: string
}

export interface SelectRootProps {
  /** Controlled value. Pair with `onValueChange`. */
  value?: string | null
  /** Uncontrolled initial value. */
  defaultValue?: string | null
  onValueChange?: (value: string) => void

  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void

  disabled?: boolean
  required?: boolean
  /** Hidden input name for native form submission. */
  name?: string

  /** Preferred placement before collision handling. @default 'bottom-start' */
  placement?: Placement
  /** Gap between trigger and listbox, in px. @default 6 */
  offset?: number
  dir?: 'ltr' | 'rtl'
  id?: string
  children?: ReactNode
}

export interface SelectTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  size?: SelectSize
  variant?: SelectVariant
  state?: SelectState
  invalid?: boolean
  fullWidth?: boolean
}

export interface SelectValueProps extends HTMLAttributes<HTMLSpanElement> {
  /** Text shown when nothing is selected. */
  placeholder?: ReactNode
}

export interface SelectPortalProps {
  container?: HTMLElement | null
  children?: ReactNode
}

export interface SelectContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  forceMount?: boolean
  closeOnEscape?: boolean
  closeOnInteractOutside?: boolean
  /** Match the listbox width to the trigger. @default true */
  matchTriggerWidth?: boolean
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onInteractOutside?: (event: PointerEvent) => void
  children?: ReactNode
}

export interface SelectItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** The value committed when this option is chosen. */
  value: string
  /** Display label override; defaults to the item's text content. */
  textValue?: string
  disabled?: boolean
  children?: ReactNode
}

export interface SelectGroupProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
}

export type SelectSeparatorProps = HTMLAttributes<HTMLDivElement>

/* ── Shared context shape exposed for typing item refs etc. ─────── */
export interface SelectItemData {
  value: string
  textValue: string
  disabled: boolean
  ref: RefObject<HTMLElement | null>
}
