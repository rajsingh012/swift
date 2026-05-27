import { forwardRef } from 'react'
import { useRadioContext } from './Radio.context'
import {
  cx,
  indicatorClasses,
  indicatorInvalidClasses,
  indicatorSizeClasses,
} from './Radio.styles'
import type { RadioIndicatorProps } from './Radio.types'

export const RadioIndicator = forwardRef<HTMLSpanElement, RadioIndicatorProps>(
  function RadioIndicator(props, ref) {
    const ctx = useRadioContext()
    const { forceChecked, className, children, ...rest } = props
    const isChecked = forceChecked ?? ctx.checked

    if (!isChecked) return null

    return (
      <span
        ref={ref}
        aria-hidden
        data-state="checked"
        className={cx(
          indicatorClasses,
          indicatorSizeClasses[ctx.size],
          ctx.invalid ? indicatorInvalidClasses : null,
          className,
        )}
        {...rest}
      >
        {children ?? ctx.indicator}
      </span>
    )
  },
)

RadioIndicator.displayName = 'Radio.Indicator'
