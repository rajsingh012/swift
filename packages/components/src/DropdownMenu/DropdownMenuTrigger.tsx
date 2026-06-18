import { forwardRef, type KeyboardEvent, type MouseEvent } from 'react'
import { Slot } from '../internal/Slot'
import { useDropdownMenu } from './DropdownMenu.context'
import type { DropdownMenuTriggerProps } from './DropdownMenu.types'
import { mergeRefs } from './DropdownMenu.utils'

export const DropdownMenuTrigger = forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(function DropdownMenuTrigger(
  { asChild = false, onClick, onKeyDown, type, ...rest },
  ref,
) {
  const { open, setOpen, contentId, triggerId, triggerRef } =
    useDropdownMenu('DropdownMenu.Trigger')

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) setOpen(!open)
  }

  // ArrowDown/Up opens the menu (focus moves to first/last item once open).
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
      if (!open) {
        event.preventDefault()
        setOpen(true)
      }
    }
  }

  const composedRef = mergeRefs<HTMLButtonElement>(ref, (node) => {
    triggerRef.current = node
  })

  const sharedProps = {
    id: triggerId,
    'aria-haspopup': 'menu' as const,
    'aria-expanded': open,
    'aria-controls': open ? contentId : undefined,
    'data-state': open ? 'open' : 'closed',
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  }

  if (asChild) {
    return <Slot ref={composedRef as never} {...sharedProps} {...rest} />
  }
  return <button ref={composedRef} type={type ?? 'button'} {...sharedProps} {...rest} />
})
DropdownMenuTrigger.displayName = 'DropdownMenu.Trigger'
