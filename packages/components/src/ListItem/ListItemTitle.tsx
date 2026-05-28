import { createElement, forwardRef } from 'react'
import { useListItemContext } from './ListItem.context'
import {
  cx,
  titleClasses,
  titleSizeClasses,
  truncateClasses,
} from './ListItem.styles'
import type { ListItemTitleProps } from './ListItem.types'

/**
 * Primary text. Defaults to `truncate` on a single line — list cells
 * with unbounded titles routinely break their containing layout, so
 * the safe default is to clip with ellipsis. Pass `truncate={false}`
 * to allow wrapping.
 */
export const ListItemTitle = forwardRef<HTMLElement, ListItemTitleProps>(
  function ListItemTitle(
    { as = 'span', className, truncate = true, ...rest },
    ref,
  ) {
    const { size } = useListItemContext()
    return createElement(as, {
      ref,
      'data-slot': 'title',
      className: cx(
        titleClasses,
        titleSizeClasses[size],
        truncate && truncateClasses,
        className,
      ),
      ...rest,
    })
  },
)
ListItemTitle.displayName = 'ListItem.Title'
