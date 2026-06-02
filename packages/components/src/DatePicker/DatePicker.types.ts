import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from 'react'
import type {
  TimePickerHourCycle,
  TimeValue,
} from '../TimePicker/TimePicker.types'

export interface DatePickerTimeProps {
  hourCycle?: TimePickerHourCycle
  step?: number
  showSeconds?: boolean
  min?: TimeValue
  max?: TimeValue
}

export type DatePickerValue = Date | null

export type DatePickerRangeValue = {
  start: Date | null
  end: Date | null
}

export type DatePickerMode = 'single' | 'range'

interface DatePickerCommonProps {
  /** Controlled popover open state. */
  open?: boolean
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean
  /** Fires on every open/close request. */
  onOpenChange?: (open: boolean) => void

  /** First day of the week, 0 (Sun) through 6 (Sat). Default 0. */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6

  /**
   * How many month panels to show side-by-side. Default 1. The booking
   * convention is 2 — lets users span a stay across months without
   * clicking next. Prev/Next step by `numberOfMonths` so both panels
   * shift in lockstep.
   */
  numberOfMonths?: number

  /**
   * Show an ISO week-number column on the left of each grid. Common in
   * European enterprise / scheduling apps; off by default.
   */
  showWeekNumbers?: boolean

  /**
   * Render an embedded TimePicker inside the popover so consumers can
   * pick a date AND a time in one trigger. The Date value preserves its
   * time component (default noon when first selected). Day-click no
   * longer auto-closes the popover — users explicitly confirm via the
   * Done button. Off by default.
   */
  withTime?: boolean

  /** Configuration passed through to the embedded TimePicker(s). */
  timeProps?: DatePickerTimeProps

  /** Earliest selectable date (inclusive). */
  min?: Date
  /** Latest selectable date (inclusive). */
  max?: Date
  /**
   * Disabled dates beyond min/max. Pass an array for fixed holidays/blackouts,
   * or a predicate for dynamic rules. Predicate runs once per visible cell
   * per render — keep it cheap.
   */
  disabledDates?: Date[] | ((date: Date) => boolean)

  /** BCP-47 locale for month / weekday labels. Defaults to `navigator.language`. */
  locale?: string

  /** Explicit id for the popover content (else auto-generated). */
  id?: string

  /**
   * Native form name. Renders a hidden input so the value posts with
   * the surrounding form (and integrates with React Hook Form / Formik
   * via standard registration). In range mode the picker emits two
   * inputs, `${name}.start` and `${name}.end`.
   */
  name?: string
  /** Associates the hidden input(s) with an external `<form>` by id. */
  form?: string
  /** Marks the hidden input(s) as required for native validation. */
  required?: boolean

  children?: ReactNode
}

/** Single-date picker props — the default `mode`. */
export type DatePickerSingleRootProps = DatePickerCommonProps & {
  mode?: 'single'
  value?: DatePickerValue
  defaultValue?: DatePickerValue
  onValueChange?: (value: DatePickerValue) => void
}

/** Range (check-in / check-out) picker props. */
export type DatePickerRangeRootProps = DatePickerCommonProps & {
  mode: 'range'
  value?: DatePickerRangeValue
  defaultValue?: DatePickerRangeValue
  onValueChange?: (value: DatePickerRangeValue) => void
}

export type DatePickerRootProps =
  | DatePickerSingleRootProps
  | DatePickerRangeRootProps

export interface DatePickerTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Placeholder text when no value is selected. */
  placeholder?: string
  /** Override how the selected date renders inside the Trigger. */
  formatValue?: (value: Date, locale: string) => string
  /**
   * Merge Trigger props onto a single child element instead of rendering
   * the default `<button>`. Lets consumers wrap with their own Button.
   */
  asChild?: boolean
}

export type DatePickerRangeTriggerSlot = 'start' | 'end'

export interface DatePickerRangeTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Which side of the range this trigger represents. The popover stays
   * shared — clicking either trigger opens the same calendar; the slot
   * just controls which value this button displays and which focus the
   * popover seeds to on open.
   */
  slot: DatePickerRangeTriggerSlot
  /** Placeholder text when the corresponding side has no value. */
  placeholder?: string
  /** Override how this slot's date renders. */
  formatValue?: (value: Date, locale: string) => string
  /** Merge props onto a custom child instead of rendering a `<button>`. */
  asChild?: boolean
}

export interface DatePickerPortalProps {
  container?: HTMLElement | null
  children?: ReactNode
}

export interface DatePickerContentProps
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

export interface DatePickerCalendarProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export interface DatePickerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Which panel this header belongs to in multi-month mode. The header
   * displays `viewMonth + monthOffset`. Defaults to 0 (the leftmost panel).
   */
  monthOffset?: number
  children?: ReactNode
}

export interface DatePickerPrevButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export interface DatePickerNextButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export interface DatePickerGridProps extends HTMLAttributes<HTMLTableElement> {
  /**
   * Which panel this grid belongs to in multi-month mode. The grid
   * renders the month at `viewMonth + monthOffset`. Defaults to 0.
   */
  monthOffset?: number
}

export interface DatePickerDayCellProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  date: Date
  isOutsideMonth: boolean
}

export interface DatePickerInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue'> {
  /**
   * Day.js format string for parse + display. Default `'YYYY-MM-DD'`.
   * Examples: `'MM/DD/YYYY'` (US), `'DD/MM/YYYY'` (most of Europe),
   * `'D MMM YYYY'` (with month abbreviation).
   */
  format?: string
  /** Open the popover when the input gains focus. Default `true`. */
  openOnFocus?: boolean
  /** Only meaningful in `mode='range'` — pick which side this input controls. */
  slot?: 'start' | 'end'
}

export interface DatePickerMonthSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'defaultValue'> {
  /** Long ('January') or short ('Jan') month names. Default `'long'`. */
  format?: 'long' | 'short' | 'narrow'
}

export interface DatePickerYearSelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'defaultValue'> {
  /** Lower year bound. Defaults to `min`'s year, or current − 20. */
  from?: number
  /** Upper year bound. Defaults to `max`'s year, or current + 20. */
  to?: number
}

export interface DatePickerPresetsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export type DatePickerPresetValue =
  | Date
  | DatePickerRangeValue
  | (() => Date | DatePickerRangeValue)

export interface DatePickerPresetProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  /**
   * The date (or range) this preset commits when clicked. Use a function
   * to compute fresh values at click time — "Today" stays accurate even
   * if the picker has been mounted across midnight.
   */
  value: DatePickerPresetValue
  /** Merge the preset's click behaviour onto a custom child. */
  asChild?: boolean
}

export interface DatePickerTimeFieldsProps
  extends HTMLAttributes<HTMLDivElement> {}

export interface DatePickerDoneButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Merge done-button behaviour onto a custom child. */
  asChild?: boolean
}
