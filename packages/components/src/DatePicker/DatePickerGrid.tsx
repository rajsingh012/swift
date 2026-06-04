import { forwardRef, useRef, type KeyboardEvent } from 'react'
import { mergeRefs } from '../internal/refs'
import { useDatePicker } from './DatePicker.context'
import {
  cx,
  gridClasses,
  weekNumberCellClasses,
  weekdayCellClasses,
  weekdayHeaderRowClasses,
} from './DatePicker.styles'
import { DatePickerDay } from './DatePickerDay'
import {
  clampToBounds,
  endOfWeek,
  formatMonthLabel,
  getISOWeekNumber,
  getMonthGrid,
  getWeekdayLabels,
  isMonthVisible,
  startOfWeek,
  type Dayjs,
} from './DatePicker.utils'
import type { DatePickerGridProps } from './DatePicker.types'

export const DatePickerGrid = forwardRef<HTMLTableElement, DatePickerGridProps>(
  function DatePickerGrid({ monthOffset = 0, className, onKeyDown, ...rest }, ref) {
    const {
      viewMonth,
      setViewMonth,
      focusedDate,
      setFocusedDate,
      weekStartsOn,
      numberOfMonths,
      showWeekNumbers,
      locale,
      min,
      max,
      isDateDisabled,
      selectDate,
      setHoverDate,
    } = useDatePicker('DatePicker.Grid')

    const gridRef = useRef<HTMLTableElement | null>(null)
    const panelMonth = viewMonth.add(monthOffset, 'month')
    const weeks = getMonthGrid(panelMonth, weekStartsOn)
    const weekdayLabels = getWeekdayLabels(locale, weekStartsOn)
    const caption = formatMonthLabel(panelMonth, locale)

    /**
     * Move focusedDate to `next` (clamped). If the new date isn't in any
     * visible panel, shift viewMonth so it becomes either the first or
     * last visible month — direction depends on which way the user moved.
     */
    const moveFocusTo = (next: Dayjs) => {
      const clamped = clampToBounds(next, min, max)
      setFocusedDate(clamped)
      if (!isMonthVisible(clamped, viewMonth, numberOfMonths)) {
        if (clamped.isBefore(viewMonth, 'month')) {
          setViewMonth(clamped.startOf('month'))
        } else {
          // After the visible window — clamp so it becomes the rightmost panel.
          setViewMonth(
            clamped.subtract(numberOfMonths - 1, 'month').startOf('month'),
          )
        }
      }
      // Focus the cell once the new tabIndex layout commits.
      requestAnimationFrame(() => {
        const key = clamped.format('YYYY-MM-DD')
        // In multi-month mode, the focusable cell lives in whichever grid
        // owns its month — search the whole content, not just this grid.
        const root =
          gridRef.current?.closest<HTMLElement>('[role="dialog"]') ??
          gridRef.current
        root
          ?.querySelector<HTMLElement>(`[data-date="${key}"]`)
          ?.focus({ preventScroll: true })
      })
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLTableElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return

      const key = event.key
      const shift = event.shiftKey

      switch (key) {
        case 'ArrowLeft':
          event.preventDefault()
          moveFocusTo(focusedDate.subtract(1, 'day'))
          return
        case 'ArrowRight':
          event.preventDefault()
          moveFocusTo(focusedDate.add(1, 'day'))
          return
        case 'ArrowUp':
          event.preventDefault()
          moveFocusTo(focusedDate.subtract(7, 'day'))
          return
        case 'ArrowDown':
          event.preventDefault()
          moveFocusTo(focusedDate.add(7, 'day'))
          return
        case 'Home':
          event.preventDefault()
          moveFocusTo(startOfWeek(focusedDate, weekStartsOn))
          return
        case 'End':
          event.preventDefault()
          moveFocusTo(endOfWeek(focusedDate, weekStartsOn))
          return
        case 'PageUp':
          event.preventDefault()
          moveFocusTo(
            shift
              ? focusedDate.subtract(1, 'year')
              : focusedDate.subtract(1, 'month'),
          )
          return
        case 'PageDown':
          event.preventDefault()
          moveFocusTo(
            shift ? focusedDate.add(1, 'year') : focusedDate.add(1, 'month'),
          )
          return
        case 'Enter':
        case ' ': {
          event.preventDefault()
          const target = focusedDate.toDate()
          if (isDateDisabled(target)) return
          selectDate(target)
          return
        }
      }
    }

    const handleMouseLeave = () => {
      setHoverDate(null)
    }

    return (
      <table
        ref={mergeRefs(ref, gridRef)}
        role="grid"
        aria-label={caption}
        onKeyDown={handleKeyDown}
        onMouseLeave={handleMouseLeave}
        className={cx(gridClasses, className)}
        {...rest}
      >
        <thead className={weekdayHeaderRowClasses}>
          <tr>
            {showWeekNumbers ? (
              <th scope="col" className={weekNumberCellClasses} aria-label="Week">
                #
              </th>
            ) : null}
            {weekdayLabels.map((label, i) => (
              <th key={i} scope="col" className={weekdayCellClasses}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, w) => (
            <tr key={w}>
              {showWeekNumbers ? (
                <th
                  scope="row"
                  className={weekNumberCellClasses}
                  aria-label={`Week ${getISOWeekNumber(week[0].date)}`}
                >
                  {getISOWeekNumber(week[0].date)}
                </th>
              ) : null}
              {week.map(({ date, isOutsideMonth }) => (
                <td key={date.toISOString()} className="p-0 text-center">
                  <DatePickerDay
                    date={date.toDate()}
                    isOutsideMonth={isOutsideMonth}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  },
)
DatePickerGrid.displayName = 'DatePicker.Grid'
