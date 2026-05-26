import { forwardRef } from 'react'
import { useCheckboxContext } from './Checkbox.context'
import {
  cx,
  labelClasses,
  labelSizeClasses,
  requiredAsteriskClasses,
} from './Checkbox.styles'
import type { CheckboxLabelProps } from './Checkbox.types'

export const CheckboxLabel = forwardRef<HTMLLabelElement, CheckboxLabelProps>(
  function CheckboxLabel(props, ref) {
    const ctx = useCheckboxContext()
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

CheckboxLabel.displayName = 'Checkbox.Label'
