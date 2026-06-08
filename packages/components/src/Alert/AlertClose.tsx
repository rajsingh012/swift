import { Close } from '@swift/icons/Close'
import { forwardRef, type MouseEvent } from 'react'
import { useAlertContext } from './Alert.context'
import { closeClasses, cx } from './Alert.styles'
import type { AlertCloseProps } from './Alert.types'

/** Manual-dismiss button. Reads `close` and `dismissible` from the
 *  Alert context — renders nothing when the alert isn't dismissible so
 *  consumers can drop `<Alert.Close />` unconditionally and let the
 *  parent decide.
 *
 *  Defaults to the `Close` glyph and `aria-label="Dismiss alert"`;
 *  override either via the matching prop. */
export const AlertClose = forwardRef<HTMLButtonElement, AlertCloseProps>(
  function AlertClose(
    { className, children, onClick, 'aria-label': ariaLabel, ...rest },
    ref,
  ) {
    const { close, dismissible } = useAlertContext()
    if (!dismissible) return null

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented) close()
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel ?? 'Dismiss alert'}
        onClick={handleClick}
        className={cx(closeClasses, className)}
        {...rest}
      >
        {children ?? <Close size={14} />}
      </button>
    )
  },
)
AlertClose.displayName = 'Alert.Close'
