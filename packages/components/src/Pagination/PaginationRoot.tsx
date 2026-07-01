import { forwardRef, useMemo, type ReactNode } from 'react'
import {
  DEFAULT_BOUNDARY_COUNT,
  DEFAULT_SIBLING_COUNT,
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
} from './Pagination.constants'
import {
  PaginationContext,
  type PaginationContextValue,
} from './Pagination.context'
import {
  cx,
  ellipsisClasses,
  itemBaseClasses,
  listClasses,
  rootClasses,
  sizeClasses,
  variantClasses,
} from './Pagination.styles'
import type {
  PaginationControl,
  PaginationProps,
} from './Pagination.types'
import { resolveRenderProp } from '../internal/props'
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

/** Stable no-op for the ellipsis slot's `goTo` (nowhere to navigate). */
function noop() {
  /* ellipsis has no target page */
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
 * Or compose the parts explicitly for full control:
 *
 *   <Pagination.Root count={20}>
 *     <Pagination.List>
 *       <Pagination.Previous />
 *       <Pagination.Item page={1} />
 *       <Pagination.Ellipsis />
 *       <Pagination.Next />
 *     </Pagination.List>
 *   </Pagination.Root>
 *
 * Controlled/uncontrolled via `page`/`defaultPage`/`onPageChange`.
 */
export const PaginationRoot = forwardRef<HTMLElement, PaginationProps>(
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
      renderItem,
      renderControl,
      children,
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

    const ctx = useMemo<PaginationContextValue>(
      () => ({
        current,
        count,
        size,
        variant,
        disabled,
        isFirst,
        isLast,
        goTo,
        getItemAriaLabel,
      }),
      // goTo/getItemAriaLabel are stable enough for this component's usage;
      // recreate when the values they close over change.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [current, count, size, variant, disabled, isFirst, isLast, getItemAriaLabel],
    )

    const controlClass = cx(itemBaseClasses, sizeClasses[size], variantClasses[variant].rest)

    const renderControlSlot = (
      control: PaginationControl,
      glyph: ReactNode,
      targetPage: number,
      isDisabled: boolean,
      slotClass?: string,
    ) => {
      const controlDisabled = disabled || isDisabled
      // render* convention: hand the consumer the control's state and let
      // them build their own button, superseding the default + *Icon props.
      const custom = resolveRenderProp(renderControl, {
        control,
        page: targetPage,
        disabled: controlDisabled,
        goTo: () => goTo(targetPage),
      })
      return (
        <li key={control}>
          {custom !== undefined ? (
            custom
          ) : (
            <button
              type="button"
              aria-label={getItemAriaLabel(control)}
              disabled={controlDisabled}
              onClick={() => goTo(targetPage)}
              className={cx(controlClass, slotClass)}
            >
              {glyph}
            </button>
          )}
        </li>
      )
    }

    return (
      <PaginationContext.Provider value={ctx}>
        <nav
          ref={ref}
          aria-label={ariaLabel}
          data-size={size}
          data-variant={variant}
          className={cx(rootClasses, className, classes?.root)}
          {...rest}
        >
          {children !== undefined ? (
            children
          ) : (
            <ul className={cx(listClasses, classes?.list)}>
              {showFirstLast
                ? renderControlSlot(
                    'first',
                    firstIcon ?? <DoubleChevronLeft />,
                    1,
                    isFirst,
                    classes?.prev,
                  )
                : null}

              {showPrevNext
                ? renderControlSlot(
                    'prev',
                    prevIcon ?? <ChevronLeft />,
                    current - 1,
                    isFirst,
                    classes?.prev,
                  )
                : null}

              {items.map((item) => {
                if (item.type === 'ellipsis') {
                  const customEllipsis = resolveRenderProp(renderItem, {
                    type: 'ellipsis',
                    selected: false,
                    disabled,
                    goTo: noop,
                  })
                  return (
                    <li key={item.key} aria-hidden="true">
                      {customEllipsis !== undefined ? (
                        customEllipsis
                      ) : (
                        <span
                          className={cx(ellipsisClasses, sizeClasses[size], classes?.ellipsis)}
                        >
                          <EllipsisGlyph />
                        </span>
                      )}
                    </li>
                  )
                }
                const isActive = item.page === current
                const customItem = resolveRenderProp(renderItem, {
                  type: 'page',
                  page: item.page,
                  selected: isActive,
                  disabled,
                  goTo: () => goTo(item.page),
                })
                return (
                  <li key={`page-${item.page}`}>
                    {customItem !== undefined ? (
                      customItem
                    ) : (
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
                    )}
                  </li>
                )
              })}

              {showPrevNext
                ? renderControlSlot(
                    'next',
                    nextIcon ?? <ChevronRight />,
                    current + 1,
                    isLast,
                    classes?.next,
                  )
                : null}

              {showFirstLast
                ? renderControlSlot(
                    'last',
                    lastIcon ?? <DoubleChevronRight />,
                    count,
                    isLast,
                    classes?.next,
                  )
                : null}
            </ul>
          )}
        </nav>
      </PaginationContext.Provider>
    )
  },
)
PaginationRoot.displayName = 'Pagination'
