import { forwardRef, type CSSProperties } from 'react'
import { useSliderContext } from './Slider.context'
import {
  cx,
  markDotClasses,
  markLabelClasses,
  markWrapperClasses,
} from './Slider.styles'
import type { SliderMarkProps } from './Slider.types'
import { valueToPercent } from './Slider.utils'

/**
 * A tick at a specific `value`. Renders two visuals — a dot anchored on
 * the track centerline (so it reads as a notch on the rail) and an
 * optional label flowing below (or beside, for vertical sliders).
 *
 * Both visuals share a `data-active` attribute that flips when the mark
 * falls inside the current range — single-thumb sliders treat anything
 * `≤ value` as active; range sliders treat values between thumbs as
 * active. Token-driven so consumers can repaint the dot independently
 * from the thumb / range chrome.
 */
export const SliderMark = forwardRef<HTMLSpanElement, SliderMarkProps>(
  function SliderMark({ value, className, style, children, ...rest }, ref) {
    const { values, min, max, orientation, isRtl, inverted } =
      useSliderContext('Slider.Mark')

    // Percentage along the value scale → physical coordinate. Inverted
    // and RTL collapse into the same logical-property anchor (right vs
    // left, bottom vs top) so the CSS engine handles the visual flip.
    const rawPct = valueToPercent(value, min, max)
    const pct = inverted ? 100 - rawPct : rawPct

    const positionStyle: CSSProperties =
      orientation === 'horizontal'
        ? isRtl
          ? { right: `${pct}%` }
          : { left: `${pct}%` }
        : { bottom: `${pct}%` }

    const lo = values.length === 1 ? min : Math.min(...values)
    const hi = Math.max(...values)
    const active = value >= lo && value <= hi
    const activeAttr = active ? 'true' : 'false'

    return (
      <span
        {...rest}
        ref={ref}
        data-orientation={orientation}
        data-active={activeAttr}
        data-value={value}
        style={{ ...positionStyle, ...style }}
        className={cx(markWrapperClasses, className)}
      >
        <span
          aria-hidden="true"
          data-active={activeAttr}
          data-orientation={orientation}
          className={markDotClasses}
        />
        {children !== undefined ? (
          <span
            data-active={activeAttr}
            data-orientation={orientation}
            className={markLabelClasses}
          >
            {children}
          </span>
        ) : null}
      </span>
    )
  },
)
SliderMark.displayName = 'Slider.Mark'
