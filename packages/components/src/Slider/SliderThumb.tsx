import {
  forwardRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { PAGE_KEY_FRACTION } from './Slider.constants'
import { useSliderContext } from './Slider.context'
import { cx, thumbClasses } from './Slider.styles'
import type { SliderThumbProps } from './Slider.types'
import { valueToPercent } from './Slider.utils'

/**
 * A single thumb on the slider. Handles its own keyboard input
 * (arrows / page / home / end) and starts the pointer drag on
 * `pointerdown` — the actual drag tracking lives on the Root so move /
 * up events keep flowing even when the cursor leaves the thumb.
 *
 * `aria-label` vs `aria-labelledby` matters here: every thumb needs an
 * accessible name (especially in range sliders — "min price" vs "max
 * price"), and we forward those props directly so screen readers
 * announce the right thing.
 */
export const SliderThumb = forwardRef<HTMLSpanElement, SliderThumbProps>(
  function SliderThumb(props, ref) {
    const {
      index: indexProp,
      className,
      style,
      children,
      onKeyDown,
      onPointerDown,
      ...rest
    } = props
    const ctx = useSliderContext('Slider.Thumb')

    // Auto-assign an index if the consumer didn't pass one. Called
    // during render — relies on the Root resetting its counter every
    // render and on React's stable child-render order.
    const index = indexProp ?? ctx.getNextThumbIndex()
    const value = ctx.values[index] ?? ctx.min

    // ── Position ──────────────────────────────────────────────────
    // 0-100 percentage along the value scale. RTL is handled by the
    // logical edge we anchor to (`right` instead of `left`).
    const rawPct = valueToPercent(value, ctx.min, ctx.max)
    const pct = ctx.inverted ? 100 - rawPct : rawPct

    const positionStyle: CSSProperties =
      ctx.orientation === 'horizontal'
        ? ctx.isRtl
          ? { right: `${pct}%` }
          : { left: `${pct}%` }
        : { bottom: `${pct}%` }

    // ── Keyboard ──────────────────────────────────────────────────
    const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented) return
      if (ctx.disabled || ctx.readOnly) return

      const { min, max, step, isRtl, inverted, orientation } = ctx
      const pageStep = Math.max(step, (max - min) * PAGE_KEY_FRACTION)

      let delta = 0
      let absolute: number | null = null

      switch (event.key) {
        case 'ArrowRight':
          // Right = increase in LTR, decrease in RTL.
          delta = isRtl ? -step : step
          break
        case 'ArrowLeft':
          delta = isRtl ? step : -step
          break
        case 'ArrowUp':
          // Up = increase regardless of orientation / direction.
          delta = step
          break
        case 'ArrowDown':
          delta = -step
          break
        case 'PageUp':
          delta = pageStep
          break
        case 'PageDown':
          delta = -pageStep
          break
        case 'Home':
          absolute = inverted ? max : min
          break
        case 'End':
          absolute = inverted ? min : max
          break
        default:
          return
      }

      event.preventDefault()
      // `inverted` flips the direction users expect from arrow keys:
      // if they see the slider running right-to-left, ArrowRight should
      // move them toward what they perceive as "more" — i.e. the lower
      // raw value. We only apply this for arrow keys (Home/End is
      // already disambiguated above).
      if (inverted && delta !== 0) {
        delta = -delta
      }
      // Vertical-only special case: in vertical, RTL is irrelevant, but
      // ArrowLeft/Right have no obvious "more" direction. We let them
      // mirror Up/Down so a user pressing → on a vertical slider isn't
      // surprised by the slider doing nothing. Already handled — keys
      // produce ±step above. Comment out / change here if we ever want
      // strictly disabled left/right on vertical.
      void orientation

      const nextValue =
        absolute !== null ? absolute : ctx.values[index] + delta
      ctx.setThumbValue(index, nextValue, { commit: true })
    }

    // ── Pointer ───────────────────────────────────────────────────
    const handlePointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
      onPointerDown?.(event)
      if (event.defaultPrevented) return
      // Prevent the root's pointer-down from also firing (which would
      // re-pick the nearest thumb and could shift the value before the
      // drag begins).
      event.stopPropagation()
      // Explicitly focus this thumb. `startThumbDrag` calls
      // `event.preventDefault()` which blocks the browser's implicit
      // focus on mousedown — without this line, clicking a thumb leaves
      // it unfocused, and the very next arrow-key press would scroll
      // the page instead of moving the slider.
      ;(event.currentTarget as HTMLElement).focus({ preventScroll: true })
      ctx.startThumbDrag(event, index)
    }

    const dragging = ctx.activeThumbIndex === index
    const renderedChildren =
      typeof children === 'function' ? children(value) : children

    return (
      <span
        {...rest}
        ref={ref}
        role="slider"
        tabIndex={ctx.disabled ? -1 : 0}
        aria-valuemin={ctx.min}
        aria-valuemax={ctx.max}
        aria-valuenow={value}
        aria-valuetext={ctx.format(value)}
        aria-orientation={ctx.orientation}
        aria-disabled={ctx.disabled || undefined}
        aria-readonly={ctx.readOnly || undefined}
        data-orientation={ctx.orientation}
        data-disabled={ctx.disabled ? 'true' : 'false'}
        data-readonly={ctx.readOnly ? 'true' : 'false'}
        data-dragging={dragging ? 'true' : undefined}
        data-index={index}
        style={{ ...positionStyle, ...style }}
        className={cx(thumbClasses, className)}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
      >
        {renderedChildren}
      </span>
    )
  },
)
SliderThumb.displayName = 'Slider.Thumb'
