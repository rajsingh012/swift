import { createContext, useContext, type RefObject } from 'react'
import type { Dayjs } from 'dayjs'
import type {
  DatePickerMode,
  DatePickerRangeTriggerSlot,
  DatePickerRangeValue,
  DatePickerTimeProps,
  DatePickerValue,
} from './DatePicker.types'
import type { TimeValue } from '../TimePicker/TimePicker.types'

export interface DatePickerContextValue {
  mode: DatePickerMode

  /** Single-mode value. `null` when `mode === 'range'`. */
  value: DatePickerValue
  /** Range-mode value. Always `{ start, end }`; both null when `mode === 'single'`. */
  rangeValue: DatePickerRangeValue

  /**
   * Unified day-click handler. In single mode: sets value + closes. In
   * range mode: runs the start→end state machine, closes once the range
   * is complete. In `withTime` mode: preserves time portion and skips
   * the auto-close so users can also pick a time.
   */
  selectDate: (date: Date) => void

  open: boolean
  setOpen: (next: boolean) => void

  viewMonth: Dayjs
  setViewMonth: (next: Dayjs) => void

  focusedDate: Dayjs
  setFocusedDate: (next: Dayjs) => void

  /** Cell currently being hovered in the grid — drives range preview. */
  hoverDate: Dayjs | null
  setHoverDate: (next: Dayjs | null) => void

  weekStartsOn: number
  numberOfMonths: number
  showWeekNumbers: boolean
  locale: string

  min?: Date
  max?: Date
  isDateDisabled: (date: Date) => boolean

  /**
   * Commit a value directly (bypasses the range click state machine).
   * Used by Presets — a single click sets the entire value (single Date
   * or full range) and closes the popover.
   */
  commitValue: (value: Date | DatePickerRangeValue) => void

  /** Enable the embedded TimePicker inside the popover. */
  withTime: boolean
  /** Configuration passed through to the embedded TimePicker(s). */
  timeProps: DatePickerTimeProps | undefined
  /**
   * Update the time portion of the current value. Slot is required in
   * range mode (which side to update). Doesn't close the popover.
   */
  setTime: (time: TimeValue, slot?: 'start' | 'end') => void

  contentId: string
  triggerRef: RefObject<HTMLButtonElement | null>
  /**
   * Called by RangeTrigger on click so the popover knows which slot
   * (start / end) opened it and can seed focus accordingly. Plain
   * Trigger doesn't use this.
   */
  notifyRangeTriggerClick: (slot: DatePickerRangeTriggerSlot) => void
}

export const DatePickerContext = createContext<DatePickerContextValue | null>(
  null,
)

export function useDatePicker(consumer: string): DatePickerContextValue {
  const ctx = useContext(DatePickerContext)
  if (!ctx) {
    throw new Error(
      `${consumer} must be rendered inside a <DatePicker> root.`,
    )
  }
  return ctx
}
