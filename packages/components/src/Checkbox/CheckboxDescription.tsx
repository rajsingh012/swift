import { forwardRef } from 'react'
import { useCheckboxContext } from './Checkbox.context'
import { cx, descriptionClasses } from './Checkbox.styles'
import type { CheckboxDescriptionProps } from './Checkbox.types'

export const CheckboxDescription = forwardRef<
  HTMLParagraphElement,
  CheckboxDescriptionProps
>(function CheckboxDescription({ id, className, children }, ref) {
  const ctx = useCheckboxContext()
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

CheckboxDescription.displayName = 'Checkbox.Description'
