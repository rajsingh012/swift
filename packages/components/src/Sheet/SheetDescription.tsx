import { forwardRef, useEffect } from 'react'
import { useSheet } from './Sheet.context'
import { descriptionClasses } from './Sheet.styles'
import type { SheetDescriptionProps } from './Sheet.types'
import { cx } from './Sheet.utils'

export const SheetDescription = forwardRef<
  HTMLParagraphElement,
  SheetDescriptionProps
>(function SheetDescription({ className, ...rest }, ref) {
  const { descriptionId, setHasDescription } = useSheet('Sheet.Description')

  // Tell Content a description exists so aria-describedby points here.
  useEffect(() => {
    setHasDescription(true)
    return () => setHasDescription(false)
  }, [setHasDescription])

  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cx(descriptionClasses, className)}
      {...rest}
    />
  )
})
SheetDescription.displayName = 'Sheet.Description'
