import { forwardRef } from 'react'
import { usePopover } from './Popover.context'
import { arrowClasses, cx } from './Popover.styles'
import type { PopoverArrowProps } from './Popover.types'
import { mergeRefs } from './Popover.utils'

/**
 * Decorative arrow pointing at the trigger. Registers its node on the context
 * so the floating engine can measure its live size.
 */
export const PopoverArrow = forwardRef<HTMLSpanElement, PopoverArrowProps>(
  function PopoverArrow({ className, ...rest }, ref) {
    const { arrowRef } = usePopover('Popover.Arrow')
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
PopoverArrow.displayName = 'Popover.Arrow'
