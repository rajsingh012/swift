import { forwardRef, type MouseEvent } from 'react'
import { Close } from '@swift/icons/Close'
import { useTooltipContext } from './Tooltip.context'
import { closeClasses, cx } from './Tooltip.styles'
import type { TooltipCloseProps } from './Tooltip.types'

/**
 * Dismiss button for click / interactive tooltips. Renders a small × by
 * default; pass children to override. Closes the tooltip on click unless
 * the handler calls `preventDefault()`.
 */
export const TooltipClose = forwardRef<HTMLButtonElement, TooltipCloseProps>(
  function TooltipClose(
    { className, children, onClick, 'aria-label': ariaLabel = 'Close', ...rest },
    ref,
  ) {
    const { closeImmediate } = useTooltipContext('Tooltip.Close')

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented) closeImmediate()
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel}
        onClick={handleClick}
        className={cx(closeClasses, className)}
        {...rest}
      >
        {children ?? <Close size={14} />}
      </button>
    )
  },
)
TooltipClose.displayName = 'Tooltip.Close'
