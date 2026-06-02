import { forwardRef } from 'react'
import { useDatePicker } from './DatePicker.context'
import { calendarClasses, cx, multiMonthRowClasses } from './DatePicker.styles'
import { DatePickerGrid } from './DatePickerGrid'
import { DatePickerHeader } from './DatePickerHeader'
import type { DatePickerCalendarProps } from './DatePicker.types'

/**
 * Default calendar shape:
 *   - `numberOfMonths === 1`: a single Header + Grid stack.
 *   - `numberOfMonths > 1`:   N panels side-by-side. PrevButton lives in
 *                             the first panel header, NextButton in the
 *                             last; middle panels get just their label.
 *                             This matches the booking-site convention
 *                             (Booking.com / Airbnb).
 *
 * Override by passing `children` for a custom layout (presets sidebar,
 * vertical stack on mobile, etc.).
 */
export const DatePickerCalendar = forwardRef<HTMLDivElement, DatePickerCalendarProps>(
  function DatePickerCalendar({ children, className, ...rest }, ref) {
    const { numberOfMonths } = useDatePicker('DatePicker.Calendar')

    if (children) {
      return (
        <div ref={ref} className={cx(calendarClasses, className)} {...rest}>
          {children}
        </div>
      )
    }

    if (numberOfMonths <= 1) {
      return (
        <div ref={ref} className={cx(calendarClasses, className)} {...rest}>
          <DatePickerHeader />
          <DatePickerGrid />
        </div>
      )
    }

    return (
      <div ref={ref} className={cx(calendarClasses, className)} {...rest}>
        <div className={multiMonthRowClasses}>
          {Array.from({ length: numberOfMonths }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <DatePickerHeader monthOffset={i} />
              <DatePickerGrid monthOffset={i} />
            </div>
          ))}
        </div>
      </div>
    )
  },
)
DatePickerCalendar.displayName = 'DatePicker.Calendar'
