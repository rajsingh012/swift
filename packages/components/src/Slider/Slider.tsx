import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  DEFAULT_MAX,
  DEFAULT_MIN,
  DEFAULT_MIN_STEPS_BETWEEN_THUMBS,
  DEFAULT_ORIENTATION,
  DEFAULT_STEP,
} from './Slider.constants'
import {
  SliderContext,
  type SliderContextValue,
} from './Slider.context'
import { SliderRange } from './SliderRange'
import { SliderThumb } from './SliderThumb'
import { SliderTrack } from './SliderTrack'
import { cx, rootClasses } from './Slider.styles'
import type { SliderProps, SliderValue } from './Slider.types'
import {
  clampForRange,
  closestThumbIndex,
  getPointerPercent,
  percentToValue,
  valuesEqual,
} from './Slider.utils'

const defaultFormat = (v: number) => String(v)

/**
 * Slider root.
 *
 * Without children, renders a sensible default shape:
 *   <Slider.Track><Slider.Range /></Slider.Track>
 *   <Slider.Thumb /> × value.length
 *
 * With children, you compose the parts yourself — Track / Range / Thumb /
 * Mark / Value. Each compound part talks to this root via context, so
 * you can rearrange them (label on top, value on the side, ticks below)
 * without prop-drilling.
 */
