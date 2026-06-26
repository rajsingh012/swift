import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { usePaginationContext } from './Pagination.context'
import {
  cx,
  itemBaseClasses,
  sizeClasses,
  variantClasses,
} from './Pagination.styles'

export interface PaginationItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The 1-indexed page this item navigates to. */
  page: number
}

/**
 * A single page-number button. Reads current page / size / variant from the
 * enclosing `<Pagination.Root>` context, marks itself `aria-current="page"`
 * when active, and navigates on click. Renders inside its own `<li>`.
 */
export const PaginationItem = forwardRef<HTMLButtonElement, PaginationItemProps>(
  function PaginationItem({ page, className, onClick, ...rest }, ref) {
    const ctx = usePaginationContext('Pagination.Item')
    const isActive = page === ctx.current
    return (
      <li>
        <button
          ref={ref}
          type="button"
          aria-label={ctx.getItemAriaLabel('page', page)}
          aria-current={isActive ? 'page' : undefined}
          disabled={ctx.disabled}
          onClick={(event) => {
            onClick?.(event)
            if (event.defaultPrevented) return
            ctx.goTo(page)
          }}
          className={cx(
            itemBaseClasses,
            sizeClasses[ctx.size],
            isActive
              ? variantClasses[ctx.variant].active
              : variantClasses[ctx.variant].rest,
            className,
          )}
          {...rest}
        >
          {page}
        </button>
      </li>
    )
  },
)
PaginationItem.displayName = 'Pagination.Item'
