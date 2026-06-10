import { forwardRef } from 'react'
import { mergeRefs } from '../internal/refs'
import { useTooltipContext } from './Tooltip.context'
import { arrowClasses, cx } from './Tooltip.styles'
import type { TooltipArrowProps } from './Tooltip.types'

/**
 * Decorative arrow pointing at the trigger. Purely visual — a rotated
 * square reading `--tooltip-arrow-x/y` (set on the Content by the engine)
 * and `data-side` for which edge to sit on. Registers its node on the
 * context so the engine can measure the live arrow size.
 */
export const TooltipArrow = forwardRef<HTMLSpanElement, TooltipArrowProps>(
  function TooltipArrow({ className, ...rest }, ref) {
    const { arrowRef } = useTooltipContext('Tooltip.Arrow')
    return (
      <span
        ref={mergeRefs(ref, arrowRef)}
        aria-hidden="true"
        role="presentation"
        className={cx(arrowClasses, className)}
        {...rest}
      />
    )
  },
)
TooltipArrow.displayName = 'Tooltip.Arrow'
