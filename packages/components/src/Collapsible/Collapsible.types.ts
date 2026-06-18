import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

export type CollapsibleState = 'open' | 'closed'

export interface CollapsibleRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** Controlled open state. Pair with `onOpenChange`. */
  open?: boolean
  /** Uncontrolled initial open state. @default false */
  defaultOpen?: boolean
  /** Fires with the next open state on every toggle. */
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  children?: ReactNode
}

export interface CollapsibleTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Render the single child element as the trigger instead of a `<button>`. */
  asChild?: boolean
  /** Children may be a render-prop receiving the open state. */
  children?: ReactNode | ((state: { open: boolean }) => ReactNode)
}

export interface CollapsibleContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Keep the content mounted while closed (for external animation control). */
  forceMount?: boolean
  children?: ReactNode
}
