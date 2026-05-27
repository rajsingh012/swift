import { forwardRef } from 'react'
import { headerClasses } from './Sheet.styles'
import type { SheetHeaderProps } from './Sheet.types'
import { cx } from './Sheet.utils'

export const SheetHeader = forwardRef<HTMLDivElement, SheetHeaderProps>(
  function SheetHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(headerClasses, className)} {...rest} />
  },
)
SheetHeader.displayName = 'Sheet.Header'
