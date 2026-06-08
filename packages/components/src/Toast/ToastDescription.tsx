import { forwardRef } from 'react'
import { cx, descriptionClasses } from './Toast.styles'
import type { ToastDescriptionProps } from './Toast.types'

export const ToastDescription = forwardRef<HTMLDivElement, ToastDescriptionProps>(
  function ToastDescription({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(descriptionClasses, className)} {...rest} />
  },
)
ToastDescription.displayName = 'Toast.Description'
