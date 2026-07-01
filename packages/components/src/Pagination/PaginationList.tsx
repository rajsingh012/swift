import { forwardRef, type HTMLAttributes } from 'react'
import { cx, listClasses } from './Pagination.styles'

export type PaginationListProps = HTMLAttributes<HTMLUListElement>

/**
 * The `<ul>` row that holds the page items and controls when composing a
 * Pagination manually. Applies the same flex layout as the auto-rendered list.
 */
export const PaginationList = forwardRef<HTMLUListElement, PaginationListProps>(
  function PaginationList({ className, children, ...rest }, ref) {
    return (
      <ul ref={ref} className={cx(listClasses, className)} {...rest}>
        {children}
      </ul>
    )
  },
)
PaginationList.displayName = 'Pagination.List'
