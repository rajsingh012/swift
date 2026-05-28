import { forwardRef } from 'react'
import { useSliderContext } from './Slider.context'
import { cx, labelClasses } from './Slider.styles'
import type { SliderLabelProps } from './Slider.types'

/**
 * Optional text label. Mostly a styled `<label>` — pass `htmlFor` to
 * point at the Slider's id (or the id of a specific thumb), or let it
 * default to the surrounding context.
 */
export const SliderLabel = forwardRef<HTMLLabelElement, SliderLabelProps>(
  function SliderLabel({ className, ...rest }, ref) {
    const ctx = useSliderContext('Slider.Label')
    return (
      <label
        {...rest}
        ref={ref}
        data-disabled={ctx.disabled ? 'true' : 'false'}
        className={cx(labelClasses, className)}
      />
    )
  },
)
SliderLabel.displayName = 'Slider.Label'
