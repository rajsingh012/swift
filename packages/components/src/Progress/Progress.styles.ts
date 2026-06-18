import type { ProgressSize, ProgressVariant } from './Progress.types'

export { cx } from '../internal/cx'

/** Outer wrapper holds the optional label row above the track. */
export const rootClasses = 'swift-progress flex w-full flex-col gap-1.5'

/** Label row: label on the left, value readout on the right. */
export const headerClasses =
  'flex items-center justify-between gap-2 text-sm text-content-strong'

export const labelClasses = 'font-medium text-content-strong'
export const valueClasses = 'tabular-nums text-content-muted'

/** The rail. `overflow-hidden` clips the indicator's rounded ends + sheen. */
export const trackClasses =
  'swift-progress-track relative w-full overflow-hidden rounded-full bg-[var(--progress-track-bg)]'

export const trackSizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

/**
 * The filled portion. Width is driven by an inline `--progress-percent`
 * style; the determinate transition + the indeterminate slide animation
 * live in theme/progress.css (keyed off `data-state`).
 */
export const indicatorClasses =
  'swift-progress-indicator h-full rounded-full'

/**
 * Indicator fill colour. Applied directly with semantic bg utilities (rather
 * than a custom-property indirection) so the fill is always painted — an
 * unset CSS var would render transparent and the bar would look empty.
 */
export const variantClasses: Record<ProgressVariant, string> = {
  brand: 'bg-surface-brand',
  success: 'bg-surface-success',
  warning: 'bg-surface-warning',
  error: 'bg-surface-critical',
}
