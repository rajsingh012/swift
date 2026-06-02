import dayjs, { type Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'

// Enable strict format parsing — `dayjs(input, format, true)` returns an
// invalid Dayjs when the input doesn't match, which is what Input needs
// to discriminate "still typing" from "ready to commit".
dayjs.extend(customParseFormat)
// `.week()` plus ISO week semantics for the optional week-numbers column.
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

/**
 * Build the 6×7 calendar grid for a given month. Leading cells come
 * from the previous month, trailing cells from the next month, so the
 * grid is always rectangular. `weekStartsOn` shifts the leading offset
 * so Monday-first locales align correctly.
 */
export function getMonthGrid(
  viewMonth: Dayjs,
  weekStartsOn: number,
): Array<Array<{ date: Dayjs; isOutsideMonth: boolean }>> {
  const firstOfMonth = viewMonth.startOf('month')
  // 0 = Sunday in dayjs day(); shift so the column index 0 maps to `weekStartsOn`.
  const leadingOffset = (firstOfMonth.day() - weekStartsOn + 7) % 7
  const gridStart = firstOfMonth.subtract(leadingOffset, 'day')

  const month = viewMonth.month()
  const weeks: Array<Array<{ date: Dayjs; isOutsideMonth: boolean }>> = []
  for (let w = 0; w < 6; w++) {
    const week: Array<{ date: Dayjs; isOutsideMonth: boolean }> = []
    for (let d = 0; d < 7; d++) {
      const date = gridStart.add(w * 7 + d, 'day')
      week.push({ date, isOutsideMonth: date.month() !== month })
    }
    weeks.push(week)
  }
  return weeks
}

/**
 * Localised weekday short labels, starting at `weekStartsOn`. Uses Intl
 * so consumer locale carries through — no shipped translation tables.
 */
export function getWeekdayLabels(locale: string, weekStartsOn: number): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  // Use a known Sunday (2024-01-07) as the anchor, then rotate.
  const sunday = new Date(Date.UTC(2024, 0, 7))
  const labels: string[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(sunday)
    day.setUTCDate(sunday.getUTCDate() + ((i + weekStartsOn) % 7))
    labels.push(formatter.format(day))
  }
  return labels
}

export function formatMonthLabel(viewMonth: Dayjs, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(viewMonth.toDate())
}

export function isSameDay(a: Dayjs, b: Dayjs | Date | null | undefined): boolean {
  if (!b) return false
  return a.isSame(dayjs(b), 'day')
}

export function isToday(a: Dayjs): boolean {
  return a.isSame(dayjs(), 'day')
}

/**
 * Day is disabled if outside min/max, or if `disabledDates` excludes it.
 * Centralised so Day cells, keyboard nav, and Prev/Next bounds all use
 * the same predicate.
 */
export function isDateDisabled(
  date: Date,
  min: Date | undefined,
  max: Date | undefined,
  disabledDates: Date[] | ((d: Date) => boolean) | undefined,
): boolean {
  const d = dayjs(date)
  if (min && d.isBefore(dayjs(min), 'day')) return true
  if (max && d.isAfter(dayjs(max), 'day')) return true
  if (!disabledDates) return false
  if (typeof disabledDates === 'function') return disabledDates(date)
  return disabledDates.some((other) => dayjs(other).isSame(d, 'day'))
}

/** Clamp a date into [min, max], snapping to whichever bound it crosses. */
export function clampToBounds(
  date: Dayjs,
  min: Date | undefined,
  max: Date | undefined,
): Dayjs {
  if (min && date.isBefore(dayjs(min), 'day')) return dayjs(min).startOf('day')
  if (max && date.isAfter(dayjs(max), 'day')) return dayjs(max).startOf('day')
  return date
}

/** First day of the week containing `date`, respecting `weekStartsOn`. */
export function startOfWeek(date: Dayjs, weekStartsOn: number): Dayjs {
  const offset = (date.day() - weekStartsOn + 7) % 7
  return date.subtract(offset, 'day')
}

/** Last day of the week containing `date`, respecting `weekStartsOn`. */
export function endOfWeek(date: Dayjs, weekStartsOn: number): Dayjs {
  return startOfWeek(date, weekStartsOn).add(6, 'day')
}

/** Format a Date as ISO 8601 calendar date (no timezone). Empty when null. */
export function formatISODate(date: Date | null): string {
  return date ? dayjs(date).format('YYYY-MM-DD') : ''
}

/**
 * Format a Date as `YYYY-MM-DDTHH:MM` (local time, no timezone offset).
 * Compatible with the value of an `<input type="datetime-local">`.
 * Empty when null. Used by hidden form inputs in `withTime` mode.
 */
export function formatISODateTime(
  date: Date | null,
  showSeconds = false,
): string {
  if (!date) return ''
  const fmt = showSeconds ? 'YYYY-MM-DDTHH:mm:ss' : 'YYYY-MM-DDTHH:mm'
  return dayjs(date).format(fmt)
}

