import { forwardRef } from 'react'
import { useDatePicker } from './DatePicker.context'
import {
  cx,
  headerClasses,
  headerLabelClasses,
} from './DatePicker.styles'
import { DatePickerNextButton } from './DatePickerNextButton'
import { DatePickerPrevButton } from './DatePickerPrevButton'
import { formatMonthLabel } from './DatePicker.utils'
import type { DatePickerHeaderProps } from './DatePicker.types'

/**
 * Calendar header. In multi-month mode (`numberOfMonths > 1`):
 *   - First panel shows PrevButton + label
 *   - Last panel shows label + NextButton
 *   - Middle panels show just the label (kept centered via spacers)
 * In single-month mode: PrevButton + label + NextButton.
 *
 * Override by passing `children`.
 */
export const DatePickerHeader = forwardRef<HTMLDivElement, DatePickerHeaderProps>(
  function DatePickerHeader({ monthOffset = 0, children, className, ...rest }, ref) {
    const { viewMonth, locale, numberOfMonths } = useDatePicker(
      'DatePicker.Header',
    )
    const panelMonth = viewMonth.add(monthOffset, 'month')
    const label = formatMonthLabel(panelMonth, locale)

    if (children) {
      return (
        <div ref={ref} className={cx(headerClasses, className)} {...rest}>
          {children}
        </div>
      )
    }

    const isFirstPanel = monthOffset === 0
    const isLastPanel = monthOffset === numberOfMonths - 1

    return (
      <div ref={ref} className={cx(headerClasses, className)} {...rest}>
        {/* Prev — first panel only. Spacer keeps the label centered when absent. */}
        {isFirstPanel ? (
          <DatePickerPrevButton />
        ) : (
          <span aria-hidden="true" className="inline-block size-7" />
        )}
        <span
          className={headerLabelClasses}
          aria-live="polite"
          aria-atomic="true"
        >
          {label}
        </span>
        {isLastPanel ? (
          <DatePickerNextButton />
        ) : (
          <span aria-hidden="true" className="inline-block size-7" />
        )}
      </div>
    )
  },
)
DatePickerHeader.displayName = 'DatePicker.Header'
