import { forwardRef, type MouseEvent } from 'react'
import { useDatePicker } from './DatePicker.context'
import { cx, navButtonClasses } from './DatePicker.styles'
import { clampToBounds, dayjs } from './DatePicker.utils'
import type { DatePickerPrevButtonProps } from './DatePicker.types'

export const DatePickerPrevButton = forwardRef<
  HTMLButtonElement,
  DatePickerPrevButtonProps
>(function DatePickerPrevButton(props, ref) {
  const { onClick, type, className, children, disabled: disabledProp, ...rest } =
    props
  const {
    viewMonth,
    setViewMonth,
    focusedDate,
    setFocusedDate,
    numberOfMonths,
    min,
    max,
  } = useDatePicker('DatePicker.PrevButton')

  // Step by numberOfMonths so multi-month panels move in lockstep
  // (booking-site convention). Disabled when the entire previous window
  // would be < min.
  const stride = numberOfMonths
  const outOfBounds =
    !!min && dayjs(min).isAfter(viewMonth.subtract(1, 'month'), 'month')
  const disabled = disabledProp || outOfBounds

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || disabled) return
    setViewMonth(viewMonth.subtract(stride, 'month'))
    setFocusedDate(clampToBounds(focusedDate.subtract(stride, 'month'), min, max))
  }

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      aria-label="Previous month"
      disabled={disabled}
      onClick={handleClick}
      className={cx(navButtonClasses, className)}
      {...rest}
    >
      {children ?? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 18L9 12L15 6" />
        </svg>
      )}
    </button>
  )
})
DatePickerPrevButton.displayName = 'DatePicker.PrevButton'
