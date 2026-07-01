import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { useProgressContext } from './Progress.context'
import { cx, valueClasses } from './Progress.styles'

export interface ProgressValueProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /**
   * Custom readout content. Omit to show the formatted percentage from
   * context (nothing renders while indeterminate).
   */
  children?: ReactNode
}

/**
 * The numeric/percentage readout. Defaults to the formatted value from the
 * enclosing `<Progress.Root>` context; renders nothing while indeterminate
 * unless given explicit children.
 */
export const ProgressValue = forwardRef<HTMLSpanElement, ProgressValueProps>(
  function ProgressValue({ className, children, ...rest }, ref) {
    const ctx = useProgressContext('Progress.Value')
    const content = children ?? ctx.readout
    if (content == null) return null
    return (
      <span ref={ref} className={cx(valueClasses, className)} {...rest}>
        {content}
      </span>
    )
  },
)
ProgressValue.displayName = 'Progress.Value'
