import type { ToggleSize, ToggleVariant } from './Toggle.types'

export { cx } from '../internal/cx'

/**
 * A pressable two-state button. The pressed look is driven by
 * `aria-pressed="true"` / `data-state="on"` so the visual stays in lockstep
 * with the a11y state.
 */
export const baseClasses =
  'swift-toggle inline-flex items-center justify-center gap-2 shrink-0 ' +
  'select-none whitespace-nowrap font-medium leading-none align-middle ' +
  'cursor-pointer rounded-md transition-colors outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

export const sizeClasses: Record<ToggleSize, string> = {
  sm: 'h-8 min-w-8 px-2 text-sm [&_svg]:size-4',
  md: 'h-9 min-w-9 px-2.5 text-sm [&_svg]:size-4',
  lg: 'h-10 min-w-10 px-3 text-base [&_svg]:size-5',
}

/**
 * Icon slot sizing for the `Toggle.Icon` part. Mirrors the `[&_svg]` scale
 * baked into `sizeClasses` so a wrapped icon matches an unwrapped one.
 */
export const iconSlotSizeClasses: Record<ToggleSize, string> = {
  sm: 'inline-flex shrink-0 items-center justify-center [&>svg]:size-4',
  md: 'inline-flex shrink-0 items-center justify-center [&>svg]:size-4',
  lg: 'inline-flex shrink-0 items-center justify-center [&>svg]:size-5',
}

/**
 * Per-variant resting + pressed chrome. Pressed state uses a solid brand
 * fill with on-brand text so "selected" is unmistakable at a glance (the
 * earlier brand-muted tint was too subtle to read as active). Keyed off both
 * `aria-pressed` and `data-state=on` so the visual can't drift from the a11y
 * state.
 */
export const variantClasses: Record<ToggleVariant, string> = {
  default:
    'bg-surface-muted text-content hover:not-disabled:bg-surface-subtle ' +
    'data-[state=on]:bg-surface-brand data-[state=on]:text-content-on-brand ' +
    'data-[state=on]:hover:not-disabled:bg-surface-brand',
  outline:
    'border border-stroke bg-transparent text-content hover:not-disabled:bg-surface-muted ' +
    'data-[state=on]:border-stroke-brand data-[state=on]:bg-surface-brand data-[state=on]:text-content-on-brand ' +
    'data-[state=on]:hover:not-disabled:bg-surface-brand',
  ghost:
    'bg-transparent text-content hover:not-disabled:bg-surface-muted ' +
    'data-[state=on]:bg-surface-brand data-[state=on]:text-content-on-brand ' +
    'data-[state=on]:hover:not-disabled:bg-surface-brand',
}

/* ── Group ──────────────────────────────────────────────────────── */

export const groupClasses =
  'swift-toggle-group inline-flex gap-1 ' +
  'data-[orientation=vertical]:flex-col'
