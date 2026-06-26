import { forwardRef } from 'react'
import type { ButtonLabelProps } from './Button.types'

/**
 * Text content of a Button. Optional — `<Button>Save</Button>` still works —
 * but wrapping the label lets you target it with `className` and keeps the
 * markup explicit when composing with icons.
 */
export const ButtonLabel = forwardRef<HTMLSpanElement, ButtonLabelProps>(
  function ButtonLabel({ className, children, ...rest }, ref) {
    return (
      <span ref={ref} className={className} {...rest}>
        {children}
      </span>
    )
  },
)
ButtonLabel.displayName = 'Button.Label'