export const Slider = forwardRef<HTMLSpanElement, SliderProps>(
  function Slider(props, ref) {
    const {
      value: valueProp,
      defaultValue,
      onValueChange,
      onValueCommit,
      min = DEFAULT_MIN,
      max = DEFAULT_MAX,
      step = DEFAULT_STEP,
      orientation = DEFAULT_ORIENTATION,
      disabled = false,
      readOnly = false,
      inverted = false,
      minStepsBetweenThumbs = DEFAULT_MIN_STEPS_BETWEEN_THUMBS,
      name,
      form,
      required,
      dir: dirProp,
      format = defaultFormat,
      classes,
      className,
      children,
      id: idProp,
      ...rest
    } = props

    const reactId = useId()
    const id = idProp ?? `swift-slider-${reactId}`

    // ── Controlled / uncontrolled value bookkeeping ────────────────
    const isControlled = valueProp !== undefined
    const [internalValues, setInternalValues] = useState<SliderValue>(
      () => defaultValue ?? valueProp ?? [min],
    )
    const values = isControlled ? (valueProp as SliderValue) : internalValues

    // Mirror values into a ref so async handlers (pointermove / pointerup)
    // can read the latest value without going through stale closures.
    const valuesRef = useRef<SliderValue>(values)
    valuesRef.current = values

    // ── RTL detection ───────────────────────────────────────────────
    // Explicit prop wins; otherwise, on horizontal orientation we sniff
    // the closest `dir` attribute on mount. Server render gets LTR; the
    // first effect tick reconciles. Vertical orientation ignores RTL.
    const rootRef = useRef<HTMLSpanElement | null>(null)
    const [detectedRtl, setDetectedRtl] = useState(false)
    useEffect(() => {
      if (dirProp !== undefined) return
      if (orientation !== 'horizontal') return
      const el = rootRef.current
      if (!el) return
      const dir = el.closest('[dir]')?.getAttribute('dir')
      setDetectedRtl(dir === 'rtl')
    }, [dirProp, orientation])
    const isRtl =
      orientation === 'horizontal' &&
      (dirProp ? dirProp === 'rtl' : detectedRtl)

    // ── Thumb registration counter (reset per render) ──────────────
    // Reset BEFORE the JSX is returned — children render after this
    // function body runs, then each <Slider.Thumb /> increments.
    const thumbCounterRef = useRef(0)
    thumbCounterRef.current = 0
    const getNextThumbIndex = useCallback(() => thumbCounterRef.current++, [])

    // ── State updates ──────────────────────────────────────────────
    const trackRef = useRef<HTMLSpanElement | null>(null)
    const [activeThumbIndex, setActiveThumbIndex] = useState<number | null>(
      null,
    )

    /**
     * Update one thumb's value. We compute the next array in one place
     * (clamp for range neighbours, snap to step, clamp to min/max) and
     * fan out to the controlled callback + internal state.
     */
    const setThumbValue = useCallback<SliderContextValue['setThumbValue']>(
      (index, nextRaw, options) => {
        if (disabled || readOnly) return
        const current = valuesRef.current
        if (index < 0 || index >= current.length) return

        const clamped = clampForRange(
          current,
          index,
          nextRaw,
          step,
          minStepsBetweenThumbs,
          min,
          max,
        )

        if (clamped === current[index]) {
          // No movement — still fire commit if requested (key release on
          // an already-min value should still notify the consumer).
          if (options?.commit) onValueCommit?.(current)
          return
        }

        const next = current.slice()
        next[index] = clamped

        if (!isControlled) setInternalValues(next)
        valuesRef.current = next
        if (!valuesEqual(current, next)) onValueChange?.(next)
        if (options?.commit) onValueCommit?.(next)
      },
      [
        disabled,
        readOnly,
        step,
        minStepsBetweenThumbs,
        min,
        max,
        isControlled,
        onValueChange,
        onValueCommit,
      ],
    )

    // ── Pointer drag ───────────────────────────────────────────────
    // We use a ref to capture the active drag so the move/up handlers
    // stay closure-free. Pointer capture on the target keeps events
    // flowing even after the cursor leaves the thumb.
    const dragRef = useRef<{
      pointerId: number
      thumbIndex: number
      target: HTMLElement
    } | null>(null)

    const startThumbDrag = useCallback<SliderContextValue['startThumbDrag']>(
      (event, index) => {
        if (disabled || readOnly) return
        if (event.button !== 0 && event.pointerType === 'mouse') return

        const target = event.currentTarget as HTMLElement
        try {
          target.setPointerCapture(event.pointerId)
        } catch {
          /* Some browsers throw if capture is already held. */
        }
        dragRef.current = {
          pointerId: event.pointerId,
          thumbIndex: index,
          target,
        }
        setActiveThumbIndex(index)
        event.preventDefault()
      },
      [disabled, readOnly],
    )

    // Global move / up listeners — attached only while a drag is live.
    // We can't put pointermove on the thumb because pointer capture
    // doesn't reroute events on every browser; using window-level
    // listeners with pointerId filtering is the reliable cross-browser
    // pattern.
    useEffect(() => {
      if (activeThumbIndex === null) return
      const trackEl = trackRef.current
      if (!trackEl) return

      const handleMove = (event: PointerEvent) => {
        const drag = dragRef.current
        if (!drag || event.pointerId !== drag.pointerId) return
        const rect = trackEl.getBoundingClientRect()
        const percent = getPointerPercent(
          event.clientX,
          event.clientY,
          rect,
          orientation,
          isRtl,
          inverted,
        )
        const next = percentToValue(percent, min, max, step)
        setThumbValue(drag.thumbIndex, next)
      }

      const handleUp = (event: PointerEvent) => {
        const drag = dragRef.current
        if (!drag || event.pointerId !== drag.pointerId) return
        try {
          drag.target.releasePointerCapture(drag.pointerId)
        } catch {
          /* already released */
        }
        dragRef.current = null
        setActiveThumbIndex(null)
        onValueCommit?.(valuesRef.current)
      }

      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      window.addEventListener('pointercancel', handleUp)
      return () => {
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
        window.removeEventListener('pointercancel', handleUp)
      }
    }, [
      activeThumbIndex,
      orientation,
      isRtl,
      inverted,
      min,
      max,
      step,
      setThumbValue,
      onValueCommit,
    ])

    // ── Context ────────────────────────────────────────────────────
    const ctx = useMemo<SliderContextValue>(
      () => ({
        values,
        min,
        max,
        step,
        orientation,
        disabled,
        readOnly,
        isRtl,
        inverted,
        trackRef,
        activeThumbIndex,
        getNextThumbIndex,
        setThumbValue,
        startThumbDrag,
        format,
      }),
      [
        values,
        min,
        max,
        step,
        orientation,
        disabled,
        readOnly,
        isRtl,
        inverted,
        activeThumbIndex,
        getNextThumbIndex,
        setThumbValue,
        startThumbDrag,
        format,
      ],
    )

    // Default shape when consumer doesn't compose children themselves.
    // Built once per `values.length` change.
    const composedChildren =
      children ??
      (
        <>
          <SliderTrack>
            <SliderRange />
          </SliderTrack>
          {values.map((_, i) => (
            <SliderThumb key={i} index={i} />
          ))}
        </>
      )

    // Pointer down on the root (outside any thumb) → snap the nearest
    // thumb to the click and immediately start dragging it. Lets users
    // drag from anywhere on the bar.
    const handleRootPointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
      if (disabled || readOnly) return
      if (event.button !== 0 && event.pointerType === 'mouse') return
      // If the click landed on a thumb, the thumb's own handler runs first
      // and stops propagation; we won't see it here.
      const trackEl = trackRef.current
      if (!trackEl) return
      const rect = trackEl.getBoundingClientRect()
      const percent = getPointerPercent(
        event.clientX,
        event.clientY,
        rect,
        orientation,
        isRtl,
        inverted,
      )
      const target = percentToValue(percent, min, max, step)
      const nearest = closestThumbIndex(valuesRef.current, target)
      setThumbValue(nearest, target)
      // Hand off to drag — synthesize so the user can keep dragging
      // from the initial click without releasing.
      startThumbDrag(event, nearest)
      // Track-clicks should also leave the targeted thumb focused —
      // otherwise the user can drag from the rail but the very next
      // arrow press goes to the document scroll, not the slider.
      // The thumbs are the only `role="slider"` descendants of the
      // root, so positional indexing matches the values array.
      const rootEl = rootRef.current
      if (rootEl) {
        const thumbs = rootEl.querySelectorAll<HTMLElement>('[role="slider"]')
        thumbs[nearest]?.focus({ preventScroll: true })
      }
    }

    return (
      <SliderContext.Provider value={ctx}>
        <span
          {...rest}
          ref={(node) => {
            rootRef.current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) (ref as { current: HTMLSpanElement | null }).current = node
          }}
          id={id}
          data-orientation={orientation}
          data-disabled={disabled ? 'true' : 'false'}
          data-readonly={readOnly ? 'true' : 'false'}
          data-dragging={activeThumbIndex !== null ? 'true' : undefined}
          dir={dirProp}
          onPointerDown={handleRootPointerDown}
          className={cx(rootClasses, className, classes?.root)}
        >
          {composedChildren}

          {/* Hidden inputs for native form submission. One per thumb so
              ranges serialise as `name=lo&name=hi` (standard array form). */}
          {name
            ? values.map((v, i) => (
                <input
                  key={i}
                  type="hidden"
                  name={name}
                  value={v}
                  form={form}
                  required={required}
                />
              ))
            : null}
        </span>
      </SliderContext.Provider>
    )
  },
)

Slider.displayName = 'Slider'
