import { forwardRef } from 'react'
import { actionsClasses, cx } from './TimePicker.styles'
import type { TimePickerActionsProps } from './TimePicker.types'

export const TimePickerActions = forwardRef<HTMLDivElement, TimePickerActionsProps>(
  function TimePickerActions({ children, className, ...rest }, ref) {
    return (
      <div ref={ref} className={cx(actionsClasses, className)} {...rest}>
        {children}
      </div>
    )
  },
)
TimePickerActions.displayName = 'TimePicker.Actions'
