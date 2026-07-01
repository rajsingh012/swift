import type { SkeletonAnimation, SkeletonVariant } from './Skeleton.types'

export { cx } from '../internal/cx'

/**
 * Base placeholder block. Colour + the wave/pulse keyframes live in
 * theme/skeleton.css (driven by `data-animation`), so this string only
 * carries the structural class anchor and block display.
 */
export const baseClasses = 'swift-skeleton block'

/** Multi-line text wrapper. */
export const groupClasses = 'swift-skeleton-group flex w-full flex-col gap-2'

export const variantClasses: Record<SkeletonVariant, string> = {
  // Text lines take their height from the current line-height / font-size
  // unless an explicit height is given.
  text: 'rounded-sm',
  rect: 'rounded-none',
  rounded: 'rounded-lg',
  circle: 'rounded-full',
}

export const animationClasses: Record<SkeletonAnimation, string> = {
  pulse: 'swift-skeleton--pulse',
  wave: 'swift-skeleton--wave',
  none: '',
}
