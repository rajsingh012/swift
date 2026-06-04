import type { HTMLAttributes } from 'react'

export interface YearPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled selected year. */
  value?: number
  /** Uncontrolled initial selection. */
  defaultValue?: number
  /** Fires on year click. */
  onValueChange?: (year: number) => void

  /** Earliest selectable year. Default `currentYear - 50`. */
  min?: number
  /** Latest selectable year. Default `currentYear + 10`. */
  max?: number

  /** Disable all interaction. */
  disabled?: boolean

  /** Native form name — emits a hidden numeric input. */
  name?: string
  /** Associates the hidden input with an external `<form>` by id. */
  form?: string
  /** Marks the hidden input as required. */
  required?: boolean

  /** Header label rendered above the year list. Default `'Year'`. */
  label?: string
}
