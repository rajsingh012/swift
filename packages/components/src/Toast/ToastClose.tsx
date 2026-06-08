import { Close } from '@swift/icons/Close'
import { forwardRef, type MouseEvent } from 'react'
import { useToastItemContext } from './Toast.context'
import { closeClasses, cx } from './Toast.styles'
import type { ToastCloseProps } from './Toast.types'

export const ToastClose = forwardRef<HTMLButtonElement, ToastCloseProps>(
  function ToastClose(
    { className, children, onClick, 'aria-label': ariaLabel, ...rest },
    ref,
  ) {
    const { dismiss } = useToastItemContext()

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented) dismiss()
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel ?? 'Dismiss notification'}
        onClick={handleClick}
        className={cx(closeClasses, className)}
        {...rest}
      >
        {children ?? <Close size={14} />}
      </button>
    )
  },
)
ToastClose.displayName = 'Toast.Close'
