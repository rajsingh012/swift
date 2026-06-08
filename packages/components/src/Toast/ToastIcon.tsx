import { forwardRef } from 'react'
import { useToastItemContext } from './Toast.context'
import { DEFAULT_TYPE_ICON } from './Toast.icons'
import { cx, iconWrapperClasses } from './Toast.styles'
import type { ToastIconProps } from './Toast.types'

export const ToastIcon = forwardRef<HTMLSpanElement, ToastIconProps>(
  function ToastIcon({ className, children, ...rest }, ref) {
    const { toast } = useToastItemContext()
    // null = consumer explicitly suppressed the icon
    if (toast.icon === null) return null

    const resolved =
      children ?? toast.icon ?? defaultGlyph(toast.type) ?? null
    if (resolved === null) return null

    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cx(iconWrapperClasses, className)}
        {...rest}
      >
        {resolved}
      </span>
    )
  },
)
ToastIcon.displayName = 'Toast.Icon'

function defaultGlyph(type: import('./Toast.types').ToastType) {
  const Icon = DEFAULT_TYPE_ICON[type]
  return Icon ? <Icon size={18} /> : null
}
