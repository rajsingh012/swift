import { forwardRef, useMemo, type ChangeEvent } from 'react'
import { useDatePicker } from './DatePicker.context'
import { cx, selectClasses } from './DatePicker.styles'
import { clampToBounds, dayjs, getMonthNames } from './DatePicker.utils'
import type { DatePickerMonthSelectProps } from './DatePicker.types'

/**
 * Month picker for the calendar header. Native `<select>` v1 — gets us
 * accessible, keyboard-driven behaviour without rolling a custom listbox.
 *
 *   <DatePicker.Header>
 *     <DatePicker.PrevButton />
 *     <DatePicker.MonthSelect />
 *     <DatePicker.YearSelect />
 *     <DatePicker.NextButton />
 *   </DatePicker.Header>
 */
export const DatePickerMonthSelect = forwardRef<
  HTMLSelectElement,
  DatePickerMonthSelectProps
>(function DatePickerMonthSelect(props, ref) {
  const { format = 'long', onChange, className, disabled, ...rest } = props
  const {
    viewMonth,
    setViewMonth,
    focusedDate,
    setFocusedDate,
    locale,
    min,
    max,
  } = useDatePicker('DatePicker.MonthSelect')

  const monthNames = useMemo(
    () => getMonthNames(locale, format),
    [locale, format],
  )

  // Disable months that fall entirely outside [min, max] so the dropdown
  // mirrors the Prev/Next disable rules.
  const isMonthOutOfBounds = (monthIndex: number): boolean => {
    const monthStart = viewMonth.year(viewMonth.year()).month(monthIndex).startOf('month')
    const monthEnd = monthStart.endOf('month')
    if (min && monthEnd.isBefore(dayjs(min), 'day')) return true
    if (max && monthStart.isAfter(dayjs(max), 'day')) return true
    return false
  }

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event)
    if (event.defaultPrevented) return
    const nextMonthIndex = Number(event.target.value)
    const nextView = viewMonth.month(nextMonthIndex)
    setViewMonth(nextView)
    // Shift focusedDate to keep same day-of-month in the new month
    // (Day.js clamps Feb 30 → Feb 28/29 automatically).
    setFocusedDate(clampToBounds(focusedDate.month(nextMonthIndex), min, max))
  }

  return (
    <select
      ref={ref}
      value={viewMonth.month()}
      onChange={handleChange}
      disabled={disabled}
      aria-label="Month"
      className={cx(selectClasses, className)}
      {...rest}
    >
      {monthNames.map((name, i) => (
        <option key={i} value={i} disabled={isMonthOutOfBounds(i)}>
          {name}
        </option>
      ))}
    </select>
  )
})
DatePickerMonthSelect.displayName = 'DatePicker.MonthSelect'
