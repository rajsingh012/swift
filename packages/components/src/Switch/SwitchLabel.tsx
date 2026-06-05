import { forwardRef } from 'react'
import { Slot } from '../internal/Slot'
import { useSwitchContext } from './Switch.context'
import {
  cx,
  labelClasses,
  labelSizeClasses,
  requiredAsteriskClasses,
} from './Switch.styles'
import type { SwitchLabelProps } from './Switch.types'

export const SwitchLabel = forwardRef<HTMLLabelElement, SwitchLabelProps>(
  function SwitchLabel(props, ref) {
    const ctx = useSwitchContext()
    const { htmlFor, className, children, asChild = false, ...rest } = props

    const labelProps = {
      htmlFor: (htmlFor ?? ctx.id) || undefined,
      'data-disabled': ctx.disabled ? 'true' : 'false',
      className: cx(labelClasses, labelSizeClasses[ctx.size], className),
      ...rest,
    }

    if (asChild) {
      // Consumer element owns its own children — the auto-appended
      // asterisk is dropped because Slot uses Children.only and can't
      // splice in an extra node. Required marking becomes the
      // consumer's responsibility here.
      return (
        <Slot ref={ref} {...labelProps}>
          {children}
        </Slot>
      )
    }

    return (
      <label ref={ref} {...labelProps}>
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

SwitchLabel.displayName = 'Switch.Label'
