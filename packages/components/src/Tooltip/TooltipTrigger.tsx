import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Slot } from '../internal/Slot'
import { mergeRefs } from '../internal/refs'
import {
  TOUCH_LONG_PRESS_MS,
  TOUCH_MOVE_THRESHOLD,
} from './Tooltip.constants'
import { useTooltipContext } from './Tooltip.context'
import { cx, triggerClasses } from './Tooltip.styles'
import type { TooltipTriggerProps } from './Tooltip.types'

/**
 * The element that opens the tooltip on hover / keyboard-focus / touch
 * long-press. `asChild` defaults to **true** — a tooltip almost always
 * decorates an existing element, and a wrapper would disrupt layout. With
 * `asChild={false}` it renders an inline `<span>` wrapper, which is also
 * the recommended pattern for **disabled controls**: native disabled
 * buttons emit no pointer/focus events, so wrap them
 *
 *     <Tooltip.Trigger asChild={false}>
 *       <button disabled style={{ pointerEvents: 'none' }}>Save</button>
 *     </Tooltip.Trigger>
 *
 * and the wrapper span receives the events the disabled button cannot.
 */
export const TooltipTrigger = forwardRef<HTMLElement, TooltipTriggerProps>(
  function TooltipTrigger(props, ref) {
    const {
      asChild = true,
      className,
      children,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onFocus,
      onBlur,
      onContextMenu,
      onClick,
      ...rest
    } = props

    const {
      open,
      contentId,
      triggerRef,
      isPointerInside,
      scheduleOpen,
      scheduleClose,
      openImmediate,
      closeImmediate,
      toggle,
      disableTouch,
      disabled,
      hoverEnabled,
      clickEnabled,
    } = useTooltipContext('Tooltip.Trigger')

    const [pressing, setPressing] = useState(false)

    // Touch long-press bookkeeping.
    const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const longPressFired = useRef(false)
    const touchStart = useRef<{ x: number; y: number } | null>(null)

    const clearLongPress = useCallback(() => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
      touchStart.current = null
      setPressing(false)
    }, [])

    // ── Hover (mouse/pen only — touch handled below) ──
    const handlePointerEnter = (event: ReactPointerEvent<HTMLElement>) => {
      onPointerEnter?.(event)
      if (!hoverEnabled || event.pointerType === 'touch') return
      isPointerInside.current = true
      scheduleOpen()
    }

    const handlePointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
      onPointerLeave?.(event)
      if (!hoverEnabled || event.pointerType === 'touch') return
      isPointerInside.current = false
      // For interactive tooltips the content's own pointerenter cancels
      // this; the closeDelay grace covers the gap traverse either way.
      // A click-pinned tooltip ignores this in the root.
      scheduleClose()
    }

    // ── Keyboard focus (focus-visible only — a mouse click shouldn't pop) ──
    const handleFocus = (event: FocusEvent<HTMLElement>) => {
      onFocus?.(event)
      if (!hoverEnabled) return
      const target = event.target as HTMLElement
      if (typeof target.matches === 'function' && !target.matches(':focus-visible')) {
        return
      }
      openImmediate()
    }

    const handleBlur = (event: FocusEvent<HTMLElement>) => {
      onBlur?.(event)
      // Don't let blur close a click-pinned tooltip (root guards this too);
      // in hover mode blur dismisses as usual.
      if (!hoverEnabled) return
      closeImmediate()
    }

    // ── Click toggle ──
    const handleClick = (event: ReactMouseEvent<HTMLElement>) => {
      onClick?.(event)
      if (!clickEnabled || disabled || event.defaultPrevented) return
      toggle()
    }

    // ── Touch long-press ──
    const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
      onPointerDown?.(event)
      // Long-press is the touch equivalent of hover. In click-only mode a
      // tap already toggles via onClick, so skip it there.
      if (!hoverEnabled || disableTouch || event.pointerType !== 'touch' || disabled)
        return
      longPressFired.current = false
      touchStart.current = { x: event.clientX, y: event.clientY }
      setPressing(true)

      const cancelOnScroll = () => clearLongPress()
      window.addEventListener('scroll', cancelOnScroll, {
        capture: true,
        once: true,
      })

      longPressTimer.current = setTimeout(() => {
        longPressTimer.current = null
        longPressFired.current = true
        window.removeEventListener('scroll', cancelOnScroll, { capture: true })
        // Suppress the synthetic click that follows the press.
        window.addEventListener(
          'click',
          (e) => {
            e.preventDefault()
            e.stopPropagation()
          },
          { capture: true, once: true },
        )
        openImmediate()
      }, TOUCH_LONG_PRESS_MS)
    }

    const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
      onPointerMove?.(event)
      if (event.pointerType !== 'touch' || !touchStart.current) return
      const dx = event.clientX - touchStart.current.x
      const dy = event.clientY - touchStart.current.y
      if (Math.hypot(dx, dy) > TOUCH_MOVE_THRESHOLD) clearLongPress()
    }

    const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
      onPointerUp?.(event)
      if (event.pointerType !== 'touch') return
      clearLongPress()
    }

    const handlePointerCancel = (event: ReactPointerEvent<HTMLElement>) => {
      onPointerCancel?.(event)
      clearLongPress()
    }

    const handleContextMenu = (event: React.MouseEvent<HTMLElement>) => {
      onContextMenu?.(event)
      if (longPressFired.current) event.preventDefault()
    }

    const composedRef = mergeRefs<HTMLElement>(ref, (node) => {
      triggerRef.current = node
    })

    const sharedProps = {
      'aria-describedby': open ? contentId : undefined,
      // A click-driven tooltip controls a popup — expose expanded state.
      'aria-expanded': clickEnabled ? open : undefined,
      'data-state': open ? 'open' : 'closed',
      'data-pressing': pressing ? 'true' : undefined,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onContextMenu: handleContextMenu,
      onClick: handleClick,
      ...rest,
    }

    if (asChild) {
      // No wrapper classes here — the child element IS the trigger. A
      // consumer className passed to <Tooltip.Trigger> is still merged
      // onto the child by Slot.
      return (
        <Slot ref={composedRef as never} className={className} {...sharedProps}>
          {children}
        </Slot>
      )
    }

    return (
      <span
        ref={composedRef as React.Ref<HTMLSpanElement>}
        className={cx(triggerClasses, className)}
        {...sharedProps}
      >
        {children}
      </span>
    )
  },
)
TooltipTrigger.displayName = 'Tooltip.Trigger'
