import { forwardRef, type HTMLAttributes } from 'react'
import { cx, labelClasses } from './Progress.styles'

export type ProgressLabelProps = HTMLAttributes<HTMLSpanElement>

/**
 * Text label for a Progress bar. When composing manually, wire it to the
 * track for assistive tech by giving it an `id` and pointing the track's
 * `aria-labelledby` at it.
 */
export const ProgressLabel = forwardRef<HTMLSpanElement, ProgressLabelProps>(
  function ProgressLabel({ className, children, ...rest }, ref) {
    return (
      <span ref={ref} className={cx(labelClasses, className)} {...rest}>
        {children}
      </span>
    )
  },
)
ProgressLabel.displayName = 'Progress.Label'
