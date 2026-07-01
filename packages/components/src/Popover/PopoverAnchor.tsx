import { forwardRef } from 'react'
import { Slot } from '../internal/Slot'
import { usePopover } from './Popover.context'
import type { PopoverAnchorProps } from './Popover.types'
import { mergeRefs } from './Popover.utils'

/**
 * Optional positioning anchor. When present, the content positions against
 * this element instead of the trigger — useful when the visual trigger and
 * the anchor point differ (e.g. a toolbar button opening a panel anchored to
 * a selection). Defaults to a `<div>` wrapper; pass `asChild` to anchor an
 * existing element.
 */
export const PopoverAnchor = forwardRef<HTMLDivElement, PopoverAnchorProps>(
  function PopoverAnchor({ asChild = false, children, ...rest }, ref) {
    const { anchorRef } = usePopover('Popover.Anchor')
    const composedRef = mergeRefs<HTMLElement>(ref as never, (node) => {
      anchorRef.current = node
    })

    if (asChild) {
      return (
        <Slot ref={composedRef as never} {...rest}>
          {children}
        </Slot>
      )
    }
    return (
      <div ref={composedRef as never} {...rest}>
        {children}
      </div>
    )
  },
)
PopoverAnchor.displayName = 'Popover.Anchor'
