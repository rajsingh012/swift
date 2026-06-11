import { createContext, useContext, type RefObject } from 'react'
import type {
  TimePickerColumnSlot,
  TimePickerHourCycle,
  TimeValue,
} from './TimePicker.types'

export interface TimePickerContextValue {
  /** Committed value (last OK click or external set). */
  value: TimeValue
  /** Whether the user has set a value vs the seeded default. */
  hasValue: boolean
  /** Direct setter — bypasses the OK/Cancel staging. Used in inline mode. */
  setValue: (next: TimeValue | null) => void

  /** Staged value while the popover is open. `null` outside popover lifecycle. */
  pending: TimeValue | null
  /** Either `pending` (when staging) or `value` — the value to display. */
  effectiveValue: TimeValue
  /** Update the staged value if staging, else commit directly. */
  setEffectiveValue: (next: TimeValue) => void
  /** Promote `pending` to `value` and clear pending. */
  commitPending: () => void
  /** Drop `pending` without touching `value`. */
  discardPending: () => void
  /** Whether the popover is currently in pending/staging mode. */
  isPending: boolean

  open: boolean
  setOpen: (next: boolean) => void

  hourCycle: TimePickerHourCycle
  showSeconds: boolean
  step: number
  min?: TimeValue
  max?: TimeValue

  disabled: boolean
  readOnly: boolean

  /**
   * Resolved writing direction — explicit `dir` prop or sniffed from the
   * trigger. The steppers have no horizontal arrow-key navigation, so
   * this currently only drives the popover's `dir` attribute (CSS
   * logical properties).
   */
  dir: 'ltr' | 'rtl'

  /** Ordered columns derived from hourCycle + showSeconds. */
  slots: ReadonlyArray<TimePickerColumnSlot>

  contentId: string
  triggerRef: RefObject<HTMLButtonElement | null>
}

export const TimePickerContext = createContext<TimePickerContextValue | null>(
  null,
)

export function useTimePicker(consumer: string): TimePickerContextValue {
  const ctx = useContext(TimePickerContext)
  if (!ctx) {
    throw new Error(
      `${consumer} must be rendered inside a <TimePicker> root.`,
    )
  }
  return ctx
}
