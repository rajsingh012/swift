import {
  forwardRef,
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { CSSPropertiesWithVars } from '../internal/types'
import { COLLISION_PADDING } from './DropdownMenu.constants'
import { useDropdownMenu } from './DropdownMenu.context'
import { contentClasses, cx } from './DropdownMenu.styles'
import type { DropdownMenuContentProps } from './DropdownMenu.types'
import {
  isTopOverlay,
  mergeRefs,
  pushOverlay,
  removeOverlay,
  useFloating,
  usePresence,
} from './DropdownMenu.utils'

/**
 * The menu surface — portaled, positioned by the floating engine, held through
 * its exit animation. Renders `role="menu"`, auto-focuses the first item on
 * open, and handles Arrow/Home/End/Escape/Tab plus outside-click dismissal via
 * the shared overlay stack.
 */
export const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(function DropdownMenuContent(props, ref) {
  const {
    forceMount = false,
    closeOnEscape = true,
    closeOnInteractOutside = true,
    initialFocusRef,
    onEscapeKeyDown,
    onInteractOutside,
    className,
    children,
    style,
    onKeyDown,
    ...rest
  } = props

  const {
    open,
    setOpen,
    contentId,
    triggerId,
    triggerRef,
    placement,
    offset,
    dir,
    focusItem,
    onTypeahead,
  } = useDropdownMenu('DropdownMenu.Content')

  const contentRef = useRef<HTMLDivElement | null>(null)
  const present = usePresence(open, contentRef)
  const shouldRender = present || forceMount

  const floating = useFloating(triggerRef, contentRef, undefined, {
    open: shouldRender,
    placement,
    offset,
    padding: COLLISION_PADDING,
    dir,
  })

  useEffect(() => {
    if (!open || !shouldRender) return
    pushOverlay(contentId)
    return () => removeOverlay(contentId)
  }, [open, shouldRender, contentId])

  // Focus the first item (or a provided ref) when the menu opens; restore to
  // the trigger on close.
  useEffect(() => {
    if (!shouldRender) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    requestAnimationFrame(() => {
      if (initialFocusRef?.current) initialFocusRef.current.focus()
      else focusItem(null, 'first')
    })
    return () => {
      const restore = triggerRef.current ?? previouslyFocused
      restore?.focus?.({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRender])

  // Escape + outside pointerdown (top menu only).
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

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const active = document.activeElement as HTMLElement | null
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        focusItem(active, 'next')
        break
      case 'ArrowUp':
        event.preventDefault()
        focusItem(active, 'prev')
        break
      case 'Home':
        event.preventDefault()
        focusItem(null, 'first')
        break
      case 'End':
        event.preventDefault()
        focusItem(null, 'last')
        break
      case 'Tab':
        // Tab closes the menu (focus returns to trigger via the effect cleanup).
        event.preventDefault()
        setOpen(false)
        break
      default:
        // Single printable character → typeahead.
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          onTypeahead(event.key)
        }
    }
  }

  if (!shouldRender) return null

  const positionStyle: CSSPropertiesWithVars = {
    position: 'fixed',
    top: floating.y,
    left: floating.x,
    visibility: floating.isPositioned && !floating.hidden ? 'visible' : 'hidden',
    pointerEvents: floating.hidden ? 'none' : undefined,
    ...style,
  }

  return (
    <div
      ref={mergeRefs(ref, contentRef)}
      id={contentId}
      role="menu"
      aria-labelledby={triggerId}
      aria-orientation="vertical"
      data-state={open ? 'open' : 'closed'}
      data-side={floating.side}
      data-align={floating.align}
      tabIndex={-1}
      style={positionStyle}
      className={cx(contentClasses, className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>
  )
})
DropdownMenuContent.displayName = 'DropdownMenu.Content'
