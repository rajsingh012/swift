import { forwardRef, type CSSProperties } from 'react'
import { useSliderContext } from './Slider.context'
import { cx, rangeClasses } from './Slider.styles'
import type { SliderRangeProps } from './Slider.types'
import { valueToPercent } from './Slider.utils'

/**
 * The filled portion of the track. Spans from the lowest value to the
 * highest (so it grows naturally for both single-thumb and range
 * variants — single: 0 → value, range: value[0] → value[n]).
 *
 * RTL + inverted are handled by reading from the same %-of-range model
 * and inverting which physical edge we anchor to. We use logical
 * properties (`inset-inline-start` via inline style) so horizontal RTL
 * flips automatically without us re-computing the maths.
 */
export const SliderRange = forwardRef<HTMLSpanElement, SliderRangeProps>(
  function SliderRange({ className, style, ...rest }, ref) {
    const { values, min, max, orientation, disabled, isRtl, inverted } =
      useSliderContext('Slider.Range')

    const sorted = values.length === 1 ? [min, values[0]] : [
      Math.min(...values),
      Math.max(...values),
    ]
    const startPct = valueToPercent(sorted[0], min, max)
    const endPct = valueToPercent(sorted[1], min, max)

    // Anchor logic: by default the range starts from the "min-side" edge.
    // Inverted flips that. RTL is purely visual on horizontal sliders so
    // we let CSS logical properties handle the physical flip.
    const startOffset = inverted ? 100 - endPct : startPct
    const endOffset = inverted ? 100 - startPct : endPct
    const span = endOffset - startOffset

    const positionStyle: CSSProperties =
      orientation === 'horizontal'
        ? isRtl
          ? { right: `${startOffset}%`, width: `${span}%` }
          : { left: `${startOffset}%`, width: `${span}%` }
        : { bottom: `${startOffset}%`, height: `${span}%` }

    return (
      <span
        {...rest}
        ref={ref}
        data-orientation={orientation}
        data-disabled={disabled ? 'true' : 'false'}
        style={{ ...positionStyle, ...style }}
        className={cx(rangeClasses, className)}
      />
    )
  },
)
SliderRange.displayName = 'Slider.Range'
