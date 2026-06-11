import type { CardRadius, CardSize, CardVariant } from './Card.types'

/**
 * Structural classes shared by every Card — block flow, theme tokens,
 * disabled behaviour. Padding is intentionally left off the root so
 * Header / Content / Footer / Media slots can lay themselves out and
 * media can run flush to the edge.
 */
export const baseClasses =
  'relative block overflow-hidden text-content transition-colors outline-none ' +
  'aria-disabled:opacity-60 aria-disabled:cursor-not-allowed'

export const variantClasses: Record<CardVariant, string> = {
  elevated: 'bg-surface-elevated shadow-level1',
  outlined: 'bg-surface-elevated border border-stroke',
  filled: 'bg-surface-muted',
  ghost: 'bg-transparent',
}

export const radiusClasses: Record<CardRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
}

/**
 * Padding presets per size. Applied by the slot components (Header /
 * Content / Footer / Actions), not the root. Each slot consults the
 * Card size via context — so `<Card size="lg">` cascades to every
 * compound part without prop-drilling.
 */
export const paddingXClasses: Record<CardSize, string> = {
  sm: 'px-4',
  md: 'px-5',
  lg: 'px-6',
}

export const paddingYClasses: Record<CardSize, string> = {
  sm: 'py-3',
  md: 'py-4',
  lg: 'py-5',
}

export const contentPaddingYClasses: Record<CardSize, string> = {
  sm: 'py-4',
  md: 'py-5',
  lg: 'py-6',
}

/**
 * Hover + focus chrome for `clickable`. Lifts the shadow on elevated
 * cards; tints the surface for everything else. The focus ring uses
 * the same token the Button does, so keyboard focus is consistent.
 */
export const clickableChromeClasses =
  'cursor-pointer ' +
  'hover:not-disabled:bg-surface-muted ' +
  'data-[variant=elevated]:hover:not-disabled:shadow-level2 data-[variant=elevated]:hover:not-disabled:bg-surface-elevated ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand focus-visible:ring-offset-2'

export const titleSizeClasses: Record<CardSize, string> = {
  sm: 'text-sm font-semibold text-content-strong',
  md: 'text-base font-semibold text-content-strong',
  lg: 'text-lg font-semibold text-content-strong',
}

export const descriptionSizeClasses: Record<CardSize, string> = {
  sm: 'text-xs text-content-muted',
  md: 'text-sm text-content-muted',
  lg: 'text-sm text-content-muted',
}

export { cx } from '../internal/cx'
