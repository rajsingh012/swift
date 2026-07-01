import { forwardRef, type MouseEvent } from 'react'
import { Slot } from '../internal/Slot'
import { useDialog } from './Dialog.context'
import type { DialogTriggerProps } from './Dialog.types'
import { mergeRefs } from './Dialog.utils'

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  function DialogTrigger({ asChild = false, onClick, type, ...rest }, ref) {
    const { open, setOpen, contentId, triggerRef } = useDialog('Dialog.Trigger')

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented) setOpen(true)
    }

    const composedRef = mergeRefs<HTMLButtonElement>(ref, (node) => {
      triggerRef.current = node
    })

    const sharedProps = {
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': open,
      'aria-controls': open ? contentId : undefined,
      'data-state': open ? 'open' : 'closed',
      onClick: handleClick,
    }

    if (asChild) {
      return <Slot ref={composedRef as never} {...sharedProps} {...rest} />
    }
    return <button ref={composedRef} type={type ?? 'button'} {...sharedProps} {...rest} />
  },
)
DialogTrigger.displayName = 'Dialog.Trigger'
