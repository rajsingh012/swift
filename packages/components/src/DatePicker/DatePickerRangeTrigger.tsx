import { forwardRef, type MouseEvent } from 'react'
import { Slot } from '../internal/Slot'
import { mergeRefs } from '../internal/refs'
import { useDatePicker } from './DatePicker.context'
import { DEFAULT_FORMAT_OPTIONS } from './DatePicker.constants'
import { cx, triggerClasses } from './DatePicker.styles'
import type { DatePickerRangeTriggerProps } from './DatePicker.types'

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
 * Two-field range trigger — the booking-style Check-in / Check-out
 * pattern. Each instance reads only its own side of the range and opens
 * the shared popover when clicked. Slot-level focus seeding (calendar
 * lands on start vs end) is handled by Root via `notifyRangeTriggerClick`.
 *
 *   <DatePicker mode="range">
 *     <DatePicker.RangeTrigger slot="start" placeholder="Check-in" />
 *     <DatePicker.RangeTrigger slot="end" placeholder="Check-out" />
 *     <DatePicker.Portal><DatePicker.Content /></DatePicker.Portal>
 *   </DatePicker>
 */
export const DatePickerRangeTrigger = forwardRef<
  HTMLButtonElement,
  DatePickerRangeTriggerProps
>(function DatePickerRangeTrigger(props, ref) {
  const {
    slot,
    placeholder,
    formatValue: formatValueProp,
    asChild = false,
    onClick,
    type,
    className,
    children,
    ...rest
  } = props
  const {
    rangeValue,
    open,
    setOpen,
    contentId,
    triggerRef,
    locale,
    notifyRangeTriggerClick,
    withTime,
  } = useDatePicker('DatePicker.RangeTrigger')

  const formatValue =
    formatValueProp ?? (withTime ? defaultFormatValueWithTime : defaultFormatValue)

  const slotValue = slot === 'start' ? rangeValue.start : rangeValue.end
  const fallback =
    placeholder ?? (slot === 'start' ? 'Check-in' : 'Check-out')
  const label = slotValue ? formatValue(slotValue, locale) : fallback
  const isPlaceholder = !slotValue

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    notifyRangeTriggerClick(slot)
    setOpen(true)
  }

  const composedRef = mergeRefs<HTMLButtonElement>(ref, (node) => {
    // Last clicked trigger owns focus restore on close.
    triggerRef.current = node
  })

  const sharedProps = {
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': open,
    'aria-controls': open ? contentId : undefined,
    'data-state': open ? 'open' : 'closed',
    'data-slot': slot,
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
DatePickerRangeTrigger.displayName = 'DatePicker.RangeTrigger'
