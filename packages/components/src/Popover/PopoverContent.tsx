import {
  forwardRef,
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { CSSPropertiesWithVars } from '../internal/types'
import { ARROW_SIZE, COLLISION_PADDING } from './Popover.constants'
import { usePopover } from './Popover.context'
import { contentClasses, cx } from './Popover.styles'
import type { PopoverContentProps } from './Popover.types'
import {
  getFocusable,
  isTopOverlay,
  mergeRefs,
  pushOverlay,
  removeOverlay,
  useFloating,
  useInertBackground,
  usePresence,
  useScrollLock,
} from './Popover.utils'

/**
 * The popover surface — portaled, positioned by the shared floating engine
 * (flip + shift + arrow), held through its exit animation via `usePresence`.
 * Unlike a tooltip it manages focus: auto-focuses on open, restores to the
 * trigger on close, traps Tab when `modal`, and dismisses on Escape /
 * outside-pointerdown via the shared overlay stack.
 */
export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(props, ref) {
    const {
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
      style,
      onKeyDown,
      ...rest
    } = props

    const {
      open,
      setOpen,
      modal,
      contentId,
      triggerId,
      triggerRef,
      anchorRef,
      arrowRef,
      placement,
      offset,
      dir,
    } = usePopover('Popover.Content')

    const contentRef = useRef<HTMLDivElement | null>(null)
    const present = usePresence(open, contentRef)
    const shouldRender = present || forceMount

    // Position against the explicit anchor if one was set, else the trigger.
    const positionRef = anchorRef.current ? anchorRef : triggerRef

    const floating = useFloating(positionRef, contentRef, arrowRef, {
      open: shouldRender,
      placement,
      offset,
      padding: COLLISION_PADDING,
      dir,
      arrowSize: ARROW_SIZE,
      arrowPadding: 6,
    })

    useScrollLock(modal && open && shouldRender)
    useInertBackground(modal && open && shouldRender, contentRef)

    // Overlay stack — only the top popover reacts to Escape / outside-click.
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

      const openEvent = new Event('popover.openAutoFocus', { cancelable: true })
      onOpenAutoFocus?.(openEvent)
      if (!openEvent.defaultPrevented && node) {
        const target = initialFocusRef?.current ?? getFocusable(node)[0] ?? node
        requestAnimationFrame(() => target.focus({ preventScroll: true }))
      }

      return () => {
        const closeEvent = new Event('popover.closeAutoFocus', { cancelable: true })
        onCloseAutoFocus?.(closeEvent)
        if (!closeEvent.defaultPrevented) {
          const restore = triggerRef.current ?? previouslyFocused
          restore?.focus?.({ preventScroll: true })
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldRender])

    // Escape + outside pointerdown dismissal (top popover only).
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
        if (triggerRef.current?.contains(target)) return // trigger toggles itself
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

    // Tab focus trap — modal only.
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

    const positionStyle: CSSPropertiesWithVars = {
      position: 'fixed',
      top: floating.y,
      left: floating.x,
      visibility: floating.isPositioned && !floating.hidden ? 'visible' : 'hidden',
      pointerEvents: floating.hidden ? 'none' : undefined,
      '--popover-offset': `${offset}px`,
      '--popover-arrow-x': floating.arrowX != null ? `${floating.arrowX}px` : undefined,
      '--popover-arrow-y': floating.arrowY != null ? `${floating.arrowY}px` : undefined,
      ...style,
    }

    return (
      <div
        ref={mergeRefs(ref, contentRef)}
        id={contentId}
        role="dialog"
        aria-modal={modal || undefined}
        aria-labelledby={triggerId}
        data-state={open ? 'open' : 'closed'}
        data-side={floating.side}
        data-align={floating.align}
        tabIndex={-1}
        style={positionStyle}
        className={cx(contentClasses, className)}
        onKeyDown={handleKeyDownTrap}
        {...rest}
      >
        {children}
      </div>
    )
  },
)
PopoverContent.displayName = 'Popover.Content'
