import { forwardRef, useRef } from 'react'
import { useDialog } from './Dialog.context'
import { cx, overlayClasses } from './Dialog.styles'
import type { DialogOverlayProps } from './Dialog.types'
import { mergeRefs, usePresence } from './Dialog.utils'

/**
 * The scrim behind the dialog. Modal only — non-modal dialogs leave the page
 * live and render no overlay. Kept mounted through its exit animation.
 */
export const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(
  function DialogOverlay({ forceMount = false, className, ...rest }, ref) {
    const { open, modal } = useDialog('Dialog.Overlay')
    const nodeRef = useRef<HTMLDivElement | null>(null)
    const present = usePresence(open, nodeRef)

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
DialogOverlay.displayName = 'Dialog.Overlay'
