import { forwardRef, type MouseEvent } from 'react'
import { useDatePicker } from './DatePicker.context'
import { cx, navButtonClasses } from './DatePicker.styles'
import { clampToBounds, dayjs } from './DatePicker.utils'
import type { DatePickerNextButtonProps } from './DatePicker.types'

export const DatePickerNextButton = forwardRef<
  HTMLButtonElement,
  DatePickerNextButtonProps
>(function DatePickerNextButton(props, ref) {
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
  } = useDatePicker('DatePicker.NextButton')

  // Step by numberOfMonths so both panels swap together in multi-month
  // mode. Disabled when the month after the last visible panel is > max.
  const stride = numberOfMonths
  const lastVisible = viewMonth.add(numberOfMonths - 1, 'month')
  const outOfBounds =
    !!max && dayjs(max).isBefore(lastVisible.add(1, 'month'), 'month')
  const disabled = disabledProp || outOfBounds

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || disabled) return
    setViewMonth(viewMonth.add(stride, 'month'))
    setFocusedDate(clampToBounds(focusedDate.add(stride, 'month'), min, max))
  }

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      aria-label="Next month"
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
          <path d="M9 6L15 12L9 18" />
        </svg>
      )}
    </button>
  )
})
DatePickerNextButton.displayName = 'DatePicker.NextButton'
