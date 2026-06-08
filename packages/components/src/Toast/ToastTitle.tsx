import { forwardRef } from 'react'
import { cx, titleClasses } from './Toast.styles'
import type { ToastTitleProps } from './Toast.types'

export const ToastTitle = forwardRef<HTMLDivElement, ToastTitleProps>(
  function ToastTitle({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(titleClasses, className)} {...rest} />
  },
)
ToastTitle.displayName = 'Toast.Title'
