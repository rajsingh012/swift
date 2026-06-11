import type { AlertAppearance, AlertSize, AlertVariant } from './Alert.types'

export { cx } from '../internal/cx'

/* ── Root ───────────────────────────────────────────────────────────
 *  `swift-alert` class hooks `theme/alert.css` for animations,
 *  appearance-driven backgrounds, and the left-accent stripe.
 *
 *  Padding / gap / font size live in `rootSizeClasses` to avoid
 *  Tailwind utility collisions — including them here would have
 *  unpredictable cascade order when the size class overrides them. */
export const rootClasses =
  'swift-alert relative flex items-start ' +
  'rounded-[var(--alert-radius,0.625rem)] border border-stroke bg-surface ' +
  'text-content-strong ' +
  'will-change-transform'

export const rootSizeClasses: Record<AlertSize, string> = {
  sm: 'px-3 py-2 gap-2 text-xs',
  md: 'px-4 py-3 gap-3 text-sm',
  lg: 'px-5 py-4 gap-4 text-base',
}

/** Per-variant accent. Sets `--alert-accent` for the icon, action text,
 *  left-accent stripe, and the soft-appearance border tint. */
export const rootVariantClasses: Record<AlertVariant, string> = {
  default: '',
  success: '[--alert-accent:var(--color-content-success)]',
  error: '[--alert-accent:var(--color-content-critical)]',
  warning: '[--alert-accent:var(--color-content-warning)]',
  info: '[--alert-accent:var(--color-content-brand)]',
}

/** Appearance hook — most of the visual work happens in theme/alert.css
 *  via `[data-appearance="..."]` selectors. Kept here as a stable
 *  mapping (currently empty) so consumers can probe the data attribute
 *  and so future appearance-specific Tailwind utilities have a slot. */
export const rootAppearanceClasses: Record<AlertAppearance, string> = {
  subtle: '',
  soft: '',
  solid: '',
  outline: '',
  'left-accent': '',
  unstyled: '',
}

/* ── Compound parts ─────────────────────────────────────────────── */

export const iconWrapperClasses =
  'swift-alert-icon shrink-0 inline-flex items-center justify-center ' +
  'mt-0.5 text-[var(--alert-accent,var(--color-content-strong))]'

export const contentClasses =
  'swift-alert-content flex min-w-0 flex-1 flex-col gap-0.5'

export const titleClasses =
  'swift-alert-title font-semibold leading-5 text-content-strong'

export const descriptionClasses =
  'swift-alert-description leading-5 text-content-muted ' +
  '[&:not(:first-child)]:mt-0.5'

export const actionsClasses =
  'swift-alert-actions ms-auto inline-flex items-center gap-2 self-center'

export const closeClasses =
  'swift-alert-close shrink-0 cursor-pointer rounded-md p-1 ' +
  'text-content-muted hover:bg-surface-muted hover:text-content ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-stroke-brand'
