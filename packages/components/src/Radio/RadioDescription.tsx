import { forwardRef } from 'react'
import { useRadioContext } from './Radio.context'
import { cx, descriptionClasses } from './Radio.styles'
import type { RadioDescriptionProps } from './Radio.types'

export const RadioDescription = forwardRef<
  HTMLParagraphElement,
  RadioDescriptionProps
>(function RadioDescription({ id, className, children }, ref) {
  const ctx = useRadioContext()
  return (
    <p
      ref={ref}
      id={(id ?? ctx.descriptionId) || undefined}
      data-disabled={ctx.disabled ? 'true' : 'false'}
      className={cx(descriptionClasses, className)}
    >
      {children}
    </p>
  )
})

RadioDescription.displayName = 'Radio.Description'