/**
 * Localised month names for MonthSelect. Anchored on a known leap year so
 * the 1st of each month always exists.
 */
export function getMonthNames(
  locale: string,
  format: 'long' | 'short' | 'narrow' = 'long',
): string[] {
  const f = new Intl.DateTimeFormat(locale, { month: format })
  return Array.from({ length: 12 }, (_, i) => f.format(new Date(2024, i, 1)))
}

/**
 * ISO 8601 week number for the given date. Monday-based, week containing
 * the year's first Thursday is week 1 — the standard expected by most
 * European reporting / scheduling tools.
 */
export function getISOWeekNumber(date: Dayjs): number {
  // dayjs.isoWeek() returns the ISO week (1..53) once the isoWeek plugin
  // is loaded above.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (date as unknown as { isoWeek: () => number }).isoWeek()
}

/** Whether `date`'s month appears in any of the currently visible panels. */
export function isMonthVisible(
  date: Dayjs,
  viewMonth: Dayjs,
  numberOfMonths: number,
): boolean {
  for (let i = 0; i < numberOfMonths; i++) {
    if (date.isSame(viewMonth.add(i, 'month'), 'month')) return true
  }
  return false
}

/* ── Time helpers (for withTime mode) ─────────────────────────── */

import type { TimeValue } from '../TimePicker/TimePicker.types'

/** Extract HH/MM/SS from a Date. Returns null when `date` is null. */
export function extractTime(date: Date | null): TimeValue | null {
  if (!date) return null
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  }
}

/** Merge a calendar date with a wall-clock time. */
export function combineDateAndTime(date: Date, time: TimeValue): Date {
  const result = new Date(date)
  result.setHours(time.hours, time.minutes, time.seconds ?? 0, 0)
  return result
}

/** Default time stamp seeded onto a freshly-picked date in withTime mode. */
export const DEFAULT_TIME: TimeValue = { hours: 12, minutes: 0 }

/* ── Range helpers ────────────────────────────────────────────── */

import type { DatePickerRangeValue } from './DatePicker.types'

export function isRangeStart(date: Dayjs, range: DatePickerRangeValue): boolean {
  return !!range.start && date.isSame(dayjs(range.start), 'day')
}

export function isRangeEnd(date: Dayjs, range: DatePickerRangeValue): boolean {
  return !!range.end && date.isSame(dayjs(range.end), 'day')
}

/** Strictly between start and end (exclusive both ends). */
export function isInRange(date: Dayjs, range: DatePickerRangeValue): boolean {
  if (!range.start || !range.end) return false
  const start = dayjs(range.start)
  const end = dayjs(range.end)
  return date.isAfter(start, 'day') && date.isBefore(end, 'day')
}

/**
 * Hover preview state: when start is set but end isn't, the cells from
 * start → hoverDate (inclusive) light up so the user sees what they'd
 * commit on click. Returns true for cells strictly inside that preview
 * span — start/end cells get their own data-attrs.
 */
export function isInRangePreview(
  date: Dayjs,
  range: DatePickerRangeValue,
  hoverDate: Dayjs | null,
): boolean {
  if (!range.start || range.end || !hoverDate) return false
  const start = dayjs(range.start)
  const lo = start.isBefore(hoverDate, 'day') ? start : hoverDate
  const hi = start.isBefore(hoverDate, 'day') ? hoverDate : start
  return date.isAfter(lo, 'day') && date.isBefore(hi, 'day')
}

/** The "tail" of the preview span — where the second click would land. */
export function isPreviewEnd(
  date: Dayjs,
  range: DatePickerRangeValue,
  hoverDate: Dayjs | null,
): boolean {
  if (!range.start || range.end || !hoverDate) return false
  return date.isSame(hoverDate, 'day') && !date.isSame(dayjs(range.start), 'day')
}

/**
 * Range click state machine. First click sets start, second click sets
 * end. If the second click falls before the existing start, we swap so
 * the stored range is always normalised (start ≤ end). A third click on
 * a committed range restarts.
 *
 * Returns the next range plus `complete` — true when both sides are set,
 * which is the cue for the popover to auto-close.
 */
export function computeRangeUpdate(
  current: DatePickerRangeValue,
  date: Date,
): { next: DatePickerRangeValue; complete: boolean } {
  const start = current.start
  const end = current.end

  if (!start || (start && end)) {
    // No start yet, or full range — start fresh.
    return { next: { start: date, end: null }, complete: false }
  }

  // start set, end null — this is the second click.
  if (dayjs(date).isBefore(dayjs(start), 'day')) {
    // Swap so start ≤ end.
    return { next: { start: date, end: start }, complete: true }
  }
  return { next: { start, end: date }, complete: true }
}

/** Resolve a locale string with an SSR-safe fallback. */
export function resolveLocale(explicit: string | undefined): string {
  if (explicit) return explicit
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language
  }
  return 'en-US'
}

export { dayjs }
export type { Dayjs }
