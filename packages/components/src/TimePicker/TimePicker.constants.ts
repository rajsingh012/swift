import type { TimePickerHourCycle } from './TimePicker.types'

export const DEFAULT_HOUR_CYCLE: TimePickerHourCycle = 'h23'

/** 60 seconds — i.e. minute resolution. */
export const DEFAULT_STEP_SECONDS = 60

/** Two-digit display zero-padding for hours / minutes / seconds. */
export const TWO_DIGIT = (n: number): string =>
  (n < 10 ? '0' : '') + String(n)
