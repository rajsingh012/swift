import { forwardRef } from 'react'
import { footerClasses } from './Sheet.styles'
import type { SheetFooterProps } from './Sheet.types'
import { cx } from './Sheet.utils'

export const SheetFooter = forwardRef<HTMLDivElement, SheetFooterProps>(
  function SheetFooter({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(footerClasses, className)} {...rest} />
  },
)
SheetFooter.displayName = 'Sheet.Footer'
