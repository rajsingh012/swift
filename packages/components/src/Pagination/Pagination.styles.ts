import type { PaginationSize, PaginationVariant } from './Pagination.types'

export { cx } from '../internal/cx'

export const rootClasses = 'swift-pagination'

export const listClasses = 'flex flex-wrap items-center gap-1'

export const sizeClasses: Record<PaginationSize, string> = {
  sm: 'h-8 min-w-8 px-2 text-sm [&_svg]:size-4',
  md: 'h-9 min-w-9 px-2.5 text-sm [&_svg]:size-4',
  lg: 'h-10 min-w-10 px-3 text-base [&_svg]:size-5',
}

/** Shared button chrome — layout, focus ring, disabled. */
export const itemBaseClasses =
  'inline-flex items-center justify-center shrink-0 select-none ' +
  'rounded-md font-medium tabular-nums cursor-pointer transition-colors outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-40'

/**
 * Per-variant chrome, split into the resting state and the
 * current-page (`aria-current="page"`) state.
 */
export const variantClasses: Record<
  PaginationVariant,
  { rest: string; active: string }
> = {
  solid: {
    rest: 'text-content hover:not-disabled:bg-surface-muted',
    active: 'bg-surface-brand text-content-on-brand hover:bg-surface-brand',
  },
  outline: {
    rest: 'border border-stroke text-content hover:not-disabled:bg-surface-muted',
    active: 'border border-stroke-brand bg-surface-brand-muted text-content-brand',
  },
  ghost: {
    rest: 'text-content hover:not-disabled:bg-surface-muted',
    active: 'bg-surface-brand-muted text-content-brand',
  },
}

export const ellipsisClasses =
  'inline-flex items-center justify-center shrink-0 text-content-muted select-none'
