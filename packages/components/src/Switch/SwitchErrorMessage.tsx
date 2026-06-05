import { forwardRef } from 'react'
import { useSwitchContext } from './Switch.context'
import { cx, errorMessageClasses } from './Switch.styles'
import type { SwitchErrorMessageProps } from './Switch.types'

export const SwitchErrorMessage = forwardRef<
  HTMLParagraphElement,
  SwitchErrorMessageProps
>(function SwitchErrorMessage({ id, className, children }, ref) {
  const ctx = useSwitchContext()
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

SwitchErrorMessage.displayName = 'Switch.ErrorMessage'
