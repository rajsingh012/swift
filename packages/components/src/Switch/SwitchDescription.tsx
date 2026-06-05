import { forwardRef } from 'react'
import { useSwitchContext } from './Switch.context'
import { cx, descriptionClasses } from './Switch.styles'
import type { SwitchDescriptionProps } from './Switch.types'

export const SwitchDescription = forwardRef<
  HTMLParagraphElement,
  SwitchDescriptionProps
>(function SwitchDescription({ id, className, children }, ref) {
  const ctx = useSwitchContext()
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

SwitchDescription.displayName = 'Switch.Description'
