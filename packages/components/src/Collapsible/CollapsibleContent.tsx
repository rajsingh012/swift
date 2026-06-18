import { forwardRef } from 'react'
import { useCollapsible } from './Collapsible.context'
import {
  contentClasses,
  contentInnerClasses,
  cx,
} from './Collapsible.styles'
import type { CollapsibleContentProps } from './Collapsible.types'

/**
 * The collapsible region. Animates open/closed via the grid-rows 0fr↔1fr
 * height trick in theme/collapsible.css — identical to Accordion. The node
 * stays mounted across toggles (the CSS transition needs both states present
 * to animate), with `data-state` driving the height. Content is hidden from
 * assistive tech + tab order while closed.
 */
export const CollapsibleContent = forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(function CollapsibleContent({ forceMount: _forceMount, className, children, ...rest }, ref) {
  const { open, contentId, triggerId, disabled } =
    useCollapsible('Collapsible.Content')

  return (
    <div
      ref={ref}
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      aria-hidden={!open || undefined}
      data-state={open ? 'open' : 'closed'}
      data-disabled={disabled ? '' : undefined}
      className={cx(contentClasses, className)}
      {...rest}
    >
      <div className={contentInnerClasses}>{children}</div>
    </div>
  )
})
CollapsibleContent.displayName = 'Collapsible.Content'
