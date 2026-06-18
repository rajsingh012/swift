import { forwardRef, type MouseEvent, type ReactNode } from 'react'
import { Slot } from '../internal/Slot'
import { useCollapsible } from './Collapsible.context'
import { cx, triggerClasses } from './Collapsible.styles'
import type { CollapsibleTriggerProps } from './Collapsible.types'

export const CollapsibleTrigger = forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(function CollapsibleTrigger(
  { asChild = false, onClick, className, children, type, ...rest },
  ref,
) {
  const { open, disabled, toggle, contentId, triggerId } =
    useCollapsible('Collapsible.Trigger')

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) toggle()
  }

  const sharedProps = {
    id: triggerId,
    'aria-expanded': open,
    'aria-controls': contentId,
    'data-state': open ? 'open' : 'closed',
    'data-disabled': disabled ? '' : undefined,
    onClick: handleClick,
  }

  const resolvedChildren =
    typeof children === 'function' ? children({ open }) : children

  if (asChild) {
    return (
      <Slot
        ref={ref as never}
        className={className}
        {...sharedProps}
        {...rest}
      >
        {resolvedChildren as ReactNode}
      </Slot>
    )
  }

  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      disabled={disabled}
      className={cx(triggerClasses, className)}
      {...sharedProps}
      {...rest}
    >
      {resolvedChildren}
    </button>
  )
})
CollapsibleTrigger.displayName = 'Collapsible.Trigger'
