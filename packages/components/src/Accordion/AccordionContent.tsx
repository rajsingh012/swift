import { forwardRef } from 'react'
import { useAccordionItem } from './Accordion.context'
import { contentClasses, contentInnerClasses, cx } from './Accordion.styles'
import type { AccordionContentProps } from './Accordion.types'

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent({ className, children, ...rest }, ref) {
    const item = useAccordionItem('Accordion.Content')
    const state = item.open ? 'open' : 'closed'

    return (
      <div
        ref={ref}
        id={item.contentId}
        role="region"
        aria-labelledby={item.triggerId}
        aria-hidden={!item.open || undefined}
        data-state={state}
        data-disabled={item.disabled ? '' : undefined}
        className={cx(contentClasses, className)}
        {...rest}
      >
        <div className={contentInnerClasses}>{children}</div>
      </div>
    )
  },
)
AccordionContent.displayName = 'Accordion.Content'
