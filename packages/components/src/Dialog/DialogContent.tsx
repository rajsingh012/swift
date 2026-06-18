import {
  forwardRef,
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { useDialog } from './Dialog.context'
import {
  contentBaseClasses,
  cx,
  sizeClasses,
  viewportClasses,
} from './Dialog.styles'
import type { DialogContentProps } from './Dialog.types'
import {
  getFocusable,
  isTopOverlay,
  mergeRefs,
  pushOverlay,
  removeOverlay,
  useInertBackground,
  usePresence,
  useScrollLock,
} from './Dialog.utils'

/**
 * The dialog panel — centered in the viewport. Wraps itself in a fixed
 * flex viewport that handles centering and overflow scrolling for tall
 * panels, then renders the panel inside. Manages focus (auto-focus on open,
 * restore on close, Tab trap when modal) and dismissal (Escape /
 * outside-pointerdown) via the shared overlay stack — the same machinery as
 * Sheet, just centered rather than edge-anchored.
 */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(props, ref) {
    const {
      size = 'md',
      forceMount = false,
      closeOnEscape = true,
      closeOnInteractOutside = true,
      initialFocusRef,
      onEscapeKeyDown,
      onInteractOutside,
      onOpenAutoFocus,
      onCloseAutoFocus,
      className,
      children,
      onKeyDown,
      ...rest
    } = props

    const {
      open,
      setOpen,
      modal,
      contentId,
      titleId,
      descriptionId,
      hasTitle,
      hasDescription,
      triggerRef,
    } = useDialog('Dialog.Content')

    const contentRef = useRef<HTMLDivElement | null>(null)
    const present = usePresence(open, contentRef)
    const shouldRender = present || forceMount

    useScrollLock(modal && open && shouldRender)
    useInertBackground(modal && open && shouldRender, contentRef)

    useEffect(() => {
      if (!open || !shouldRender) return
      pushOverlay(contentId)
      return () => removeOverlay(contentId)
    }, [open, shouldRender, contentId])

    // Auto-focus on open; restore to trigger on close.
    useEffect(() => {
      if (!shouldRender) return
      const node = contentRef.current
      const previouslyFocused = document.activeElement as HTMLElement | null

      const openEvent = new Event('dialog.openAutoFocus', { cancelable: true })
      onOpenAutoFocus?.(openEvent)
      if (!openEvent.defaultPrevented && node) {
        const target = initialFocusRef?.current ?? getFocusable(node)[0] ?? node
        requestAnimationFrame(() => target.focus({ preventScroll: true }))
      }

      return () => {
        const closeEvent = new Event('dialog.closeAutoFocus', { cancelable: true })
        onCloseAutoFocus?.(closeEvent)
        if (!closeEvent.defaultPrevented) {
          const restore = triggerRef.current ?? previouslyFocused
          restore?.focus?.({ preventScroll: true })
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldRender])

    // Escape + outside pointerdown dismissal (top dialog only).
    useEffect(() => {
      if (!open || !shouldRender) return

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || !isTopOverlay(contentId)) return
        onEscapeKeyDown?.(event)
        if (!event.defaultPrevented && closeOnEscape) setOpen(false)
      }
      const handlePointerDown = (event: PointerEvent) => {
        if (!isTopOverlay(contentId)) return
        const node = contentRef.current
        const target = event.target as Node | null
        if (!node || !target || node.contains(target)) return
        if (triggerRef.current?.contains(target)) return
        onInteractOutside?.(event)
        if (!event.defaultPrevented && closeOnInteractOutside) setOpen(false)
      }

      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('pointerdown', handlePointerDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('pointerdown', handlePointerDown)
      }
    }, [
      open,
      shouldRender,
      contentId,
      closeOnEscape,
      closeOnInteractOutside,
      setOpen,
      onEscapeKeyDown,
      onInteractOutside,
      triggerRef,
    ])

    const handleKeyDownTrap = (event: ReactKeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || !modal || event.key !== 'Tab') return
      const node = contentRef.current
      if (!node) return
      const focusables = getFocusable(node)
      if (focusables.length === 0) {
        event.preventDefault()
        node.focus()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    if (!shouldRender) return null

    const panel = (
      <div
        ref={mergeRefs(ref, contentRef)}
        id={contentId}
        role="dialog"
        aria-modal={modal || undefined}
        aria-labelledby={hasTitle ? titleId : undefined}
        aria-describedby={hasDescription ? descriptionId : undefined}
        data-state={open ? 'open' : 'closed'}
        data-size={size}
        tabIndex={-1}
        className={cx(contentBaseClasses, sizeClasses[size], className)}
        onKeyDown={handleKeyDownTrap}
        {...rest}
      >
        {children}
      </div>
    )

    // A fixed, pointer-events-none viewport centres the panel and scrolls when
    // the panel is taller than the screen. In modal mode it sits above the
    // scrim that <Dialog.Overlay> renders; in non-modal mode clicks fall
    // through everywhere except the panel itself.
    return (
      <div className={viewportClasses} data-dialog-viewport="">
        {panel}
      </div>
    )
  },
)
DialogContent.displayName = 'Dialog.Content'
