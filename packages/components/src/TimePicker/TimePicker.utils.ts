import { TWO_DIGIT } from './TimePicker.constants'
import type {
  TimePickerColumnSlot,
  TimePickerHourCycle,
  TimeValue,
} from './TimePicker.types'

/* ── Core math ─────────────────────────────────────────────────── */

export function timeToSeconds(t: TimeValue): number {
  return t.hours * 3600 + t.minutes * 60 + (t.seconds ?? 0)
}

export function secondsToTime(s: number, showSeconds: boolean): TimeValue {
  const normalised = ((s % 86400) + 86400) % 86400
  const hours = Math.floor(normalised / 3600)
  const minutes = Math.floor((normalised % 3600) / 60)
  const seconds = normalised % 60
  return showSeconds ? { hours, minutes, seconds } : { hours, minutes }
}

export function isSameTime(a: TimeValue, b: TimeValue): boolean {
  return (
    a.hours === b.hours &&
    a.minutes === b.minutes &&
    (a.seconds ?? 0) === (b.seconds ?? 0)
  )
}

export function isTimeInBounds(
  t: TimeValue,
  min: TimeValue | undefined,
  max: TimeValue | undefined,
): boolean {
  const s = timeToSeconds(t)
  if (min && s < timeToSeconds(min)) return false
  if (max && s > timeToSeconds(max)) return false
  return true
}

export function clampTime(
  t: TimeValue,
  min: TimeValue | undefined,
  max: TimeValue | undefined,
): TimeValue {
  const s = timeToSeconds(t)
  if (min && s < timeToSeconds(min))
    return secondsToTime(timeToSeconds(min), t.seconds !== undefined)
  if (max && s > timeToSeconds(max))
    return secondsToTime(timeToSeconds(max), t.seconds !== undefined)
  return t
}

/* ── Column option generators ──────────────────────────────────── */

/** Hours visible in the hour column — 0–23 (h23) or 1–12 (h12). */
export function getHourOptions(hourCycle: TimePickerHourCycle): number[] {
  return hourCycle === 'h23'
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i + 1)
}

/* ── Stepper (++/--) ───────────────────────────────────────────── */

export function stepperBounds(
  slot: TimePickerColumnSlot,
  hourCycle: TimePickerHourCycle,
): { min: number; max: number } {
  switch (slot) {
    case 'hour':
      return hourCycle === 'h23' ? { min: 0, max: 23 } : { min: 1, max: 12 }
    case 'minute':
    case 'second':
      return { min: 0, max: 59 }
    case 'period':
      return { min: 0, max: 1 }
  }
}

/** Move a slot by +1 / −1 step, wrapping at the boundary. */
export function stepperAdjust(
  t: TimeValue,
  slot: TimePickerColumnSlot,
  direction: 1 | -1,
  step: number,
  _hourCycle: TimePickerHourCycle,
): TimeValue {
  void _hourCycle
  switch (slot) {
    case 'hour': {
      // Walk 24-hour clock; display formatting handles h12 conversion.
      const next = (t.hours + direction + 24) % 24
      return { ...t, hours: next }
    }
    case 'minute': {
      const stride = Math.max(1, Math.floor(step / 60))
      return { ...t, minutes: (t.minutes + direction * stride + 60) % 60 }
    }
    case 'second': {
      // Seconds always step by 1 — `step` is a minute-column setting only.
      void step
      const current = t.seconds ?? 0
      return { ...t, seconds: (current + direction + 60) % 60 }
    }
    case 'period': {
      const h12 = t.hours % 12
      const isPm = t.hours >= 12
      return { ...t, hours: isPm ? h12 : h12 + 12 }
    }
  }
}

/**
 * Minute / second options. `step` governs ONLY the minute column —
 * `step=60` → every minute, `step=300` → every 5 min, etc. Seconds
 * always step by 1 (consumers fine-tune to the exact second).
 */
export function getStepOptions(step: number, unit: 'minute' | 'second'): number[] {
  const stride =
    unit === 'minute' ? Math.max(1, Math.min(60, Math.floor(step / 60))) : 1
  const out: number[] = []
  for (let v = 0; v < 60; v += stride) out.push(v)
  return out
}

export const PERIOD_OPTIONS: ReadonlyArray<'am' | 'pm'> = ['am', 'pm']

/* ── Get / set segment value ──────────────────────────────────── */

export function getColumnValue(
  t: TimeValue,
  slot: TimePickerColumnSlot,
  hourCycle: TimePickerHourCycle,
): number | 'am' | 'pm' {
  switch (slot) {
    case 'hour':
      if (hourCycle === 'h23') return t.hours
      return t.hours % 12 === 0 ? 12 : t.hours % 12
    case 'minute':
      return t.minutes
    case 'second':
      return t.seconds ?? 0
    case 'period':
      return t.hours >= 12 ? 'pm' : 'am'
  }
}

export function setColumnValue(
  t: TimeValue,
  slot: TimePickerColumnSlot,
  next: number | 'am' | 'pm',
  hourCycle: TimePickerHourCycle,
): TimeValue {
  switch (slot) {
    case 'hour': {
      if (hourCycle === 'h23') {
        return { ...t, hours: clamp(next as number, 0, 23) }
      }
      const period: 'am' | 'pm' = t.hours >= 12 ? 'pm' : 'am'
      let h = clamp(next as number, 1, 12)
      if (h === 12) h = 0
      if (period === 'pm') h += 12
      return { ...t, hours: h }
    }
    case 'minute':
      return { ...t, minutes: clamp(next as number, 0, 59) }
    case 'second':
      return { ...t, seconds: clamp(next as number, 0, 59) }
    case 'period': {
      const hour12 = t.hours % 12
      return { ...t, hours: next === 'pm' ? hour12 + 12 : hour12 }
    }
  }
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}

/* ── Formatting ────────────────────────────────────────────────── */

export function formatColumnOption(
  value: number | 'am' | 'pm',
  slot: TimePickerColumnSlot,
): string {
  if (slot === 'period') return value === 'pm' ? 'PM' : 'AM'
  return TWO_DIGIT(value as number)
}

export function formatTimeDisplay(
  t: TimeValue,
  hourCycle: TimePickerHourCycle,
  showSeconds = false,
): string {
  if (hourCycle === 'h23') {
    const base = `${TWO_DIGIT(t.hours)}:${TWO_DIGIT(t.minutes)}`
    return showSeconds ? `${base}:${TWO_DIGIT(t.seconds ?? 0)}` : base
  }
  const hour12 = t.hours % 12 === 0 ? 12 : t.hours % 12
  const period = t.hours >= 12 ? 'PM' : 'AM'
  const base = `${TWO_DIGIT(hour12)}:${TWO_DIGIT(t.minutes)}`
  return showSeconds ? `${base}:${TWO_DIGIT(t.seconds ?? 0)} ${period}` : `${base} ${period}`
}

export function formatTimeISO(t: TimeValue | null, showSeconds: boolean): string {
  if (!t) return ''
  const hh = TWO_DIGIT(t.hours)
  const mm = TWO_DIGIT(t.minutes)
  return showSeconds ? `${hh}:${mm}:${TWO_DIGIT(t.seconds ?? 0)}` : `${hh}:${mm}`
}
