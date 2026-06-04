import { forwardRef, type MouseEvent } from 'react'
import { Button } from '../Button'
import { useTimePicker } from './TimePicker.context'
import type { TimePickerOKProps } from './TimePicker.types'

/**
 * Promotes the staged value to the committed `value` and closes the
 * popover. Renders a primary Button by default.
 */
export const TimePickerOK = forwardRef<HTMLButtonElement, TimePickerOKProps>(
  function TimePickerOK(props, ref) {
    const {
      asChild = false,
      onClick,
      className,
      children,
      ...rest
    } = props
    const { setOpen, commitPending } = useTimePicker('TimePicker.OK')

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      commitPending()
      setOpen(false)
    }

    // asChild is preserved for backward compat; current Button has its
    // own polymorphism via `as`, so the asChild prop is treated as a
    // no-op here.
    void asChild

    return (
      <Button
        ref={ref}
        variant="primary"
        size="md"
        fullWidth
        onClick={handleClick}
        classes={{ root: className }}
        {...rest}
      >
        {children ?? 'OK'}
      </Button>
    )
  },
)
TimePickerOK.displayName = 'TimePicker.OK'
