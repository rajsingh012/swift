import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import type { CSSPropertiesWithVars } from '../internal/types'
import { useProgressContext } from './Progress.context'
import { cx, trackClasses, trackSizeClasses } from './Progress.styles'
import { ProgressIndicator } from './ProgressIndicator'

export interface ProgressTrackProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Track contents. Defaults to a `Progress.Indicator` so a bare
   * `<Progress.Track />` still renders a fill. Provide children to compose
   * your own indicator.
   */
  children?: ReactNode
}

/**
 * The rail that holds the indicator. Carries `role="progressbar"` and the
 * ARIA value attributes, reading state from the enclosing `<Progress.Root>`.
 * Sizes itself from the cascaded `size`.
 */
export const ProgressTrack = forwardRef<HTMLDivElement, ProgressTrackProps>(
  function ProgressTrack({ className, children, style, ...rest }, ref) {
    const ctx = useProgressContext('Progress.Track')
    const trackStyle: CSSPropertiesWithVars = {
      '--progress-percent': `${ctx.percent}%`,
      ...style,
    }
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={ctx.min}
        aria-valuemax={ctx.max}
        aria-valuenow={ctx.indeterminate ? undefined : ctx.value}
        aria-valuetext={ctx.indeterminate ? undefined : (ctx.readout ?? undefined)}
        data-state={ctx.indeterminate ? 'indeterminate' : 'determinate'}
        data-size={ctx.size}
        data-variant={ctx.variant}
        className={cx(trackClasses, trackSizeClasses[ctx.size], className)}
        style={trackStyle}
        {...rest}
      >
        {children ?? <ProgressIndicator />}
      </div>
    )
  },
)
ProgressTrack.displayName = 'Progress.Track'
