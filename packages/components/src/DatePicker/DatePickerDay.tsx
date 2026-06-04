import { forwardRef, type MouseEvent } from 'react'
import { useDatePicker } from './DatePicker.context'
import { cellWrapperClasses, cx, dayCellClasses } from './DatePicker.styles'
import {
  dayjs,
  isInRange,
  isInRangePreview,
  isRangeEnd,
  isRangeStart,
  isSameDay,
  isToday,
} from './DatePicker.utils'
import type { DatePickerDayCellProps } from './DatePicker.types'

export const DatePickerDay = forwardRef<HTMLButtonElement, DatePickerDayCellProps>(
  function DatePickerDay(props, ref) {
    const { date, isOutsideMonth, onClick, onMouseEnter, type, className, ...rest } =
      props
    const {
      mode,
      value,
      rangeValue,
      selectDate,
      hoverDate,
      setHoverDate,
      focusedDate,
      setFocusedDate,
      isDateDisabled,
    } = useDatePicker('DatePicker.Day')

    const d = dayjs(date)
    const disabled = isDateDisabled(date)
    const isFocused = d.isSame(focusedDate, 'day')
    const today = isToday(d)

    // ── Mode-specific state ─────────────────────────────────────
    let selected = false
    let isStart = false
    let isEnd = false
    let inRange = false
    let inPreview = false

    if (mode === 'single') {
      selected = isSameDay(d, value)
    } else {
      isStart = isRangeStart(d, rangeValue)
      isEnd = isRangeEnd(d, rangeValue)
      selected = isStart || isEnd
      inRange = isInRange(d, rangeValue)
      inPreview = isInRangePreview(d, rangeValue, hoverDate)
    }

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      if (disabled) return
      setFocusedDate(d)
      selectDate(date)
    }

    const handleMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
      onMouseEnter?.(event)
      // Only track hover when we're actually previewing a range — saves
      // re-renders during normal mouse movement in single mode or after
      // a range has been committed.
      if (mode === 'range' && rangeValue.start && !rangeValue.end) {
        setHoverDate(d)
      }
    }

    const label = d.format('dddd, MMMM D, YYYY')

    return (
      <div
        className={cellWrapperClasses}
        data-range-start={isStart ? 'true' : undefined}
        data-range-end={isEnd ? 'true' : undefined}
        data-in-range={inRange ? 'true' : undefined}
        data-in-preview={inPreview ? 'true' : undefined}
      >
        <button
          ref={ref}
          role="gridcell"
          type={type ?? 'button'}
          aria-selected={selected}
          aria-disabled={disabled || undefined}
          aria-label={label}
          disabled={disabled}
          data-date={d.format('YYYY-MM-DD')}
          data-selected={selected ? 'true' : undefined}
          data-today={today ? 'true' : undefined}
          data-outside-month={isOutsideMonth ? 'true' : undefined}
          data-disabled={disabled ? 'true' : undefined}
          tabIndex={isFocused ? 0 : -1}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          className={cx(dayCellClasses, className)}
          {...rest}
        >
          {d.date()}
        </button>
      </div>
    )
  },
)
DatePickerDay.displayName = 'DatePicker.Day'
