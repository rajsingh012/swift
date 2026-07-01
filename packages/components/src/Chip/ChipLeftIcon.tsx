import { forwardRef, type HTMLAttributes } from 'react'
import { useChipContext } from './Chip.context'
import { cx, iconSizeClasses } from './Chip.styles'
import type { ChipSize } from './Chip.types'

export interface ChipLeftIconProps extends HTMLAttributes<HTMLSpanElement> {
  /** Override the icon size cascaded from the enclosing `<Chip>`. */
  size?: ChipSize
}

/**
 * Decorative icon rendered before the label. Inherits its size from the
 * enclosing `<Chip>` via context; pass `size` to override. Always
 * `aria-hidden` — the chip's text provides the accessible name.
 */
export const ChipLeftIcon = forwardRef<HTMLSpanElement, ChipLeftIconProps>(
  function ChipLeftIcon({ className, children, size, ...rest }, ref) {
    const ctx = useChipContext('Chip.LeftIcon')
    const resolvedSize = size ?? ctx.size
    return (
      <span
        ref={ref}
        aria-hidden
        data-slot="left-icon"
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
ChipLeftIcon.displayName = 'Chip.LeftIcon'
