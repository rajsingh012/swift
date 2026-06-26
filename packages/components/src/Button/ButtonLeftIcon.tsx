import { forwardRef } from 'react'
import { useButtonContext } from './Button.context'
import { cx, iconSlotSizeClasses } from './Button.styles'
import type { ButtonLeftIconProps } from './Button.types'

/**
 * Decorative icon rendered before the label. Inherits its size from the
 * enclosing `<Button>` via context; pass `size` to override. Always
 * `aria-hidden` — the button's text (or `aria-label`) provides the name.
 */
export const ButtonLeftIcon = forwardRef<HTMLSpanElement, ButtonLeftIconProps>(
  function ButtonLeftIcon({ className, children, size, ...rest }, ref) {
    const ctx = useButtonContext('Button.LeftIcon')
    const resolvedSize = size ?? ctx.size
    return (
      <span
        ref={ref}
        aria-hidden
        data-slot="left-icon"
        className={cx(iconSlotSizeClasses[resolvedSize], className)}
        {...rest}
      >
        {children}
      </span>
    )
  },
)
ButtonLeftIcon.displayName = 'Button.LeftIcon'
