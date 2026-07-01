import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import type { CSSPropertiesWithVars } from '../internal/types'
import { COLLISION_PADDING } from './Select.constants'
import { useSelect } from './Select.context'
import { contentClasses, cx } from './Select.styles'
import type { SelectContentProps } from './Select.types'
import {
  isTopOverlay,
  mergeRefs,
  pushOverlay,
  removeOverlay,
  useFloating,
  usePresence,
} from './Select.utils'

/**
 * The listbox surface — portaled, positioned by the floating engine, held
 * through its exit animation. Renders `role="listbox"`. Focus stays on the
 * trigger (combobox pattern); the content captures keyboard nav and commits
 * the highlighted option on Enter. Dismisses on Escape / outside-pointerdown.
 */
export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent(props, ref) {
    const {
      forceMount = false,
      closeOnEscape = true,
      closeOnInteractOutside = true,
      matchTriggerWidth = true,
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
      value,
      setValue,
      contentId,
      triggerId,
      triggerRef,
      placement,
      offset,
      dir,
      highlighted,
      setHighlighted,
      moveHighlight,
      onTypeahead,
    } = useSelect('Select.Content')

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

    // Measure the trigger width so the listbox can match it.
    const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined)
    useEffect(() => {
      if (!shouldRender || !matchTriggerWidth) return
      const node = triggerRef.current
      if (node) setTriggerWidth(node.offsetWidth)
    }, [shouldRender, matchTriggerWidth, triggerRef])

    useEffect(() => {
      if (!open || !shouldRender) return
      pushOverlay(contentId)
      return () => removeOverlay(contentId)
    }, [open, shouldRender, contentId])

    // On open: seed the highlight to the selected value (or first item) and
    // move keyboard focus into the listbox so it captures nav keys. On close:
    // clear the highlight and restore focus to the trigger.
    useEffect(() => {
      if (!shouldRender) return
      setHighlighted(value)
      requestAnimationFrame(() => {
        contentRef.current?.focus({ preventScroll: true })
        if (value === null) moveHighlight('first')
      })
      return () => {
        setHighlighted(null)
        triggerRef.current?.focus?.({ preventScroll: true })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldRender])

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

    // Keyboard nav is captured on the content; since focus stays on the
    // trigger, the trigger's keydown forwards Arrow keys here via the shared
    // context. But when the content itself has focusable children we also
    // listen here for robustness.
    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          moveHighlight('next')
          break
        case 'ArrowUp':
          event.preventDefault()
          moveHighlight('prev')
          break
        case 'Home':
          event.preventDefault()
          moveHighlight('first')
          break
        case 'End':
          event.preventDefault()
          moveHighlight('last')
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (highlighted) setValue(highlighted)
          break
        default:
          if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
            onTypeahead(event.key)
          }
      }
    }

    // The listbox stays mounted even while closed so its items keep their
    // labels registered (so <Select.Value> can render the selected label) and
    // the combobox always has accessible options. When closed we collapse it
    // with `display:none` rather than unmounting.
    const positionStyle: CSSPropertiesWithVars = shouldRender
      ? {
          position: 'fixed',
          top: floating.y,
          left: floating.x,
          width: matchTriggerWidth && triggerWidth ? triggerWidth : undefined,
          visibility:
            floating.isPositioned && !floating.hidden ? 'visible' : 'hidden',
          pointerEvents: floating.hidden ? 'none' : undefined,
          ...style,
        }
      : { display: 'none', ...style }

    return (
      <div
        ref={mergeRefs(ref, contentRef)}
        id={contentId}
        role="listbox"
        aria-labelledby={triggerId}
        tabIndex={-1}
        hidden={!shouldRender}
        data-state={open ? 'open' : 'closed'}
        data-side={floating.side}
        data-align={floating.align}
        style={positionStyle}
        className={cx(contentClasses, className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    )
  },
)
SelectContent.displayName = 'Select.Content'
