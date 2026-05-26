import { forwardRef } from 'react'
import { useInputContext } from './Input.context'
import { cx, errorMessageClasses } from './Input.styles'
import type { InputErrorMessageProps } from './Input.types'

export const InputErrorMessage = forwardRef<HTMLParagraphElement, InputErrorMessageProps>(
  function InputErrorMessage({ id, className, children }, ref) {
    const ctx = useInputContext()
    return (
      <p
        ref={ref}
        id={(id ?? ctx.errorMessageId) || undefined}
        role="alert"
        aria-live="polite"
        className={cx(errorMessageClasses, className)}
      >
        {children}
      </p>
    )
  },
)

InputErrorMessage.displayName = 'Input.ErrorMessage'
