import { forwardRef } from 'react'
import { contentClasses, cx } from './ListItem.styles'
import type { ListItemContentProps } from './ListItem.types'

/**
 * The middle slot. `min-w-0` lets children opt into text truncation
 * without the row pushing past its container — without it, a long
 * title would force the leading + trailing slots off-screen.
 */
export const ListItemContent = forwardRef<HTMLDivElement, ListItemContentProps>(
  function ListItemContent({ className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        data-slot="content"
        className={cx(contentClasses, className)}
        {...rest}
      />
    )
  },
)
ListItemContent.displayName = 'ListItem.Content'
