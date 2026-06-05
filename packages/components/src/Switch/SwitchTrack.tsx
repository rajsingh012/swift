import { forwardRef } from 'react'
import { Slot } from '../internal/Slot'
import { useSwitchContext } from './Switch.context'
import { cx, trackClasses } from './Switch.styles'
import type { SwitchTrackProps } from './Switch.types'

/**
 * The visible pill. Background, dimensions, and focus-ring glow are all
 * driven by data-attributes on the parent root (set by Switch / Switch.Root)
 * via the CSS tokens in `theme/switch.css`. The track holds the absolute
 * thumb so it can travel inside the pill on state change.
 */
export const SwitchTrack = forwardRef<HTMLSpanElement, SwitchTrackProps>(
  function SwitchTrack(props, ref) {
    const ctx = useSwitchContext()
    const { className, children, asChild = false, ...rest } = props

    const trackProps = {
      'data-state': ctx.checked ? 'checked' : 'unchecked',
      'data-disabled': ctx.disabled ? 'true' : 'false',
      'data-readonly': ctx.readOnly ? 'true' : 'false',
      'data-invalid': ctx.invalid ? 'true' : 'false',
      className: cx(trackClasses, className),
      ...rest,
    }

    if (asChild) {
      return (
        <Slot ref={ref} {...trackProps}>
          {children}
        </Slot>
      )
    }

    return (
      <span ref={ref} {...trackProps}>
        {children}
      </span>
    )
  },
)

SwitchTrack.displayName = 'Switch.Track'
