import { forwardRef, useId } from 'react'
import type { CSSPropertiesWithVars } from '../internal/types'
import {
  DEFAULT_MAX,
  DEFAULT_MIN,
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
} from './Progress.constants'
import {
  cx,
  headerClasses,
  indicatorClasses,
  labelClasses,
  rootClasses,
  trackClasses,
  trackSizeClasses,
  valueClasses,
  variantClasses,
} from './Progress.styles'
import type { ProgressProps } from './Progress.types'

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * A determinate or indeterminate progress bar. Built on the same track/fill
 * model as Slider, minus the thumb and pointer interaction.
 *
 *   <Progress value={40} label="Uploading" showValue />
 *   <Progress value={null} label="Loading" />   // indeterminate
 *
 * Accessibility: renders `role="progressbar"` with `aria-valuemin/max/now`
 * (now is omitted while indeterminate, per ARIA). `label` is wired via
 * `aria-labelledby` when shown, else exposed as `aria-label`.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  function Progress(props, ref) {
    const {
      value: valueProp,
      min = DEFAULT_MIN,
      max = DEFAULT_MAX,
      size = DEFAULT_SIZE,
      variant = DEFAULT_VARIANT,
      label,
      showValue = false,
      format,
      classes,
      className,
      ...rest
    } = props

    const reactId = useId()
    const labelId = `swift-progress-label-${reactId}`

    const isIndeterminate = valueProp == null
    const value = isIndeterminate ? 0 : clamp(valueProp, min, max)
    const range = max - min
    const percent = range > 0 ? ((value - min) / range) * 100 : 0
    const roundedPercent = Math.round(percent)

    const readout = isIndeterminate
      ? null
      : format
        ? format(value, roundedPercent)
        : `${roundedPercent}%`

    const hasLabel = label != null
    const showHeader = hasLabel || (showValue && !isIndeterminate)

    const trackStyle: CSSPropertiesWithVars = {
      '--progress-percent': `${percent}%`,
    }

    return (
      <div
        ref={ref}
        className={cx(rootClasses, className, classes?.root)}
        {...rest}
      >
        {showHeader ? (
          <div className={headerClasses}>
            {hasLabel ? (
              <span id={labelId} className={cx(labelClasses, classes?.label)}>
                {label}
              </span>
            ) : (
              <span />
            )}
            {showValue && !isIndeterminate ? (
              <span className={cx(valueClasses, classes?.value)}>{readout}</span>
            ) : null}
          </div>
        ) : null}

        <div
          role="progressbar"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={isIndeterminate ? undefined : value}
          aria-valuetext={isIndeterminate ? undefined : (readout ?? undefined)}
          aria-labelledby={hasLabel ? labelId : undefined}
          aria-label={hasLabel ? undefined : (typeof label === 'string' ? label : undefined)}
          data-state={isIndeterminate ? 'indeterminate' : 'determinate'}
          data-size={size}
          data-variant={variant}
          className={cx(
            trackClasses,
            trackSizeClasses[size],
            classes?.track,
          )}
          style={trackStyle}
        >
          <div
            data-state={isIndeterminate ? 'indeterminate' : 'determinate'}
            className={cx(indicatorClasses, variantClasses[variant], classes?.indicator)}
            style={
              isIndeterminate ? undefined : { width: `var(--progress-percent)` }
            }
          />
        </div>
      </div>
    )
  },
)
Progress.displayName = 'Progress'
