import { forwardRef } from 'react'
import { useButtonContext } from './Button.context'
import { cx, iconSlotSizeClasses } from './Button.styles'
import type { ButtonRightIconProps } from './Button.types'

/**
 * Decorative icon rendered after the label. Inherits its size from the
 * enclosing `<Button>` via context; pass `size` to override. Always
 * `aria-hidden` — the button's text (or `aria-label`) provides the name.
 */
export const ButtonRightIcon = forwardRef<
  HTMLSpanElement,
  ButtonRightIconProps
>(function ButtonRightIcon({ className, children, size, ...rest }, ref) {
  const ctx = useButtonContext('Button.RightIcon')
  const resolvedSize = size ?? ctx.size
  return (
    <span
      ref={ref}
      aria-hidden
      data-slot="right-icon"
      className={cx(iconSlotSizeClasses[resolvedSize], className)}
      {...rest}
    >
      {children}
    </span>
  )
})
ButtonRightIcon.displayName = 'Button.RightIcon'
