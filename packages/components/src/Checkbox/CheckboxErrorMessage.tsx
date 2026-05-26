import { forwardRef } from 'react'
import { useCheckboxContext } from './Checkbox.context'
import { cx, errorMessageClasses } from './Checkbox.styles'
import type { CheckboxErrorMessageProps } from './Checkbox.types'

export const CheckboxErrorMessage = forwardRef<
  HTMLParagraphElement,
  CheckboxErrorMessageProps
>(function CheckboxErrorMessage({ id, className, children }, ref) {
  const ctx = useCheckboxContext()
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
})

CheckboxErrorMessage.displayName = 'Checkbox.ErrorMessage'
