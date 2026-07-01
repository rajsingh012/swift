import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { usePaginationContext } from './Pagination.context'
import { cx, ellipsisClasses, sizeClasses } from './Pagination.styles'

export interface PaginationEllipsisProps
  extends HTMLAttributes<HTMLSpanElement> {
  /** Override the default ellipsis glyph. */
  children?: ReactNode
}

function EllipsisGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  )
}

/**
 * A non-interactive gap standing in for collapsed page numbers. Marked
 * `aria-hidden` on its `<li>` since it carries no navigational meaning.
 */
export const PaginationEllipsis = forwardRef<
  HTMLSpanElement,
  PaginationEllipsisProps
>(function PaginationEllipsis({ className, children, ...rest }, ref) {
  const ctx = usePaginationContext('Pagination.Ellipsis')
  return (
    <li aria-hidden="true">
      <span
        ref={ref}
        className={cx(ellipsisClasses, sizeClasses[ctx.size], className)}
        {...rest}
      >
        {children ?? <EllipsisGlyph />}
      </span>
    </li>
  )
})
PaginationEllipsis.displayName = 'Pagination.Ellipsis'
