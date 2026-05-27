import { forwardRef, useRef } from 'react'
import { useSheet } from './Sheet.context'
import { overlayClasses } from './Sheet.styles'
import type { SheetOverlayProps } from './Sheet.types'
import { cx, mergeRefs, usePresence } from './Sheet.utils'

export const SheetOverlay = forwardRef<HTMLDivElement, SheetOverlayProps>(
  function SheetOverlay({ forceMount = false, className, ...rest }, ref) {
    const { open, modal } = useSheet('Sheet.Overlay')
    const nodeRef = useRef<HTMLDivElement | null>(null)
    const present = usePresence(open, nodeRef)

    // A scrim only makes sense in modal mode; non-modal leaves the page live.
    if (!modal) return null
    if (!present && !forceMount) return null

    return (
      <div
        ref={mergeRefs(ref, nodeRef)}
        aria-hidden="true"
        data-state={open ? 'open' : 'closed'}
        className={cx(overlayClasses, className)}
        {...rest}
      />
    )
  },
)
SheetOverlay.displayName = 'Sheet.Overlay'
