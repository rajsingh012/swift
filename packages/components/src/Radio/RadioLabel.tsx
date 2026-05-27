import { forwardRef } from 'react'
import { useRadioContext } from './Radio.context'
import {
  cx,
  labelClasses,
  labelSizeClasses,
  requiredAsteriskClasses,
} from './Radio.styles'
import type { RadioLabelProps } from './Radio.types'

export const RadioLabel = forwardRef<HTMLLabelElement, RadioLabelProps>(
  function RadioLabel(props, ref) {
    const ctx = useRadioContext()
    const { htmlFor, className, children, ...rest } = props

    return (
      <label
        ref={ref}
        htmlFor={(htmlFor ?? ctx.id) || undefined}
        data-disabled={ctx.disabled ? 'true' : 'false'}
        className={cx(labelClasses, labelSizeClasses[ctx.size], className)}
        {...rest}
      >
        {children}
        {ctx.required ? (
          <span aria-hidden className={requiredAsteriskClasses}>
            *
          </span>
        ) : null}
      </label>
    )
  },
)

RadioLabel.displayName = 'Radio.Label'
