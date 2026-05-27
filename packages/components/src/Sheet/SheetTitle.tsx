import { forwardRef, useEffect } from 'react'
import { useSheet } from './Sheet.context'
import { titleClasses } from './Sheet.styles'
import type { SheetTitleProps } from './Sheet.types'
import { cx } from './Sheet.utils'

export const SheetTitle = forwardRef<HTMLHeadingElement, SheetTitleProps>(
  function SheetTitle({ as: Tag = 'h2', className, ...rest }, ref) {
    const { titleId, setHasTitle } = useSheet('Sheet.Title')

    // Tell Content a title exists so it wires aria-labelledby to this id.
    useEffect(() => {
      setHasTitle(true)
      return () => setHasTitle(false)
    }, [setHasTitle])

    return (
      <Tag
        ref={ref}
        id={titleId}
        className={cx(titleClasses, className)}
        {...rest}
      />
    )
  },
)
SheetTitle.displayName = 'Sheet.Title'
