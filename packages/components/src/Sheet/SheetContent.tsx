import {
  forwardRef,
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { useSheet } from './Sheet.context'
import { contentBaseClasses, sideClasses } from './Sheet.styles'
import type { SheetContentProps } from './Sheet.types'
import {
  cx,
  getFocusable,
  isTopOverlay,
  mergeRefs,
  pushOverlay,
  removeOverlay,
  useInertBackground,
  usePresence,
  useScrollLock,
} from './Sheet.utils'

export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(
  function SheetContent(props, ref) {
    const {
      side = 'right',
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
    } = useSheet('Sheet.Content')

    const contentRef = useRef<HTMLDivElement | null>(null)
    const present = usePresence(open, contentRef)
    const shouldRender = present || forceMount

    useScrollLock(modal && open && shouldRender)
    useInertBackground(modal && open && shouldRender, contentRef)

    // Track the open stack so only the top-most sheet handles Esc / outside.
    useEffect(() => {
      if (!open || !shouldRender) return
      pushOverlay(contentId)
      return () => removeOverlay(contentId)
    }, [open, shouldRender, contentId])

    // Auto-focus on open; restore focus to the trigger on close.
    useEffect(() => {
      if (!shouldRender) return
      const node = contentRef.current
      const previouslyFocused = document.activeElement as HTMLElement | null

      const openEvent = new Event('sheet.openAutoFocus', { cancelable: true })
      onOpenAutoFocus?.(openEvent)
      if (!openEvent.defaultPrevented && node) {
        const target = initialFocusRef?.current ?? getFocusable(node)[0] ?? node
        requestAnimationFrame(() => target.focus({ preventScroll: true }))
      }

      return () => {
        const closeEvent = new Event('sheet.closeAutoFocus', {
          cancelable: true,
        })
        onCloseAutoFocus?.(closeEvent)
        if (!closeEvent.defaultPrevented) {
          const restore = triggerRef.current ?? previouslyFocused
          restore?.focus?.({ preventScroll: true })
        }
      }
      // Runs once per mount/unmount of the rendered content.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldRender])

    // Escape + pointer-down-outside dismissal (top sheet only).
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

    // Tab focus trap — modal only; non-modal lets focus reach the page.
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

    return (
      <div
        ref={mergeRefs(ref, contentRef)}
        id={contentId}
        role="dialog"
        aria-modal={modal || undefined}
        aria-labelledby={hasTitle ? titleId : undefined}
        aria-describedby={hasDescription ? descriptionId : undefined}
        data-state={open ? 'open' : 'closed'}
        data-side={side}
        data-size={size}
        tabIndex={-1}
        className={cx(contentBaseClasses, sideClasses[side], className)}
        onKeyDown={handleKeyDownTrap}
        {...rest}
      >
        {children}
      </div>
    )
  },
)
SheetContent.displayName = 'Sheet.Content'
