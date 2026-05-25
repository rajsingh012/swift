import type {
  BadgeAppearance,
  BadgeRadius,
  BadgeSize,
  BadgeVariant,
} from './Badge.types'

/**
 * Structural classes shared by every Badge — layout, focus, disabled
 * handling, transition. No visual chrome (colour, radius, padding) so the
 * appearance × variant × size layers can compose freely on top.
 */
export const baseClasses =
  'relative inline-flex items-center justify-center select-none whitespace-nowrap ' +
  'font-medium leading-none align-middle transition-colors outline-none ' +
  'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed ' +
  'data-[clickable=true]:cursor-pointer ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand focus-visible:ring-offset-2'

/**
 * Fixed-height sizing. Heights mirror the spec (20 / 24 / 28 px) and were
 * picked so a Badge sits cleanly inline next to body-md text.
 */
export const sizeClasses: Record<BadgeSize, string> = {
  sm: 'h-5 px-1.5 text-[11px] gap-1',
  md: 'h-6 px-2 text-xs gap-1',
  lg: 'h-7 px-2.5 text-sm gap-1.5',
}

/**
 * Dot-only mode (status / count-less dot badge). Forces a square aspect
 * ratio and drops horizontal padding entirely.
 */
export const dotOnlySizeClasses: Record<BadgeSize, string> = {
  sm: 'h-2 w-2 p-0',
  md: 'h-2.5 w-2.5 p-0',
  lg: 'h-3 w-3 p-0',
}

export const radiusClasses: Record<BadgeRadius, string> = {
  sm: 'rounded',
  md: 'rounded-md',
  full: 'rounded-full',
}

/**
 * The leading-coloured-dot decoration when `dot` is true. Sizes are tuned
 * to feel optically balanced against the badge text at each size.
 */
export const decorativeDotSizeClasses: Record<BadgeSize, string> = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-2 w-2',
}

export const iconSizeClasses: Record<BadgeSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
}

export const removeButtonSizeClasses: Record<BadgeSize, string> = {
  sm: 'h-3 w-3 -mr-0.5',
  md: 'h-3.5 w-3.5 -mr-0.5',
  lg: 'h-4 w-4 -mr-1',
}

/**
 * Visual styling per (appearance × variant). Kept as a flat lookup so a
 * caller can reason about every combination at a glance — and so dark
 * mode "just works" via the semantic tokens used in each class.
 *
 * `default` uses the neutral palette; `error` maps onto the `critical`
 * palette; `info` onto `highlight` — these are the project's existing
 * semantic colours, so a dark theme overrides them centrally.
 */
type AppearanceVariantMap = Record<
  BadgeAppearance,
  Record<BadgeVariant, string>
>

export const appearanceVariantClasses: AppearanceVariantMap = {
  solid: {
    default: 'bg-surface-inverse text-content-inverse',
    success: 'bg-surface-success text-content-on-brand',
    warning: 'bg-surface-warning text-content-on-brand',
    error: 'bg-surface-critical text-content-on-brand',
    info: 'bg-surface-highlight text-content-on-brand',
  },
  soft: {
    default: 'bg-surface-muted text-content-strong',
    success: 'bg-surface-success-muted text-content-success',
    warning: 'bg-surface-warning-muted text-content-warning',
    error: 'bg-surface-critical-muted text-content-critical',
    info: 'bg-surface-highlight-muted text-content-highlight',
  },
  outline: {
    default: 'bg-transparent border border-stroke-strong text-content',
    success: 'bg-transparent border border-stroke-success text-content-success',
    warning: 'bg-transparent border border-stroke-warning text-content-warning',
    error: 'bg-transparent border border-stroke-critical text-content-critical',
    info: 'bg-transparent border border-stroke-highlight text-content-highlight',
  },
  subtle: {
    default: 'bg-transparent text-content',
    success: 'bg-transparent text-content-success',
    warning: 'bg-transparent text-content-warning',
    error: 'bg-transparent text-content-critical',
    info: 'bg-transparent text-content-highlight',
  },
}

/**
 * Solid-coloured circle used for `dot`, `status`, and `Badge.Dot`.
 * Always uses the high-emphasis surface for the variant so it stays
 * visible against soft / outline / subtle parent backgrounds.
 */
export const dotColourClasses: Record<BadgeVariant, string> = {
  default: 'bg-content-muted',
  success: 'bg-surface-success',
  warning: 'bg-surface-warning',
  error: 'bg-surface-critical',
  info: 'bg-surface-highlight',
}

export function cx(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ')
}
