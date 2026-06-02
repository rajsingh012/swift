import { forwardRef, type MouseEvent } from 'react'
import { Slot } from '../internal/Slot'
import { useDatePicker } from './DatePicker.context'
import { cx, presetClasses } from './DatePicker.styles'
import type { DatePickerPresetProps } from './DatePicker.types'

/**
 * Quick-pick button — commits a Date (or range) directly, bypassing the
 * two-click range state machine. Closes the popover on click.
 *
 * `value` accepts a function for date-of-day accuracy: `() => new Date()`
 * stays correct even if the picker has been mounted across midnight.
 */
export const DatePickerPreset = forwardRef<HTMLButtonElement, DatePickerPresetProps>(
  function DatePickerPreset(props, ref) {
    const {
      value,
      asChild = false,
      onClick,
      type,
      className,
      children,
      ...rest
    } = props
    const { commitValue } = useDatePicker('DatePicker.Preset')

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      const resolved = typeof value === 'function' ? value() : value
      commitValue(resolved)
    }

    const sharedProps = {
      onClick: handleClick,
      className: cx(presetClasses, className),
      ...rest,
    }

    if (asChild) {
      return (
        <Slot ref={ref as never} {...sharedProps}>
          {children ?? <span />}
        </Slot>
      )
    }

    return (
      <button ref={ref} type={type ?? 'button'} {...sharedProps}>
        {children}
      </button>
    )
  },
)
DatePickerPreset.displayName = 'DatePicker.Preset'
