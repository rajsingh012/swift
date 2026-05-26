import { forwardRef } from 'react'
import { useInputContext } from './Input.context'
import { cx, helperTextClasses } from './Input.styles'
import type { InputHelperTextProps } from './Input.types'

export const InputHelperText = forwardRef<HTMLParagraphElement, InputHelperTextProps>(
  function InputHelperText({ id, className, children }, ref) {
    const ctx = useInputContext()
    return (
      <p
        ref={ref}
        id={(id ?? ctx.helperTextId) || undefined}
        className={cx(helperTextClasses, className)}
      >
        {children}
      </p>
    )
  },
)

InputHelperText.displayName = 'Input.HelperText'
