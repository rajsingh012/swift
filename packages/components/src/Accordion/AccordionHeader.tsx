import { createElement, forwardRef, type ElementType } from 'react'
import { useAccordionItem } from './Accordion.context'
import { cx, headerClasses } from './Accordion.styles'
import type { AccordionHeaderProps } from './Accordion.types'

export const AccordionHeader = forwardRef<HTMLElement, AccordionHeaderProps>(
  function AccordionHeader({ as, className, children, ...rest }, ref) {
    const item = useAccordionItem('Accordion.Header')
    const Tag: ElementType = as ?? 'h3'

    return createElement(
      Tag,
      {
        ref,
        className: cx(headerClasses, className),
        'data-state': item.open ? 'open' : 'closed',
        'data-disabled': item.disabled ? '' : undefined,
        ...rest,
      },
      children,
    )
  },
)
AccordionHeader.displayName = 'Accordion.Header'
