import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { mergeRefs } from '../internal/refs'
import {
  getFocusable,
  isTopOverlay,
  pushOverlay,
  removeOverlay,
  usePresence,
} from '../internal/overlay'
import { useDatePicker } from './DatePicker.context'
import { POPOVER_OFFSET } from './DatePicker.constants'
import { contentClasses, cx } from './DatePicker.styles'
import { DatePickerCalendar } from './DatePickerCalendar'
import { DatePickerDoneButton } from './DatePickerDoneButton'
import { DatePickerTimeFields } from './DatePickerTimeFields'
import type { DatePickerContentProps } from './DatePicker.types'

/**
 * Default Content children — Calendar alone, plus a footer row with
 * TimeFields + DoneButton when `withTime` is on. Consumers override by
 * passing children explicitly.
 */
function DatePickerContentDefault() {
  const { withTime } = useDatePicker('DatePicker.Content')
  if (!withTime) return <DatePickerCalendar />
  return (
    <>
      <DatePickerCalendar />
      <div className="flex items-end gap-3 mt-3 pt-3 border-t border-stroke-muted">
        <DatePickerTimeFields className="mt-0 pt-0 border-0 flex-1" />
        <DatePickerDoneButton />
      </div>
    </>
  )
}

// SSR-safe layout effect — useLayoutEffect on the client, no-op on the server.
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

interface Position {
  top: number
  left: number
}

export const DatePickerContent = forwardRef<HTMLDivElement, DatePickerContentProps>(
  function DatePickerContent(props, ref) {
    const {
      closeOnEscape = true,
      closeOnInteractOutside = true,
      forceMount = false,
      onOpenAutoFocus,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onInteractOutside,
      className,
      children,
      ...rest
    } = props

    const { open, setOpen, contentId, triggerRef, dir } = useDatePicker(
      'DatePicker.Content',
    )

    const contentRef = useRef<HTMLDivElement | null>(null)
    const present = usePresence(open, contentRef)
    const shouldRender = present || forceMount

    // ── Positioning (naive v1: fixed under the trigger) ──────────
    const [position, setPosition] = useState<Position | null>(null)

    useIsoLayoutEffect(() => {
      if (!shouldRender) return
      const updatePosition = () => {
        const trigger = triggerRef.current
        const content = contentRef.current
        if (!trigger || !content) return
        const rect = trigger.getBoundingClientRect()
        // Keep within viewport on the right edge by clamping. No flip yet.
        const contentWidth = content.offsetWidth
        const left = Math.min(
          rect.left,
          window.innerWidth - contentWidth - 8,
        )
        setPosition({
          top: rect.bottom + POPOVER_OFFSET,
          left: Math.max(8, left),
        })
      }
      updatePosition()
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
      }
    }, [shouldRender, triggerRef])

    // ── Overlay stack (Esc + outside-click dispatch in order) ────
    useEffect(() => {
      if (!open || !shouldRender) return
      pushOverlay(contentId)
      return () => removeOverlay(contentId)
    }, [open, shouldRender, contentId])

    // ── Auto-focus on open; restore on close ─────────────────────
    useEffect(() => {
      if (!shouldRender) return
      const node = contentRef.current
      const previouslyFocused = document.activeElement as HTMLElement | null

      const openEvent = new Event('datepicker.openAutoFocus', { cancelable: true })
      onOpenAutoFocus?.(openEvent)
      if (!openEvent.defaultPrevented && node) {
        // Prefer the day cell with roving tabIndex=0 so keyboard users land
        // directly on the calendar instead of the Prev button.
        const focusedDay = node.querySelector<HTMLElement>(
          '[role="gridcell"][tabindex="0"]:not([disabled])',
        )
        const target = focusedDay ?? getFocusable(node)[0] ?? node
        requestAnimationFrame(() => target.focus({ preventScroll: true }))
      }

      return () => {
        const closeEvent = new Event('datepicker.closeAutoFocus', {
          cancelable: true,
        })
        onCloseAutoFocus?.(closeEvent)
        if (!closeEvent.defaultPrevented) {
          const restore = triggerRef.current ?? previouslyFocused
          restore?.focus?.({ preventScroll: true })
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldRender])

    // ── Esc + outside pointerdown ────────────────────────────────
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

    if (!shouldRender) return null

    // `dir` is rendered explicitly — the content is portaled, so it can't
    // inherit a `[dir]` set on the trigger's subtree. CSS logical
    // properties inside the popover respond to the resolved direction.
    return (
      <div
        ref={mergeRefs(ref, contentRef)}
        id={contentId}
        role="dialog"
        aria-modal={false}
        dir={dir}
        data-state={open ? 'open' : 'closed'}
        tabIndex={-1}
        style={{
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          // Hide until measured so the popover doesn't flash at (0,0).
          visibility: position ? 'visible' : 'hidden',
        }}
        className={cx(contentClasses, className)}
        {...rest}
      >
        {children ?? <DatePickerContentDefault />}
      </div>
    )
  },
)
DatePickerContent.displayName = 'DatePicker.Content'
