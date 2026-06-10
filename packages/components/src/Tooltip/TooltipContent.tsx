import {
  forwardRef,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { mergeRefs } from '../internal/refs'
import { usePresence, isTopOverlay, pushOverlay, removeOverlay } from '../internal/overlay'
import { useFloating } from '../internal/floating'
import type { CSSPropertiesWithVars } from '../internal/types'
import { ARROW_SIZE, COLLISION_PADDING } from './Tooltip.constants'
import { useTooltipContext } from './Tooltip.context'
import { contentClasses, cx } from './Tooltip.styles'
import type { TooltipContentProps } from './Tooltip.types'

/**
 * The tooltip surface. Portaled, positioned by the shared floating engine
 * (flip + shift + arrow), and held in the DOM through its exit animation
 * via `usePresence`. Unlike a dialog it never traps focus or autofocuses.
 * Dismiss behaviour scales with the trigger: interactive hover tooltips keep
 * themselves open while hovered and close on Escape; click-triggered
 * tooltips also close on outside pointerdown. Both join the shared overlay
 * stack, so Escape dismisses one layer at a time when nested in a Sheet.
 */
export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(props, ref) {
    const {
      variant = 'default',
      forceMount = false,
      closeOnEscape = true,
      onEscapeKeyDown,
      classes,
      className,
      children,
      style,
      ...rest
    } = props

    const {
      open,
      contentId,
      triggerRef,
      arrowRef,
      isPointerInside,
      cancelScheduled,
      scheduleClose,
      closeImmediate,
      placement,
      offset,
      dir,
      interactive,
      clickEnabled,
    } = useTooltipContext('Tooltip.Content')

    // Joins the overlay stack (Escape / outside-click ordering) when there's
    // something to keyboard-dismiss: interactive hover tooltips and any
    // click-triggered tooltip.
    const dismissible = interactive || clickEnabled

    const contentRef = useRef<HTMLDivElement | null>(null)
    const present = usePresence(open, contentRef)
    const shouldRender = present || forceMount

    const floating = useFloating(triggerRef, contentRef, arrowRef, {
      open: shouldRender,
      placement,
      offset,
      padding: COLLISION_PADDING,
      dir,
      arrowSize: ARROW_SIZE,
      arrowPadding: 4,
    })

    // ── Escape + overlay stack — dismissible tooltips only ──
    // Plain hover tooltips aren't focusable and have nothing to dismiss with
    // the keyboard, so they never touch the stack (and never steal Escape
    // from an enclosing Sheet/Dialog).
    useEffect(() => {
      if (!dismissible || !open || !shouldRender) return
      pushOverlay(contentId)
      return () => removeOverlay(contentId)
    }, [dismissible, open, shouldRender, contentId])

    useEffect(() => {
      if (!dismissible || !open || !shouldRender) return
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || !isTopOverlay(contentId)) return
        onEscapeKeyDown?.(event)
        if (!event.defaultPrevented && closeOnEscape) closeImmediate()
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [
      dismissible,
      open,
      shouldRender,
      contentId,
      closeOnEscape,
      onEscapeKeyDown,
      closeImmediate,
    ])

    // ── Outside pointerdown closes a click-triggered tooltip ──
    useEffect(() => {
      if (!clickEnabled || !open || !shouldRender) return
      const handlePointerDown = (event: PointerEvent) => {
        if (!isTopOverlay(contentId)) return
        const target = event.target as Node | null
        const node = contentRef.current
        if (!node || !target) return
        if (node.contains(target)) return
        if (triggerRef.current?.contains(target)) return // trigger toggles itself
        closeImmediate()
      }
      document.addEventListener('pointerdown', handlePointerDown)
      return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [clickEnabled, open, shouldRender, contentId, triggerRef, closeImmediate])

    // ── Close when the window/tab loses focus (alt-tab, devtools, etc.) ──
    useEffect(() => {
      if (!open || !shouldRender) return
      const handleBlur = () => closeImmediate()
      const handleVisibility = () => {
        if (document.visibilityState === 'hidden') closeImmediate()
      }
      window.addEventListener('blur', handleBlur)
      document.addEventListener('visibilitychange', handleVisibility)
      return () => {
        window.removeEventListener('blur', handleBlur)
        document.removeEventListener('visibilitychange', handleVisibility)
      }
    }, [open, shouldRender, closeImmediate])

    if (!shouldRender) return null

    // ── Interactive hover bridge: staying over the content (or the CSS
    //    bridge spanning the gap) cancels the pending close. ──
    const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
      rest.onPointerEnter?.(event)
      if (!interactive) return
      isPointerInside.current = true
      cancelScheduled()
    }
    const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
      rest.onPointerLeave?.(event)
      if (!interactive) return
      isPointerInside.current = false
      scheduleClose()
    }

    const positionStyle: CSSPropertiesWithVars = {
      position: 'fixed',
      top: floating.y,
      left: floating.x,
      // Hide until the first measurement lands (no flash at (0,0)), and hide
      // again if the trigger scrolls out of view so a pinned tooltip doesn't
      // cling to the viewport edge.
      visibility: floating.isPositioned && !floating.hidden ? 'visible' : 'hidden',
      // Don't capture clicks while hidden.
      pointerEvents: floating.hidden ? 'none' : undefined,
      '--tooltip-offset': `${offset}px`,
      '--tooltip-arrow-x': floating.arrowX != null ? `${floating.arrowX}px` : undefined,
      '--tooltip-arrow-y': floating.arrowY != null ? `${floating.arrowY}px` : undefined,
      ...style,
    }

    return (
      <div
        ref={mergeRefs(ref, contentRef)}
        id={contentId}
        role="tooltip"
        data-state={open ? 'open' : 'closed'}
        data-variant={variant}
        data-side={floating.side}
        data-align={floating.align}
        data-interactive={interactive ? '' : undefined}
        data-clickable={clickEnabled ? '' : undefined}
        style={positionStyle}
        className={cx(contentClasses, className, classes?.content)}
        {...rest}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {children}
      </div>
    )
  },
)
TooltipContent.displayName = 'Tooltip.Content'
