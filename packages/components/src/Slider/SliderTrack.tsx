import { forwardRef } from 'react'
import { useSliderContext } from './Slider.context'
import { cx, trackClasses } from './Slider.styles'
import type { SliderTrackProps } from './Slider.types'

/**
 * The bar children sit on. Owns the geometry the rest of the Slider
 * measures from — pointer events on the track are handled at the Root
 * level (so a click anywhere on the bar still snaps + drags the nearest
 * thumb), this component just renders the rail.
 */
export const SliderTrack = forwardRef<HTMLSpanElement, SliderTrackProps>(
  function SliderTrack({ className, children, ...rest }, ref) {
    const ctx = useSliderContext('Slider.Track')
    return (
      <span
        {...rest}
        ref={(node) => {
          ctx.trackRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as { current: HTMLSpanElement | null }).current = node
        }}
        data-orientation={ctx.orientation}
        data-disabled={ctx.disabled ? 'true' : 'false'}
        className={cx(trackClasses, className)}
      >
        {children}
      </span>
    )
  },
)
SliderTrack.displayName = 'Slider.Track'
