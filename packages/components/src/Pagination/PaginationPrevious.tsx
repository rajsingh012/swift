import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { usePaginationContext } from './Pagination.context'
import {
  cx,
  itemBaseClasses,
  sizeClasses,
  variantClasses,
} from './Pagination.styles'

export interface PaginationPreviousProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Override the default chevron glyph. */
  children?: ReactNode
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * "Previous page" control. Disabled on the first page, navigates back on
 * click. Reads state from the enclosing `<Pagination.Root>`. Renders inside
 * its own `<li>`.
 */
export const PaginationPrevious = forwardRef<
  HTMLButtonElement,
  PaginationPreviousProps
>(function PaginationPrevious({ className, children, onClick, ...rest }, ref) {
  const ctx = usePaginationContext('Pagination.Previous')
  const isDisabled = ctx.disabled || ctx.isFirst
  return (
    <li>
      <button
        ref={ref}
        type="button"
        aria-label={ctx.getItemAriaLabel('prev')}
        disabled={isDisabled}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented) return
          ctx.goTo(ctx.current - 1)
        }}
        className={cx(
          itemBaseClasses,
          sizeClasses[ctx.size],
          variantClasses[ctx.variant].rest,
          className,
        )}
        {...rest}
      >
        {children ?? <ChevronLeft />}
      </button>
    </li>
  )
})
PaginationPrevious.displayName = 'Pagination.Previous'
