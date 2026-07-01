import { forwardRef, type HTMLAttributes } from 'react'
import { useToggleItemContext } from './Toggle.context'
import { cx, iconSlotSizeClasses } from './Toggle.styles'
import type { ToggleSize } from './Toggle.types'

export interface ToggleIconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Override the icon size cascaded from the enclosing `<Toggle>`. */
  size?: ToggleSize
}

/**
 * Decorative icon slot for a Toggle. Inherits its size from the enclosing
 * `<Toggle>` via context; pass `size` to override. Always `aria-hidden` —
 * provide the toggle's accessible name via `aria-label` or a `Toggle.Label`.
 */
export const ToggleIcon = forwardRef<HTMLSpanElement, ToggleIconProps>(
  function ToggleIcon({ className, children, size, ...rest }, ref) {
    const ctx = useToggleItemContext('Toggle.Icon')
    const resolvedSize = size ?? ctx.size
    return (
      <span
        ref={ref}
        aria-hidden
        data-slot="icon"
        className={cx(iconSlotSizeClasses[resolvedSize], className)}
        {...rest}
      >
        {children}
      </span>
    )
  },
)
ToggleIcon.displayName = 'Toggle.Icon'
