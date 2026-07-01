import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ToggleSize = 'sm' | 'md' | 'lg'
export type ToggleVariant = 'default' | 'outline' | 'ghost'

export interface ToggleOwnProps {
  /** Controlled pressed state. Pair with `onPressedChange`. */
  pressed?: boolean
  /** Uncontrolled initial pressed state. @default false */
  defaultPressed?: boolean
  /** Fires with the next pressed state on toggle. */
  onPressedChange?: (pressed: boolean) => void

  size?: ToggleSize
  variant?: ToggleVariant
  disabled?: boolean

  /**
   * Identity inside a `ToggleGroup`. Required when used in a group; ignored
   * for a standalone toggle.
   */
  value?: string

  children?: ReactNode
}

export type ToggleProps = ToggleOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ToggleOwnProps | 'value'>

/* ── ToggleGroup ────────────────────────────────────────────────── */

export type ToggleGroupType = 'single' | 'multiple'
export type ToggleGroupOrientation = 'horizontal' | 'vertical'

export interface ToggleGroupClasses {
  root?: string
  item?: string
}

interface ToggleGroupBaseProps {
  size?: ToggleSize
  variant?: ToggleVariant
  orientation?: ToggleGroupOrientation
  disabled?: boolean
  /** Arrow-key navigation wraps at the ends. @default true */
  loop?: boolean
  /** Reading direction. Sniffed from a closest `[dir]` when omitted. */
  dir?: 'ltr' | 'rtl'
  classes?: ToggleGroupClasses
  children?: ReactNode
}

export interface ToggleGroupSingleProps extends ToggleGroupBaseProps {
  type?: 'single'
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
}

export interface ToggleGroupMultipleProps extends ToggleGroupBaseProps {
  type: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type ToggleGroupProps = (
  | ToggleGroupSingleProps
  | ToggleGroupMultipleProps
) &
  Omit<
    ButtonHTMLAttributes<HTMLDivElement>,
    | keyof ToggleGroupBaseProps
    | 'type'
    | 'value'
    | 'defaultValue'
    | 'onChange'
    | 'dir'
  >
