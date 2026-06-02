import { forwardRef, useMemo, type ChangeEvent } from 'react'
import { useDatePicker } from './DatePicker.context'
import { cx, selectClasses } from './DatePicker.styles'
import { clampToBounds } from './DatePicker.utils'
import type { DatePickerYearSelectProps } from './DatePicker.types'

/** Default year window when min/max aren't set: ±20 years from current. */
const DEFAULT_WINDOW = 20

/**
 * Year picker for the calendar header. Range defaults to min/max's
 * years when set, else ±20 from the current year. Override via
 * `from` / `to`.
 */
export const DatePickerYearSelect = forwardRef<
  HTMLSelectElement,
  DatePickerYearSelectProps
>(function DatePickerYearSelect(props, ref) {
  const { from, to, onChange, className, disabled, ...rest } = props
  const {
    viewMonth,
    setViewMonth,
    focusedDate,
    setFocusedDate,
    min,
    max,
  } = useDatePicker('DatePicker.YearSelect')

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const lo = from ?? (min ? min.getFullYear() : currentYear - DEFAULT_WINDOW)
    const hi = to ?? (max ? max.getFullYear() : currentYear + DEFAULT_WINDOW)
    const out: number[] = []
    for (let y = lo; y <= hi; y++) out.push(y)
    return out
  }, [from, to, min, max])

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event)
    if (event.defaultPrevented) return
    const nextYear = Number(event.target.value)
    const nextView = viewMonth.year(nextYear)
    setViewMonth(nextView)
    setFocusedDate(clampToBounds(focusedDate.year(nextYear), min, max))
  }

  return (
    <select
      ref={ref}
      value={viewMonth.year()}
      onChange={handleChange}
      disabled={disabled}
      aria-label="Year"
      className={cx(selectClasses, className)}
      {...rest}
    >
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  )
})
DatePickerYearSelect.displayName = 'DatePicker.YearSelect'
