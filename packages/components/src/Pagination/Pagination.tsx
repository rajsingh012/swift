import { forwardRef, useMemo, type ReactNode } from 'react'
import {
  DEFAULT_BOUNDARY_COUNT,
  DEFAULT_SIBLING_COUNT,
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
} from './Pagination.constants'
import {
  cx,
  ellipsisClasses,
  itemBaseClasses,
  listClasses,
  rootClasses,
  sizeClasses,
  variantClasses,
} from './Pagination.styles'
import type { PaginationProps } from './Pagination.types'
import { getPaginationRange, useControllableState } from './Pagination.utils'

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function DoubleChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 18l-6-6 6-6M12 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function DoubleChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l6 6-6 6M12 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function EllipsisGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  )
}

function defaultItemLabel(
  type: 'page' | 'prev' | 'next' | 'first' | 'last',
  page?: number,
): string {
  switch (type) {
    case 'page':
      return `Go to page ${page}`
    case 'prev':
      return 'Go to previous page'
    case 'next':
      return 'Go to next page'
    case 'first':
      return 'Go to first page'
    case 'last':
      return 'Go to last page'
  }
}

/**
 * Page navigation for paginated content. Renders a `<nav>` landmark wrapping a
 * row of page buttons with collision-aware ellipsis gaps, plus optional
 * prev/next and first/last controls.
 *
 *   <Pagination count={20} defaultPage={1} onPageChange={setPage} />
 *
 * Controlled/uncontrolled via `page`/`defaultPage`/`onPageChange`.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  function Pagination(props, ref) {
    const {
      count,
      page: pageProp,
      defaultPage = 1,
      onPageChange,
      siblingCount = DEFAULT_SIBLING_COUNT,
      boundaryCount = DEFAULT_BOUNDARY_COUNT,
      size = DEFAULT_SIZE,
      variant = DEFAULT_VARIANT,
      disabled = false,
      showPrevNext = true,
      showFirstLast = false,
      'aria-label': ariaLabel = 'Pagination',
      getItemAriaLabel = defaultItemLabel,
      classes,
      prevIcon,
      nextIcon,
      firstIcon,
      lastIcon,
      className,
      ...rest
    } = props

    const [page, setPage] = useControllableState(pageProp, defaultPage, onPageChange)

    // Keep the active page within [1, count].
    const current = Math.min(Math.max(page, 1), Math.max(count, 1))

    const items = useMemo(
      () => getPaginationRange(count, current, siblingCount, boundaryCount),
      [count, current, siblingCount, boundaryCount],
    )

    const goTo = (next: number) => {
      if (disabled) return
      const clamped = Math.min(Math.max(next, 1), count)
      if (clamped !== current) setPage(clamped)
    }

    const isFirst = current <= 1
    const isLast = current >= count

    const controlClass = cx(itemBaseClasses, sizeClasses[size], variantClasses[variant].rest)

    const renderControl = (
      key: string,
      label: string,
      glyph: ReactNode,
      targetPage: number,
      isDisabled: boolean,
      slotClass?: string,
    ) => (
      <li key={key}>
        <button
          type="button"
          aria-label={label}
          disabled={disabled || isDisabled}
          onClick={() => goTo(targetPage)}
          className={cx(controlClass, slotClass)}
        >
          {glyph}
        </button>
      </li>
    )

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        data-size={size}
        data-variant={variant}
        className={cx(rootClasses, className, classes?.root)}
        {...rest}
      >
        <ul className={cx(listClasses, classes?.list)}>
          {showFirstLast
            ? renderControl(
                'first',
                getItemAriaLabel('first'),
                firstIcon ?? <DoubleChevronLeft />,
                1,
                isFirst,
                classes?.prev,
              )
            : null}

          {showPrevNext
            ? renderControl(
                'prev',
                getItemAriaLabel('prev'),
                prevIcon ?? <ChevronLeft />,
                current - 1,
                isFirst,
                classes?.prev,
              )
            : null}

          {items.map((item) => {
            if (item.type === 'ellipsis') {
              return (
                <li key={item.key} aria-hidden="true">
                  <span
                    className={cx(ellipsisClasses, sizeClasses[size], classes?.ellipsis)}
                  >
                    <EllipsisGlyph />
                  </span>
                </li>
              )
            }
            const isActive = item.page === current
            return (
              <li key={`page-${item.page}`}>
                <button
                  type="button"
                  aria-label={getItemAriaLabel('page', item.page)}
                  aria-current={isActive ? 'page' : undefined}
                  disabled={disabled}
                  onClick={() => goTo(item.page)}
                  className={cx(
                    itemBaseClasses,
                    sizeClasses[size],
                    isActive
                      ? variantClasses[variant].active
                      : variantClasses[variant].rest,
                    classes?.item,
                  )}
                >
                  {item.page}
                </button>
              </li>
            )
          })}

          {showPrevNext
            ? renderControl(
                'next',
                getItemAriaLabel('next'),
                nextIcon ?? <ChevronRight />,
                current + 1,
                isLast,
                classes?.next,
              )
            : null}

          {showFirstLast
            ? renderControl(
                'last',
                getItemAriaLabel('last'),
                lastIcon ?? <DoubleChevronRight />,
                count,
                isLast,
                classes?.next,
              )
            : null}
        </ul>
      </nav>
    )
  },
)
Pagination.displayName = 'Pagination'
