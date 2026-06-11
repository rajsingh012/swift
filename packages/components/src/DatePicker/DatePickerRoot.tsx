import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useControllableState } from '../internal/state'
import {
  DatePickerContext,
  type DatePickerContextValue,
} from './DatePicker.context'
import { DEFAULT_WEEK_STARTS_ON } from './DatePicker.constants'
import { DatePickerContent } from './DatePickerContent'
import { DatePickerPortal } from './DatePickerPortal'
import { DatePickerTrigger } from './DatePickerTrigger'
import type {
  DatePickerRangeTriggerSlot,
  DatePickerRangeValue,
  DatePickerRootProps,
  DatePickerValue,
} from './DatePicker.types'
import {
  clampToBounds,
  combineDateAndTime,
  computeRangeUpdate,
  dayjs,
  DEFAULT_TIME,
  formatISODate,
  formatISODateTime,
  isDateDisabled as isDateDisabledFn,
  resolveLocale,
  type Dayjs,
} from './DatePicker.utils'
import type { TimeValue } from '../TimePicker/TimePicker.types'

const EMPTY_RANGE: DatePickerRangeValue = { start: null, end: null }

export function DatePickerRoot(props: DatePickerRootProps) {
  const mode = props.mode ?? 'single'
  const {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    weekStartsOn = DEFAULT_WEEK_STARTS_ON,
    numberOfMonths = 1,
    showWeekNumbers = false,
    withTime = false,
    timeProps,
    min,
    max,
    disabledDates,
    locale: localeProp,
    dir: dirProp,
    id: idProp,
    name,
    form,
    required,
    children,
  } = props

  // ── Value: dual-state (one per mode) ─────────────────────────────
  // Both hooks always run (Rules of Hooks), only the matching one is
  // surfaced via context. Cost is one extra ref per render — fine.
  const singleValueProp = mode === 'single' ? (props.value as DatePickerValue | undefined) : undefined
  const singleDefault = mode === 'single' ? ((props.defaultValue as DatePickerValue | undefined) ?? null) : null
  const singleOnChange = mode === 'single' ? (props.onValueChange as ((v: DatePickerValue) => void) | undefined) : undefined

  const rangeValueProp = mode === 'range' ? (props.value as DatePickerRangeValue | undefined) : undefined
  const rangeDefault = mode === 'range'
    ? ((props.defaultValue as DatePickerRangeValue | undefined) ?? EMPTY_RANGE)
    : EMPTY_RANGE
  const rangeOnChange = mode === 'range' ? (props.onValueChange as ((v: DatePickerRangeValue) => void) | undefined) : undefined

  const [singleValue, setSingleValue] = useControllableState<DatePickerValue>(
    singleValueProp,
    singleDefault,
    singleOnChange,
  )
  const [rangeValue, setRangeValue] = useControllableState<DatePickerRangeValue>(
    rangeValueProp,
    rangeDefault,
    rangeOnChange,
  )

  const [open, setOpen] = useControllableState<boolean>(
    openProp,
    defaultOpen,
    onOpenChange,
  )

  // ── Seed view / focused date ────────────────────────────────────
  // Anchor: the current selection (range.start preferred over end), else today.
  const seedFromValue = useCallback((): Dayjs => {
    if (mode === 'range') {
      const anchor = rangeValue.start ?? rangeValue.end
      return clampToBounds(dayjs(anchor ?? new Date()), min, max)
    }
    return clampToBounds(dayjs(singleValue ?? new Date()), min, max)
  }, [mode, rangeValue.start, rangeValue.end, singleValue, min, max])

  const initialSeed = useMemo<Dayjs>(
    () => seedFromValue(),
    // Only run on mount — `value` changes shouldn't yank the visible
    // month mid-interaction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const [viewMonth, setViewMonth] = useState<Dayjs>(() => initialSeed.startOf('month'))
  const [focusedDate, setFocusedDate] = useState<Dayjs>(() => initialSeed)
  const [hoverDate, setHoverDate] = useState<Dayjs | null>(null)

  // ── Range-trigger slot tracking ─────────────────────────────────
  // When user clicks the check-in vs check-out field, we re-seed focus
  // to that slot's date on the next open.
  const pendingSlotRef = useRef<DatePickerRangeTriggerSlot | null>(null)
  const notifyRangeTriggerClick = useCallback(
    (slot: DatePickerRangeTriggerSlot) => {
      pendingSlotRef.current = slot
    },
    [],
  )

  // ── Re-seed on popover open transitions ─────────────────────────
  const prevOpen = useRef(open)
  useEffect(() => {
    if (open && !prevOpen.current) {
      let target: Date | null = null
      if (mode === 'range') {
        const slot = pendingSlotRef.current
        if (slot === 'end') {
          target = rangeValue.end ?? rangeValue.start ?? null
        } else if (slot === 'start') {
          target = rangeValue.start ?? null
        } else {
          target = rangeValue.start ?? rangeValue.end ?? null
        }
        pendingSlotRef.current = null
      } else {
        target = singleValue
      }
      const next = clampToBounds(dayjs(target ?? new Date()), min, max)
      setFocusedDate(next)
      setViewMonth(next.startOf('month'))
    }
    if (!open && prevOpen.current) {
      // Clear hover on close so the next open doesn't flash a stale preview.
      setHoverDate(null)
    }
    prevOpen.current = open
  }, [open, mode, singleValue, rangeValue.start, rangeValue.end, min, max])

  // ── Unified click handler ───────────────────────────────────────
  const selectDate = useCallback(
    (date: Date) => {
      if (mode === 'single') {
        // Preserve existing time portion when withTime is on; default to
        // noon for the first selection. Without withTime, the Date is
        // stored as-is (typically the calendar passes a midnight Date).
        const next = withTime
          ? combineDateAndTime(
              date,
              singleValue
                ? {
                    hours: singleValue.getHours(),
                    minutes: singleValue.getMinutes(),
                    seconds: singleValue.getSeconds(),
                  }
                : DEFAULT_TIME,
            )
          : date
        setSingleValue(next)
        // In withTime mode the popover stays open so users can also set
        // the time. They explicitly confirm via the Done button.
        if (!withTime) setOpen(false)
        return
      }
      const { next: rawNext, complete } = computeRangeUpdate(rangeValue, date)
      const finalNext = withTime
        ? {
            start: rawNext.start
              ? combineDateAndTime(
                  rawNext.start,
                  rangeValue.start
                    ? {
                        hours: rangeValue.start.getHours(),
                        minutes: rangeValue.start.getMinutes(),
                        seconds: rangeValue.start.getSeconds(),
                      }
                    : DEFAULT_TIME,
                )
              : null,
            end: rawNext.end
              ? combineDateAndTime(
                  rawNext.end,
                  rangeValue.end
                    ? {
                        hours: rangeValue.end.getHours(),
                        minutes: rangeValue.end.getMinutes(),
                        seconds: rangeValue.end.getSeconds(),
                      }
                    : DEFAULT_TIME,
                )
              : null,
          }
        : rawNext
      setRangeValue(finalNext)
      // Range mode auto-closes on completion only when there's no time
      // to also pick. With withTime, users confirm via Done.
      if (complete && !withTime) {
        setOpen(false)
        setHoverDate(null)
      }
    },
    [mode, withTime, rangeValue, singleValue, setSingleValue, setRangeValue, setOpen],
  )

  /**
   * Update only the time portion of the current value, leaving the day
   * untouched. Used by the embedded TimePicker in withTime mode.
   */
  const setTime = useCallback(
    (time: TimeValue, slot?: 'start' | 'end') => {
      if (mode === 'single') {
        if (!singleValue) return
        setSingleValue(combineDateAndTime(singleValue, time))
        return
      }
      const target = slot === 'end' ? rangeValue.end : rangeValue.start
      if (!target) return
      setRangeValue({
        ...rangeValue,
        ...(slot === 'end'
          ? { end: combineDateAndTime(target, time) }
          : { start: combineDateAndTime(target, time) }),
      })
    },
    [mode, singleValue, rangeValue, setSingleValue, setRangeValue],
  )

  /**
   * Direct value commit for Presets — single click sets the entire value
   * (Date in single mode, full {start, end} in range mode) and closes
   * the popover.
   */
  const commitValue = useCallback(
    (value: Date | DatePickerRangeValue) => {
      if (mode === 'single') {
        // Range value passed in single mode → pick start.
        if (value instanceof Date) setSingleValue(value)
        else setSingleValue(value.start ?? value.end ?? null)
      } else {
        if (value instanceof Date) {
          setRangeValue({ start: value, end: value })
        } else {
          setRangeValue(value)
        }
      }
      setOpen(false)
      setHoverDate(null)
    },
    [mode, setSingleValue, setRangeValue, setOpen],
  )

  const isDateDisabled = useCallback(
    (date: Date) => isDateDisabledFn(date, min, max, disabledDates),
    [min, max, disabledDates],
  )

  const reactId = useId()
  const contentId = idProp ?? `swift-datepicker-${reactId}`

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const locale = resolveLocale(localeProp)

  // ── RTL detection (sniff on mount, skip on SSR) ─────────────────
  // The root renders no element of its own, so sniff from the trigger —
  // the nearest node in normal flow. Re-runs on open so late-mounted
  // triggers are picked up. Explicit `dir` prop always wins.
  const [detectedDir, setDetectedDir] = useState<'ltr' | 'rtl'>('ltr')
  useEffect(() => {
    if (dirProp !== undefined) return
    const el = triggerRef.current
    if (!el) return
    const dirAttr = el.closest('[dir]')?.getAttribute('dir')
    setDetectedDir(dirAttr === 'rtl' ? 'rtl' : 'ltr')
  }, [dirProp, open])
  const dir = dirProp ?? detectedDir

  const ctx = useMemo<DatePickerContextValue>(
    () => ({
      mode,
      value: mode === 'single' ? singleValue : null,
      rangeValue: mode === 'range' ? rangeValue : EMPTY_RANGE,
      selectDate,
      open,
      setOpen,
      viewMonth,
      setViewMonth,
      focusedDate,
      setFocusedDate,
      hoverDate,
      setHoverDate,
      weekStartsOn,
      numberOfMonths,
      showWeekNumbers,
      locale,
      dir,
      min,
      max,
      isDateDisabled,
      commitValue,
      withTime,
      timeProps,
      setTime,
      contentId,
      triggerRef,
      notifyRangeTriggerClick,
    }),
    [
      mode,
      singleValue,
      rangeValue,
      selectDate,
      open,
      setOpen,
      viewMonth,
      focusedDate,
      hoverDate,
      weekStartsOn,
      numberOfMonths,
      showWeekNumbers,
      locale,
      dir,
      min,
      max,
      isDateDisabled,
      commitValue,
      withTime,
      timeProps,
      setTime,
      contentId,
      notifyRangeTriggerClick,
    ],
  )

  const composedChildren = children ?? (
    <>
      <DatePickerTrigger />
      <DatePickerPortal>
        <DatePickerContent />
      </DatePickerPortal>
    </>
  )

  // Hidden inputs for native / form-library compatibility.
  // Without withTime: ISO calendar date (YYYY-MM-DD).
  // With withTime: ISO local datetime (YYYY-MM-DDTHH:MM[:SS]) — the
  // value that an `<input type="datetime-local">` would post.
  // Single mode emits one input; range mode emits `.start` and `.end`
  // (React Hook Form / Formik dot-notation friendly).
  const formatForInput = (d: Date | null): string =>
    withTime ? formatISODateTime(d, !!timeProps?.showSeconds) : formatISODate(d)

  const hiddenInputs = name ? (
    mode === 'range' ? (
      <>
        <input
          type="hidden"
          name={`${name}.start`}
          value={formatForInput(rangeValue.start)}
          form={form}
          required={required}
        />
        <input
          type="hidden"
          name={`${name}.end`}
          value={formatForInput(rangeValue.end)}
          form={form}
          required={required}
        />
      </>
    ) : (
      <input
        type="hidden"
        name={name}
        value={formatForInput(singleValue)}
        form={form}
        required={required}
      />
    )
  ) : null

  return (
    <DatePickerContext.Provider value={ctx}>
      {composedChildren}
      {hiddenInputs}
    </DatePickerContext.Provider>
  )
}
DatePickerRoot.displayName = 'DatePicker'
