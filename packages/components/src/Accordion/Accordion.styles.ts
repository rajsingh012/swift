export { cx } from '../internal/cx'

export const rootClasses =
  'flex w-full flex-col divide-y divide-stroke overflow-hidden rounded-lg border border-stroke bg-surface-elevated text-content'

export const itemClasses =
  'group/accordion-item flex flex-col data-[disabled]:opacity-60'

export const headerClasses = 'flex'

/**
 * Layered on top of <Button variant="unstyled">. Because the unstyled variant
 * skips all chrome and size classes, the trigger owns its full visual
 * vocabulary here — no `!important` overrides needed.
 *
 * Two layout layers, one per render mode:
 * - Outer: `flex items-center justify-between gap-3` — for render-prop
 *   consumers who render a raw <button> (children are direct).
 * - Inner: `[&>span:first-child]:*` — when Button itself renders, it wraps
 *   children in `<span class="inline-flex items-center">`, so we restate the
 *   layout one level deeper. With one direct child (the wrapper span), the
 *   outer justify-between is a no-op; the inner one does the work.
 */
export const triggerClasses =
  'w-full flex items-center justify-between gap-3 px-5 py-4 ' +
  'text-left text-base font-semibold leading-normal whitespace-normal ' +
  'hover:not-disabled:bg-surface-muted ' +
  'focus-visible:bg-surface-muted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-stroke-brand ' +
  '[&>span:first-child]:w-full [&>span:first-child]:justify-between [&>span:first-child]:gap-3'

export const contentClasses = 'swift-accordion-content text-content'

export const contentInnerClasses =
  'swift-accordion-content__inner px-5 pb-4 text-content'
