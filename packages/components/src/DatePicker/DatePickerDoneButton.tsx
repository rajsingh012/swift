import { forwardRef, type MouseEvent } from 'react'
import { Slot } from '../internal/Slot'
import { useDatePicker } from './DatePicker.context'
import { cx, doneButtonClasses } from './DatePicker.styles'
import type { DatePickerDoneButtonProps } from './DatePicker.types'

/**
 * Closes the popover. Useful inside `withTime` flows, where day-click
 * no longer auto-closes — the user explicitly confirms when they're
 * done picking date + time.
 */
export const DatePickerDoneButton = forwardRef<HTMLButtonElement, DatePickerDoneButtonProps>(
  function DatePickerDoneButton(props, ref) {
    const {
      asChild = false,
      onClick,
      type,
      className,
      children,
      ...rest
    } = props
    const { setOpen } = useDatePicker('DatePicker.DoneButton')

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      setOpen(false)
    }

    const sharedProps = {
      onClick: handleClick,
      className: cx(doneButtonClasses, className),
      ...rest,
    }

    if (asChild) {
      return (
        <Slot ref={ref as never} {...sharedProps}>
          {children ?? <span>Done</span>}
        </Slot>
      )
    }

    return (
      <button ref={ref} type={type ?? 'button'} {...sharedProps}>
        {children ?? 'Done'}
      </button>
    )
  },
)
DatePickerDoneButton.displayName = 'DatePicker.DoneButton'
