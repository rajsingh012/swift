import { forwardRef, type MouseEvent } from 'react'
import { Slot } from '../internal/Slot'
import { usePopover } from './Popover.context'
import type { PopoverTriggerProps } from './Popover.types'
import { mergeRefs } from './Popover.utils'

export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger({ asChild = false, onClick, type, ...rest }, ref) {
    const { open, setOpen, contentId, triggerId, triggerRef } =
      usePopover('Popover.Trigger')

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented) setOpen(!open)
    }

    const composedRef = mergeRefs<HTMLButtonElement>(ref, (node) => {
      triggerRef.current = node
    })

    const sharedProps = {
      id: triggerId,
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': open,
      'aria-controls': open ? contentId : undefined,
      'data-state': open ? 'open' : 'closed',
      onClick: handleClick,
    }

    if (asChild) {
      return <Slot ref={composedRef as never} {...sharedProps} {...rest} />
    }

    return (
      <button ref={composedRef} type={type ?? 'button'} {...sharedProps} {...rest} />
    )
  },
)
PopoverTrigger.displayName = 'Popover.Trigger'
