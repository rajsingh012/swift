import type { SpinnerSize, SpinnerVariant } from './Spinner.types'

export { cx } from '../internal/cx'

/** Wrapper — inline so the spinner sits on the text baseline. */
export const rootClasses = 'swift-spinner inline-flex items-center gap-2 align-middle'

/** The rotating SVG. `animate-spin` is paused under prefers-reduced-motion
 *  via theme/spinner.css. */
export const svgClasses = 'swift-spinner-svg shrink-0 animate-spin'

export const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
}

export const variantClasses: Record<SpinnerVariant, string> = {
  default: 'text-content-muted',
  brand: 'text-content-brand',
  success: 'text-content-success',
  warning: 'text-content-warning',
  error: 'text-content-critical',
  inverse: 'text-content-inverse',
}

export const labelTextClasses = 'text-sm text-content-muted'
