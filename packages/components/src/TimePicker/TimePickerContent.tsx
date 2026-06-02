import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { mergeRefs } from '../internal/refs'
import {
  isTopOverlay,
  pushOverlay,
  removeOverlay,
  usePresence,
} from '../internal/overlay'
import { useTimePicker } from './TimePicker.context'
import { contentClasses, cx } from './TimePicker.styles'
import { TimePickerActions } from './TimePickerActions'
import { TimePickerCancel } from './TimePickerCancel'
import { TimePickerOK } from './TimePickerOK'
import { TimePickerSteppers } from './TimePickerSteppers'
import { stepperActionsClasses } from './TimePicker.styles'
import type { TimePickerContentProps } from './TimePicker.types'

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

const POPOVER_OFFSET = 6

interface Position {
  top: number
  left: number
}

export const TimePickerContent = forwardRef<HTMLDivElement, TimePickerContentProps>(
  function TimePickerContent(props, ref) {
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

    const {
      open,
      setOpen,
      contentId,
      triggerRef,
      discardPending,
    } = useTimePicker('TimePicker.Content')

    const contentRef = useRef<HTMLDivElement | null>(null)
    const present = usePresence(open, contentRef)
    const shouldRender = present || forceMount

    const [position, setPosition] = useState<Position | null>(null)

    useIsoLayoutEffect(() => {
      if (!shouldRender) return
      const updatePosition = () => {
        const trigger = triggerRef.current
        const content = contentRef.current
        if (!trigger || !content) return
        const rect = trigger.getBoundingClientRect()
        const contentWidth = content.offsetWidth
        const left = Math.min(rect.left, window.innerWidth - contentWidth - 8)
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

    useEffect(() => {
      if (!open || !shouldRender) return
      pushOverlay(contentId)
      return () => removeOverlay(contentId)
    }, [open, shouldRender, contentId])

    useEffect(() => {
      if (!shouldRender) return
      const node = contentRef.current

      const openEvent = new Event('timepicker.openAutoFocus', { cancelable: true })
      onOpenAutoFocus?.(openEvent)
      if (!openEvent.defaultPrevented && node) {
        requestAnimationFrame(() => node.focus({ preventScroll: true }))
      }

      return () => {
        const closeEvent = new Event('timepicker.closeAutoFocus', {
          cancelable: true,
        })
        onCloseAutoFocus?.(closeEvent)
        if (!closeEvent.defaultPrevented) {
          triggerRef.current?.focus?.({ preventScroll: true })
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldRender])

    useEffect(() => {
      if (!open || !shouldRender) return

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || !isTopOverlay(contentId)) return
        onEscapeKeyDown?.(event)
        if (!event.defaultPrevented && closeOnEscape) {
          // Esc behaves like Cancel — discard pending edits.
          discardPending()
          setOpen(false)
        }
      }

      const handlePointerDown = (event: PointerEvent) => {
        if (!isTopOverlay(contentId)) return
        const node = contentRef.current
        const target = event.target as Node | null
        if (!node || !target || node.contains(target)) return
        if (triggerRef.current?.contains(target)) return
        onInteractOutside?.(event)
        if (!event.defaultPrevented && closeOnInteractOutside) {
          // Outside click also behaves like Cancel.
          discardPending()
          setOpen(false)
        }
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
      discardPending,
      onEscapeKeyDown,
      onInteractOutside,
      triggerRef,
    ])

    if (!shouldRender) return null

    return (
      <div
        ref={mergeRefs(ref, contentRef)}
        id={contentId}
        role="dialog"
        aria-modal={false}
        data-state={open ? 'open' : 'closed'}
        tabIndex={-1}
        style={{
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          visibility: position ? 'visible' : 'hidden',
        }}
        className={cx(contentClasses, className)}
        {...rest}
      >
        {children ?? (
          <>
            <TimePickerSteppers />
            <TimePickerActions className={stepperActionsClasses}>
              <TimePickerOK />
              <TimePickerCancel />
            </TimePickerActions>
          </>
        )}
      </div>
    )
  },
)
TimePickerContent.displayName = 'TimePicker.Content'
