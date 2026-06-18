export { cx } from '../internal/cx'

/** Positioning context + z-stratum; visual chrome in theme/popover.css. */
export const contentClasses = 'swift-popover-content fixed outline-none'

export const arrowClasses = 'swift-popover-arrow'

export const closeButtonClasses =
  'swift-popover-close absolute right-2 top-2 inline-flex size-7 cursor-pointer ' +
  'items-center justify-center rounded-md text-content-muted transition-colors ' +
  'hover:bg-surface-muted hover:text-content-strong ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-brand'
