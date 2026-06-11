import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from 'react'

/** 24-hour internal time. Seconds are optional. */
export interface TimeValue {
  hours: number
  minutes: number
  seconds?: number
}

/** Display style. `h12` = 1–12 + AM/PM toggle. `h23` = 0–23. */
export type TimePickerHourCycle = 'h12' | 'h23'

/** Which slot a stepper column represents. */
export type TimePickerColumnSlot = 'hour' | 'minute' | 'second' | 'period'

export interface TimePickerRootProps {
  /** Controlled selected time. `null` = no selection. */
  value?: TimeValue | null
  /** Uncontrolled initial value. Ignored when `value` is provided. */
  defaultValue?: TimeValue | null
  /** Fires when the user commits via OK (or clicks an option in inline mode). */
  onValueChange?: (value: TimeValue | null) => void

  /** Controlled popover open state. */
  open?: boolean
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean
  /** Fires on every open/close request. */
  onOpenChange?: (open: boolean) => void

  /** Display format. Default `'h23'`. */
  hourCycle?: TimePickerHourCycle

  /** Render a seconds column. Default `false`. */
  showSeconds?: boolean

  /**
   * Step in seconds for the minute (and seconds) columns. Default `60`
   * (1 minute). Common values: 60, 300 (5 min), 900 (15 min), 1800 (30 min).
   */
  step?: number

  /** Earliest selectable time (inclusive). */
  min?: TimeValue
  /** Latest selectable time (inclusive). */
  max?: TimeValue

  /** Disable all interaction. */
  disabled?: boolean
  /** Focusable but not editable. */
  readOnly?: boolean

  /** Explicit direction. Otherwise sniffed from `closest('[dir]')` on the trigger. */
  dir?: 'ltr' | 'rtl'

  /** Explicit id for the popover content (else auto-generated). */
  id?: string

  /** Native form name. Renders a hidden ISO-time input (`HH:MM[:SS]`). */
  name?: string
  /** Associates the hidden input with an external `<form>` by id. */
  form?: string
  /** Marks the hidden input as required for native validation. */
  required?: boolean

  children?: ReactNode
}

export interface TimePickerTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Placeholder when no value is selected. */
  placeholder?: string
  /** Override how the selected time is rendered. */
  formatValue?: (value: TimeValue, hourCycle: TimePickerHourCycle) => string
  /** Merge trigger props onto a single child element. */
  asChild?: boolean
}

export interface TimePickerPortalProps {
  container?: HTMLElement | null
  children?: ReactNode
}

export interface TimePickerContentProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onKeyDown'> {
  closeOnEscape?: boolean
  closeOnInteractOutside?: boolean
  forceMount?: boolean
  onOpenAutoFocus?: (event: Event) => void
  onCloseAutoFocus?: (event: Event) => void
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onInteractOutside?: (event: PointerEvent) => void
  children?: ReactNode
}

export interface TimePickerActionsProps
  extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export interface TimePickerCancelProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export interface TimePickerOKProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export interface TimePickerSteppersProps
  extends HTMLAttributes<HTMLDivElement> {}
