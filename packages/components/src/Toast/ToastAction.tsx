import { forwardRef, type MouseEvent } from 'react'
import { useToastItemContext } from './Toast.context'
import { actionClasses, cx } from './Toast.styles'
import type { ToastActionProps } from './Toast.types'

export const ToastAction = forwardRef<HTMLButtonElement, ToastActionProps>(
  function ToastAction({ className, onClick, ...rest }, ref) {
    const { dismiss } = useToastItemContext()

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented) dismiss()
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={cx(actionClasses, className)}
        {...rest}
      />
    )
  },
)
ToastAction.displayName = 'Toast.Action'
