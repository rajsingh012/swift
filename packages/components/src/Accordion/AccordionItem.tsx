import { forwardRef, useId, useMemo } from 'react'
import {
  AccordionItemContext,
  useAccordionRoot,
} from './Accordion.context'
import { cx, itemClasses } from './Accordion.styles'
import type { AccordionItemProps } from './Accordion.types'

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem(
    { value, disabled = false, className, children, ...rest },
    ref,
  ) {
    const root = useAccordionRoot('Accordion.Item')
    const reactId = useId()
    const triggerId = `accordion-trigger-${reactId}`
    const contentId = `accordion-content-${reactId}`

    const open = root.values.includes(value)
    const itemDisabled = root.disabled || disabled

    const itemCtx = useMemo(
      () => ({ value, open, disabled: itemDisabled, triggerId, contentId }),
      [value, open, itemDisabled, triggerId, contentId],
    )

    return (
      <AccordionItemContext.Provider value={itemCtx}>
        <div
          ref={ref}
          className={cx(itemClasses, className)}
          data-state={open ? 'open' : 'closed'}
          data-disabled={itemDisabled ? '' : undefined}
          {...rest}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    )
  },
)
AccordionItem.displayName = 'Accordion.Item'
