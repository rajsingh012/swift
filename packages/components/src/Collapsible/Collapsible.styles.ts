export { cx } from '../internal/cx'

export const rootClasses = 'swift-collapsible flex flex-col'

export const triggerClasses =
  'swift-collapsible-trigger inline-flex cursor-pointer items-center gap-2 ' +
  'outline-none disabled:cursor-not-allowed disabled:opacity-60 ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand focus-visible:ring-offset-2 rounded-sm'

/**
 * Content uses the same grid-rows 0fr↔1fr height animation as Accordion
 * (see theme/collapsible.css). The inner wrapper carries the real content
 * and is what gets measured.
 */
export const contentClasses = 'swift-collapsible-content text-content'
export const contentInnerClasses = 'swift-collapsible-content__inner min-h-0 overflow-hidden'
