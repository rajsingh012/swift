import { forwardRef } from 'react'
import { useRadioContext } from './Radio.context'
import { cx, errorMessageClasses } from './Radio.styles'
import type { RadioErrorMessageProps } from './Radio.types'

export const RadioErrorMessage = forwardRef<
  HTMLParagraphElement,
  RadioErrorMessageProps
>(function RadioErrorMessage({ id, className, children }, ref) {
  const ctx = useRadioContext()
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

RadioErrorMessage.displayName = 'Radio.ErrorMessage'
