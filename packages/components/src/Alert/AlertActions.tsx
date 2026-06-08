import { forwardRef } from 'react'
import { actionsClasses, cx } from './Alert.styles'
import type { AlertActionsProps } from './Alert.types'

/** Slot for action buttons (Retry / Dismiss / View — whatever the
 *  consumer drops in). Renders to the trailing edge of the alert by
 *  default via `margin-inline-start: auto`. */
export const AlertActions = forwardRef<HTMLDivElement, AlertActionsProps>(
  function AlertActions({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(actionsClasses, className)} {...rest} />
  },
)
AlertActions.displayName = 'Alert.Actions'
