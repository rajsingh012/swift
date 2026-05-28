import { forwardRef } from 'react'
import { useSliderContext } from './Slider.context'
import { cx, valueClasses } from './Slider.styles'
import type { SliderValueProps } from './Slider.types'

/**
 * Reads out the current value(s). By default shows `values[0]`;
 * pass `index` to target a different thumb, or a `format` override
 * to control the string (currency, percentages, durations).
 *
 *   Slider.Value                              -> "50"
 *   Slider.Value index={1}                    -> range, max
 *   Slider.Value format={(v) => `₹${v}`}      -> "₹50"
 *   Slider.Value>{(v) => <strong>{v}%</strong>}
 *
 * Marked `aria-hidden` because the value is already announced by the
 * thumb's `aria-valuetext` — duplicate announcements (the value
 * readout + the slider role) make screen readers chatty.
 */
export const SliderValue = forwardRef<HTMLSpanElement, SliderValueProps>(
  function SliderValue(
    { index = 0, format: formatOverride, className, children, ...rest },
    ref,
  ) {
    const ctx = useSliderContext('Slider.Value')
    const value = ctx.values[index] ?? ctx.min
    const format = formatOverride ?? ctx.format

    return (
      <span
        {...rest}
        ref={ref}
        aria-hidden="true"
        data-orientation={ctx.orientation}
        className={cx(valueClasses, className)}
      >
        {typeof children === 'function' ? children(value) : format(value)}
      </span>
    )
  },
)
SliderValue.displayName = 'Slider.Value'
