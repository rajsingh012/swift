import { forwardRef } from 'react'
import { useInputContext } from './Input.context'
import {
  cx,
  labelClasses,
  requiredAsteriskClasses,
} from './Input.styles'
import type { InputLabelProps } from './Input.types'

export const InputLabel = forwardRef<HTMLLabelElement, InputLabelProps>(
  function InputLabel(props, ref) {
    const ctx = useInputContext()
    const { htmlFor, className, children, ...rest } = props

    return (
      <label
        ref={ref}
        htmlFor={(htmlFor ?? ctx.id) || undefined}
        data-disabled={ctx.disabled || undefined}
        className={cx(
          labelClasses(
            ctx.labelPlacement,
            ctx.variant,
            ctx.state,
            ctx.invalid,
            ctx.size,
            ctx.hasStartAdornment,
          ),
          className,
        )}
        {...rest}
      >
        {children}
        {ctx.required ? (
          <span aria-hidden className={requiredAsteriskClasses}>
            {' *'}
          </span>
        ) : null}
      </label>
    )
  },
)

InputLabel.displayName = 'Input.Label'
