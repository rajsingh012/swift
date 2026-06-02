import { forwardRef, type MouseEvent } from 'react'
import { Button } from '../Button'
import { useTimePicker } from './TimePicker.context'
import type { TimePickerCancelProps } from './TimePicker.types'

/**
 * Discards the staged value and closes the popover. Renders an outline
 * Button by default.
 */
export const TimePickerCancel = forwardRef<HTMLButtonElement, TimePickerCancelProps>(
  function TimePickerCancel(props, ref) {
    const {
      asChild = false,
      onClick,
      className,
      children,
      ...rest
    } = props
    const { setOpen, discardPending } = useTimePicker('TimePicker.Cancel')

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      discardPending()
      setOpen(false)
    }

    void asChild

    return (
      <Button
        ref={ref}
        variant="outline"
        size="md"
        fullWidth
        onClick={handleClick}
        classes={{ root: className }}
        {...rest}
      >
        {children ?? 'Cancel'}
      </Button>
    )
  },
)
TimePickerCancel.displayName = 'TimePicker.Cancel'
