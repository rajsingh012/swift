import { forwardRef, type MouseEvent } from 'react'
import { Slot } from '../internal/Slot'
import { mergeRefs } from '../internal/refs'
import { useDatePicker } from './DatePicker.context'
import { DEFAULT_FORMAT_OPTIONS } from './DatePicker.constants'
import { cx, triggerClasses } from './DatePicker.styles'
import type { DatePickerTriggerProps } from './DatePicker.types'

const DEFAULT_FORMAT_OPTIONS_WITH_TIME: Intl.DateTimeFormatOptions = {
  ...DEFAULT_FORMAT_OPTIONS,
  hour: 'numeric',
  minute: '2-digit',
}

const defaultFormatValue = (date: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, DEFAULT_FORMAT_OPTIONS).format(date)

const defaultFormatValueWithTime = (date: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, DEFAULT_FORMAT_OPTIONS_WITH_TIME).format(date)

/**
 * Format a range value for display in a single Trigger — "May 1 → May 7".
 * Each side independently falls back to the placeholder when null, so a
 * half-committed range renders as "May 1 → Pick a date".
 */
function formatRange(
  start: Date | null,
  end: Date | null,
  placeholder: string,
  locale: string,
  fmt: (d: Date, l: string) => string,
): { label: string; isPlaceholder: boolean } {
  if (!start && !end) return { label: placeholder, isPlaceholder: true }
  const startLabel = start ? fmt(start, locale) : placeholder
  const endLabel = end ? fmt(end, locale) : placeholder
  return { label: `${startLabel} → ${endLabel}`, isPlaceholder: false }
}

export const DatePickerTrigger = forwardRef<
  HTMLButtonElement,
  DatePickerTriggerProps
>(function DatePickerTrigger(props, ref) {
  const {
    placeholder = 'Pick a date',
    formatValue: formatValueProp,
    asChild = false,
    onClick,
    type,
    className,
    children,
    ...rest
  } = props
  const {
    mode,
    value,
    rangeValue,
    open,
    setOpen,
    contentId,
    triggerRef,
    locale,
    withTime,
  } = useDatePicker('DatePicker.Trigger')

  // Default format includes hour + minute when withTime is on.
  const formatValue =
    formatValueProp ?? (withTime ? defaultFormatValueWithTime : defaultFormatValue)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) setOpen(!open)
  }

  // ── Label resolution per mode ───────────────────────────────────
  let label = placeholder
  let isPlaceholder = true
  if (mode === 'range') {
    const formatted = formatRange(
      rangeValue.start,
      rangeValue.end,
      placeholder,
      locale,
      formatValue,
    )
    label = formatted.label
    isPlaceholder = formatted.isPlaceholder
  } else if (value) {
    label = formatValue(value, locale)
    isPlaceholder = false
  }

  const composedRef = mergeRefs<HTMLButtonElement>(ref, (node) => {
    triggerRef.current = node
  })

  const sharedProps = {
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': open,
    'aria-controls': open ? contentId : undefined,
    'data-state': open ? 'open' : 'closed',
    'data-placeholder': isPlaceholder ? 'true' : undefined,
    onClick: handleClick,
    className: cx(triggerClasses, className),
    ...rest,
  }

  if (asChild) {
    return (
      <Slot ref={composedRef as never} {...sharedProps}>
        {children ?? <span>{label}</span>}
      </Slot>
    )
  }

  return (
    <button
      ref={composedRef}
      type={type ?? 'button'}
      {...sharedProps}
    >
      {children ?? label}
    </button>
  )
})
DatePickerTrigger.displayName = 'DatePicker.Trigger'
