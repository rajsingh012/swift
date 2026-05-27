import { forwardRef, type MouseEvent } from 'react'
import { Slot } from '../internal/Slot'
import { useSheet } from './Sheet.context'
import type { SheetTriggerProps } from './Sheet.types'
import { mergeRefs } from './Sheet.utils'

export const SheetTrigger = forwardRef<HTMLButtonElement, SheetTriggerProps>(
  function SheetTrigger({ asChild = false, onClick, type, ...rest }, ref) {
    const { open, setOpen, contentId, triggerRef } = useSheet('Sheet.Trigger')

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented) setOpen(true)
    }

    const composedRef = mergeRefs<HTMLButtonElement>(ref, (node) => {
      triggerRef.current = node
    })

    const state = open ? 'open' : 'closed'

    if (asChild) {
      return (
        <Slot
          ref={composedRef as never}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? contentId : undefined}
          data-state={state}
          onClick={handleClick as never}
          {...rest}
        />
      )
    }

    return (
      <button
        ref={composedRef}
        type={type ?? 'button'}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        data-state={state}
        onClick={handleClick}
        {...rest}
      />
    )
  },
)
SheetTrigger.displayName = 'Sheet.Trigger'
