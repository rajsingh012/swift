import { createElement, forwardRef, useMemo } from 'react'
import { ListContext, type ListContextValue } from './ListItem.context'
import {
  cx,
  listBaseClasses,
  listDividerClasses,
  listVariantClasses,
} from './ListItem.styles'
import type { ListProps } from './ListItem.types'

/**
 * Optional container that cascades `size` / `density` to every child
 * row and (optionally) renders dividers between siblings. Rendering as
 * `<ul>` by default gives screen readers the right structural cue;
 * children that aren't `<li>` still work because the row reads
 * `role="button"` when clickable.
 */
export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  {
    as = 'ul',
    className,
    dividers = false,
    variant = 'plain',
    size,
    density,
    children,
    ...rest
  },
  ref,
) {
  const ctx = useMemo<ListContextValue>(
    () => ({ size, density, dividers }),
    [size, density, dividers],
  )

  return (
    <ListContext.Provider value={ctx}>
      {createElement(
        as,
        {
          ref,
          role: as === 'div' ? 'list' : undefined,
          className: cx(
            listBaseClasses,
            listVariantClasses[variant],
            dividers && listDividerClasses,
            className,
          ),
          'data-variant': variant,
          ...rest,
        },
        children,
      )}
    </ListContext.Provider>
  )
})
List.displayName = 'List'
