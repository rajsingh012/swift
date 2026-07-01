import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { usePaginationContext } from './Pagination.context'
import {
  cx,
  itemBaseClasses,
  sizeClasses,
  variantClasses,
} from './Pagination.styles'

export interface PaginationNextProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Override the default chevron glyph. */
  children?: ReactNode
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * "Next page" control. Disabled on the last page, navigates forward on click.
 * Reads state from the enclosing `<Pagination.Root>`. Renders inside its own
 * `<li>`.
 */
export const PaginationNext = forwardRef<
  HTMLButtonElement,
  PaginationNextProps
>(function PaginationNext({ className, children, onClick, ...rest }, ref) {
  const ctx = usePaginationContext('Pagination.Next')
  const isDisabled = ctx.disabled || ctx.isLast
  return (
    <li>
      <button
        ref={ref}
        type="button"
        aria-label={ctx.getItemAriaLabel('next')}
        disabled={isDisabled}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented) return
          ctx.goTo(ctx.current + 1)
        }}
        className={cx(
          itemBaseClasses,
          sizeClasses[ctx.size],
          variantClasses[ctx.variant].rest,
          className,
        )}
        {...rest}
      >
        {children ?? <ChevronRight />}
      </button>
    </li>
  )
})
PaginationNext.displayName = 'Pagination.Next'
