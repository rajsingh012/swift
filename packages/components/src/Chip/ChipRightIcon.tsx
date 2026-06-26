import { forwardRef, type HTMLAttributes } from 'react'
import { useChipContext } from './Chip.context'
import { cx, iconSizeClasses } from './Chip.styles'
import type { ChipSize } from './Chip.types'

export interface ChipRightIconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Override the icon size cascaded from the enclosing `<Chip>`. */
  size?: ChipSize
}

/**
 * Decorative icon rendered after the label. Inherits its size from the
 * enclosing `<Chip>` via context; pass `size` to override. Always
 * `aria-hidden` — the chip's text provides the accessible name.
 */
export const ChipRightIcon = forwardRef<HTMLSpanElement, ChipRightIconProps>(
  function ChipRightIcon({ className, children, size, ...rest }, ref) {
    const ctx = useChipContext('Chip.RightIcon')
    const resolvedSize = size ?? ctx.size
    return (
      <span
        ref={ref}
        aria-hidden
        data-slot="right-icon"
        className={cx(
          'inline-flex shrink-0 items-center justify-center',
          iconSizeClasses[resolvedSize],
          className,
        )}
        {...rest}
      >
        {children}
      </span>
    )
  },
)
ChipRightIcon.displayName = 'Chip.RightIcon'
