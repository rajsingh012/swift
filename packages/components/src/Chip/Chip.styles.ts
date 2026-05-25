import type {
  ChipAppearance,
  ChipRadius,
  ChipSize,
  ChipVariant,
} from './Chip.types'

/**
 * Structural classes shared by every Chip. Chips are interactive by
 * default — cursor, focus ring, and disabled handling are baked in.
 * Visual chrome lives in the appearance × variant layer.
 */
export const baseClasses =
  'relative inline-flex items-center justify-center select-none whitespace-nowrap ' +
  'font-medium leading-none align-middle transition-colors outline-none ' +
  'cursor-pointer ' +
  'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand focus-visible:ring-offset-2'

export const sizeClasses: Record<ChipSize, string> = {
  sm: 'h-7 px-2.5 text-xs gap-1.5',
  md: 'h-8 px-3 text-sm gap-1.5',
  lg: 'h-10 px-4 text-base gap-2',
}

export const radiusClasses: Record<ChipRadius, string> = {
  sm: 'rounded',
  md: 'rounded-md',
  full: 'rounded-full',
}

export const iconSizeClasses: Record<ChipSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

/**
 * Avatar slot — round, flush to the chip's leading edge. Negative
 * left-margin makes the avatar appear to "pop out" of the chip body,
 * matching the Material/Slack chip pattern.
 */
export const avatarSizeClasses: Record<ChipSize, string> = {
  sm: 'h-5 w-5 -ml-1 overflow-hidden rounded-full',
  md: 'h-6 w-6 -ml-1.5 overflow-hidden rounded-full',
  lg: 'h-8 w-8 -ml-2 overflow-hidden rounded-full',
}

export const removeButtonSizeClasses: Record<ChipSize, string> = {
  sm: 'h-4 w-4 -mr-1',
  md: 'h-4 w-4 -mr-1.5',
  lg: 'h-5 w-5 -mr-2',
}

/**
 * Unselected chrome per (appearance × variant). Hover variants use
 * `hover:not-disabled:` so disabled chips never light up under the
 * cursor — same pattern as the Button component.
 */
type AppearanceVariantMap = Record<
  ChipAppearance,
  Record<ChipVariant, string>
>

export const appearanceVariantClasses: AppearanceVariantMap = {
  solid: {
    default: 'bg-surface-inverse text-content-inverse hover:not-disabled:opacity-90',
    primary: 'bg-surface-brand text-content-on-brand hover:not-disabled:bg-brand-600',
    success: 'bg-surface-success text-content-on-brand hover:not-disabled:opacity-90',
    warning: 'bg-surface-warning text-content-on-brand hover:not-disabled:opacity-90',
    error: 'bg-surface-critical text-content-on-brand hover:not-disabled:bg-critical-600',
    info: 'bg-surface-highlight text-content-on-brand hover:not-disabled:opacity-90',
  },
  soft: {
    default: 'bg-surface-muted text-content-strong hover:not-disabled:bg-surface-subtle',
    primary: 'bg-surface-brand-muted text-content-brand hover:not-disabled:opacity-80',
    success: 'bg-surface-success-muted text-content-success hover:not-disabled:opacity-80',
    warning: 'bg-surface-warning-muted text-content-warning hover:not-disabled:opacity-80',
    error: 'bg-surface-critical-muted text-content-critical hover:not-disabled:opacity-80',
    info: 'bg-surface-highlight-muted text-content-highlight hover:not-disabled:opacity-80',
  },
  outline: {
    default:
      'bg-transparent border border-stroke-strong text-content hover:not-disabled:bg-surface-muted',
    primary:
      'bg-transparent border border-stroke-brand text-content-brand hover:not-disabled:bg-surface-brand-muted',
    success:
      'bg-transparent border border-stroke-success text-content-success hover:not-disabled:bg-surface-success-muted',
    warning:
      'bg-transparent border border-stroke-warning text-content-warning hover:not-disabled:bg-surface-warning-muted',
    error:
      'bg-transparent border border-stroke-critical text-content-critical hover:not-disabled:bg-surface-critical-muted',
    info:
      'bg-transparent border border-stroke-highlight text-content-highlight hover:not-disabled:bg-surface-highlight-muted',
  },
}

/**
 * Selected state — overrides the base chrome with a filled treatment
 * regardless of the chip's `appearance`. This keeps the toggled state
 * unmistakable across all four base looks.
 */
export const selectedClasses: Record<ChipVariant, string> = {
  default:
    'bg-surface-inverse text-content-inverse border-transparent hover:not-disabled:opacity-90',
  primary:
    'bg-surface-brand text-content-on-brand border-transparent hover:not-disabled:bg-brand-600',
  success:
    'bg-surface-success text-content-on-brand border-transparent hover:not-disabled:opacity-90',
  warning:
    'bg-surface-warning text-content-on-brand border-transparent hover:not-disabled:opacity-90',
  error:
    'bg-surface-critical text-content-on-brand border-transparent hover:not-disabled:bg-critical-600',
  info:
    'bg-surface-highlight text-content-on-brand border-transparent hover:not-disabled:opacity-90',
}

export const groupOrientationClasses = {
  horizontal: 'flex flex-wrap items-center gap-2',
  vertical: 'flex flex-col items-start gap-2',
} as const

export function cx(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ')
}
