import { forwardRef } from 'react'
import { bodyClasses } from './Sheet.styles'
import type { SheetBodyProps } from './Sheet.types'
import { cx } from './Sheet.utils'

export const SheetBody = forwardRef<HTMLDivElement, SheetBodyProps>(
  function SheetBody({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(bodyClasses, className)} {...rest} />
  },
)
SheetBody.displayName = 'Sheet.Body'
