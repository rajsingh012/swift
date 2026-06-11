export { cx } from '../internal/cx'

/**
 * Trigger wrapper — only rendered when `asChild` is false. Inline so it
 * doesn't disturb the wrapped content's flow; receives the pointer/focus
 * events the (possibly disabled) child can't.
 */
export const triggerClasses = 'swift-tooltip-trigger inline-flex'

/**
 * Tooltip surface. Visual tokens live in theme/tooltip.css; the Tailwind
 * utilities here only set the positioning context and the z-stratum.
 */
export const contentClasses = 'swift-tooltip-content fixed outline-none'

export const arrowClasses = 'swift-tooltip-arrow'

export const closeClasses =
  'swift-tooltip-close inline-flex shrink-0 items-center justify-center ' +
  'size-4 rounded-sm cursor-pointer outline-none transition-colors ' +
  'opacity-70 hover:opacity-100 ' +
  'focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-current/40'
