import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useControllableState } from '../internal/state'
import {
  TimePickerContext,
  type TimePickerContextValue,
} from './TimePicker.context'
import {
  DEFAULT_HOUR_CYCLE,
  DEFAULT_STEP_SECONDS,
} from './TimePicker.constants'
import { TimePickerContent } from './TimePickerContent'
import { TimePickerPortal } from './TimePickerPortal'
import { TimePickerTrigger } from './TimePickerTrigger'
import type {
  TimePickerColumnSlot,
  TimePickerRootProps,
  TimeValue,
} from './TimePicker.types'
import { clampTime, formatTimeISO } from './TimePicker.utils'

const DEFAULT_SEED: TimeValue = { hours: 12, minutes: 0 }

export function TimePickerRoot(props: TimePickerRootProps) {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    hourCycle = DEFAULT_HOUR_CYCLE,
    showSeconds = false,
    step = DEFAULT_STEP_SECONDS,
    min,
    max,
    disabled = false,
    readOnly = false,
    dir: dirProp,
    id: idProp,
    name,
    form,
    required,
    children,
  } = props

  const [value, setValueRaw] = useControllableState<TimeValue | null>(
    valueProp,
    defaultValue ?? null,
    onValueChange,
  )

  const [open, setOpen] = useControllableState<boolean>(
    openProp,
    defaultOpen,
    onOpenChange,
  )

  const displayValue: TimeValue = useMemo(() => {
    if (value) return value
    return clampTime(DEFAULT_SEED, min, max)
  }, [value, min, max])

  const hasValue = value !== null

  const setValue = useCallback(
    (next: TimeValue | null) => {
      if (next === null) {
        setValueRaw(null)
        return
      }
      const cleaned = showSeconds ? { ...next, seconds: next.seconds ?? 0 } : next
      setValueRaw(clampTime(cleaned, min, max))
    },
    [setValueRaw, showSeconds, min, max],
  )

  // ── Pending (popover staging) ────────────────────────────────
  const [pending, setPending] = useState<TimeValue | null>(null)

  // Seed pending = displayValue when popover opens; clear on close.
  const prevOpen = useRef(open)
  useEffect(() => {
    if (open && !prevOpen.current) {
      setPending(displayValue)
    }
    if (!open && prevOpen.current) {
      setPending(null)
    }
    prevOpen.current = open
  }, [open, displayValue])

  const isPending = pending !== null
  const effectiveValue = pending ?? displayValue

  const setEffectiveValue = useCallback(
    (next: TimeValue) => {
      if (pending !== null) {
        setPending(clampTime(showSeconds ? { ...next, seconds: next.seconds ?? 0 } : next, min, max))
      } else {
        setValue(next)
      }
    },
    [pending, setValue, showSeconds, min, max],
  )

  const commitPending = useCallback(() => {
    if (pending) setValue(pending)
    setPending(null)
  }, [pending, setValue])

  const discardPending = useCallback(() => {
    setPending(null)
  }, [])

  const slots = useMemo<ReadonlyArray<TimePickerColumnSlot>>(() => {
    const out: TimePickerColumnSlot[] = ['hour', 'minute']
    if (showSeconds) out.push('second')
    if (hourCycle === 'h12') out.push('period')
    return out
  }, [showSeconds, hourCycle])

  const reactId = useId()
  const contentId = idProp ?? `swift-timepicker-${reactId}`
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  // ── RTL detection (sniff on mount, skip on SSR) ──────────────
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

  const ctx = useMemo<TimePickerContextValue>(
    () => ({
      value: displayValue,
      hasValue,
      setValue,
      pending,
      effectiveValue,
      setEffectiveValue,
      commitPending,
      discardPending,
      isPending,
      open,
      setOpen,
      hourCycle,
      showSeconds,
      step,
      min,
      max,
      disabled,
      readOnly,
      dir,
      slots,
      contentId,
      triggerRef,
    }),
    [
      displayValue,
      hasValue,
      setValue,
      pending,
      effectiveValue,
      setEffectiveValue,
      commitPending,
      discardPending,
      isPending,
      open,
      setOpen,
      hourCycle,
      showSeconds,
      step,
      min,
      max,
      disabled,
      readOnly,
      dir,
      slots,
      contentId,
    ],
  )

  // Default shape: Trigger + Portal + Content (auto-renders Columns + Actions).
  const composedChildren = children ?? (
    <>
      <TimePickerTrigger />
      <TimePickerPortal>
        <TimePickerContent />
      </TimePickerPortal>
    </>
  )

  return (
    <TimePickerContext.Provider value={ctx}>
      {composedChildren}
      {name ? (
        <input
          type="hidden"
          name={name}
          value={hasValue ? formatTimeISO(value, showSeconds) : ''}
          form={form}
          required={required}
        />
      ) : null}
    </TimePickerContext.Provider>
  )
}
TimePickerRoot.displayName = 'TimePicker'
