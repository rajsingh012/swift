import {
  forwardRef,
  useEffect,
  useRef,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { mergeRefs } from '../internal/refs'
import { useSwitchContext } from './Switch.context'
import {
  controlClasses,
  cx,
  hiddenInputClasses,
} from './Switch.styles'
import { SwitchThumb } from './SwitchThumb'
import { SwitchTrack } from './SwitchTrack'
import type { SwitchInputProps } from './Switch.types'

/** Pointer travel before pointerdown is reclassified from "click" to "drag".
 *  Below this we let the native input click run normally; above it we
 *  swallow the click and apply our drag-decided checked value. */
const DRAG_ACTIVATION_PX = 4

/**
 * Renders the real `<input type="checkbox" role="switch">` overlaid on a
 * styled track + thumb. The input fills the wrapper at opacity 0, so all
 * clicks (and Space-key activation) route through it — native form
 * submission, screen-reader semantics, and label `htmlFor` association all
 * Just Work without custom key handlers.
 *
 * When `dragToToggle` is enabled on the surrounding Switch / Switch.Root,
 * the wrapper also handles a pointer-drag gesture: down → move past 4 px
 * activates drag, the thumb tracks the pointer in real time, and release
 * past the midpoint flips state. Click + Space still work unchanged.
 *
 * `role="switch"` is the ARIA distinction from Checkbox: SRs announce
 * "Switch, on/off" instead of "Checkbox, checked/unchecked".
 */
export const SwitchInput = forwardRef<HTMLInputElement, SwitchInputProps>(
  function SwitchInput(props, forwardedRef) {
    const ctx = useSwitchContext()
    const {
      className,
      onChange,
      children,
      id: idProp,
      name: nameProp,
      value: valueProp,
      'aria-describedby': describedByProp,
      'aria-labelledby': labelledByProp,
      ...rest
    } = props

    const innerInputRef = useRef<HTMLInputElement | null>(null)
    const wrapperRef = useRef<HTMLSpanElement | null>(null)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event)
      if (ctx.readOnly || ctx.loading) {
        event.preventDefault()
        const node = event.currentTarget
        node.checked = ctx.checked
        return
      }
      ctx.onCheckedChange?.(event.target.checked)
    }

    // ── Drag-to-toggle ─────────────────────────────────────────────
    // Live state mirrored into refs so the gesture's listeners stay
    // closure-stable across React re-renders.
    const checkedRef = useRef(ctx.checked)
    checkedRef.current = ctx.checked
    const onCheckedChangeRef = useRef(ctx.onCheckedChange)
    onCheckedChangeRef.current = ctx.onCheckedChange
    const interactiveRef = useRef(
      ctx.dragToToggle && !ctx.disabled && !ctx.readOnly && !ctx.loading,
    )
    interactiveRef.current =
      ctx.dragToToggle && !ctx.disabled && !ctx.readOnly && !ctx.loading

    /**
     * Cleanup callback set up when a drag gesture begins. Calling it
     * unwinds window-level listeners and any inline thumb styles, then
     * clears itself from this ref. Stored here (not on dragRef) so the
     * component unmount effect can call it without needing the live
     * gesture state.
     */
    const cleanupRef = useRef<(() => void) | null>(null)

    const handlePointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
      if (!interactiveRef.current) return
      if (event.button !== 0 && event.pointerType === 'mouse') return

      const wrapper = wrapperRef.current
      if (!wrapper) return
      const track = wrapper.querySelector<HTMLElement>('.swift-switch-track')
      const thumb = wrapper.querySelector<HTMLElement>('.swift-switch-thumb')
      if (!track || !thumb) return

      // If a previous gesture somehow left dangling listeners (unlikely
      // after the cleanup pattern below, but cheap insurance), tear them
      // down before starting a new gesture.
      cleanupRef.current?.()

      // Resolve direction at gesture start — `closest('[dir]')` walks up
      // to the nearest ancestor that declares a direction, then we fall
      // back to LTR. Snapshot once so the gesture stays consistent even
      // if the page re-renders mid-drag.
      const isRtl =
        wrapper.closest('[dir]')?.getAttribute('dir') === 'rtl'

      const trackWidth = track.offsetWidth
      const thumbWidth = thumb.offsetWidth
      // Pull --switch-thumb-inset off the resolved styles so a consumer
      // who overrides the token gets the matching travel range.
      const inset = parseFloat(
        getComputedStyle(track).getPropertyValue('--switch-thumb-inset') ||
          '2',
      )
      const travel = Math.max(0, trackWidth - thumbWidth - inset * 2)

      const pointerId = event.pointerId
      const startX = event.clientX
      const startChecked = checkedRef.current
      const startPosition = startChecked ? travel : 0

      const state = {
        activated: false,
        lastPosition: startPosition,
      }

      // ────────────────────────────────────────────────────────────
      // Self-contained handler closures. Attaching and detaching by
      // these exact references means a re-render during the gesture
      // can't break listener removal — cleanup uses the same closures
      // that were attached.
      // ────────────────────────────────────────────────────────────

      const onMove = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return
        const rawDx = e.clientX - startX
        const dx = isRtl ? -rawDx : rawDx

        if (!state.activated) {
          if (Math.abs(rawDx) < DRAG_ACTIVATION_PX) return
          state.activated = true
          // Switch off the position transition once we know it's a drag,
          // so the thumb tracks the pointer 1:1 instead of easing behind.
          thumb.style.transition = 'none'
        }

        // Suppress text selection / page-scroll once drag is live.
        e.preventDefault()

        const nextPosition = Math.max(0, Math.min(travel, startPosition + dx))
        state.lastPosition = nextPosition
        thumb.style.insetInlineStart = `${nextPosition}px`
      }

      const cleanup = () => {
        thumb.style.insetInlineStart = ''
        thumb.style.transition = ''
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onCancel)
        if (cleanupRef.current === cleanup) cleanupRef.current = null
      }

      const onUp = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return

        if (state.activated) {
          const nextChecked = state.lastPosition > travel / 2

          // After a real drag, suppress the click the input is about
          // to fire — otherwise the toggle happens twice (once from
          // drag-end, once from the native click).
          const inputEl = innerInputRef.current
          if (inputEl) {
            const swallow = (clickEvent: Event) => {
              clickEvent.preventDefault()
              clickEvent.stopPropagation()
              inputEl.removeEventListener('click', swallow, true)
            }
            inputEl.addEventListener('click', swallow, true)
            // Safety net — if the browser never fires the click (some
            // pointer-cancel paths skip it), drop the listener.
            window.setTimeout(() => {
              inputEl.removeEventListener('click', swallow, true)
            }, 100)
          }

          cleanup()

          if (nextChecked !== startChecked) {
            onCheckedChangeRef.current?.(nextChecked)
          }
        } else {
          // Below-threshold pointer up — fall through to the native
          // click, which handleChange already routes through
          // onCheckedChange.
          cleanup()
        }
      }

      const onCancel = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return
        cleanup()
      }

      cleanupRef.current = cleanup
      // `passive: false` is needed because `onMove` calls
      // event.preventDefault() once drag is live.
      window.addEventListener('pointermove', onMove, { passive: false })
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onCancel)
    }

    // Tear down any in-flight gesture if the component unmounts.
    useEffect(() => {
      return () => {
        cleanupRef.current?.()
      }
    }, [])

    const describedBy =
      [
        ctx.hasDescription ? ctx.descriptionId : '',
        ctx.hasErrorMessage ? ctx.errorMessageId : '',
        describedByProp ?? '',
      ]
        .filter(Boolean)
        .join(' ') || undefined

    return (
      <span
        ref={wrapperRef}
        data-state={ctx.checked ? 'checked' : 'unchecked'}
        data-disabled={ctx.disabled ? 'true' : 'false'}
        data-readonly={ctx.readOnly ? 'true' : 'false'}
        data-invalid={ctx.invalid ? 'true' : 'false'}
        data-loading={ctx.loading ? 'true' : 'false'}
        className={cx(controlClasses, className)}
        onPointerDown={handlePointerDown}
      >
        <input
          ref={mergeRefs(forwardedRef, ctx.inputRef, innerInputRef)}
          type="checkbox"
          role="switch"
          id={(idProp ?? ctx.id) || undefined}
          name={nameProp ?? ctx.name}
          value={valueProp ?? ctx.value}
          checked={ctx.checked}
          disabled={ctx.disabled || ctx.loading}
          required={ctx.required}
          aria-checked={ctx.checked}
          aria-invalid={ctx.invalid || undefined}
          aria-required={ctx.required || undefined}
          aria-readonly={ctx.readOnly || undefined}
          aria-busy={ctx.loading || undefined}
          aria-describedby={describedBy}
          aria-labelledby={labelledByProp}
          onChange={handleChange}
          className={hiddenInputClasses}
          {...rest}
        />
        {children ?? (
          <>
            <SwitchTrack>
              <SwitchThumb />
            </SwitchTrack>
          </>
        )}
      </span>
    )
  },
)

SwitchInput.displayName = 'Switch.Input'
