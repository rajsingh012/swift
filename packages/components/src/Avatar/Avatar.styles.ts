import type {
  AvatarBadgePosition,
  AvatarShape,
  AvatarSize,
  AvatarStatus,
} from './Avatar.types'

export function cx(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ')
}

/* ── Root ───────────────────────────────────────────────────────────
 *  `swift-avatar` class hooks `theme/avatar.css` for tokens + shimmer
 *  + the deterministic colour palette. The size + shape come from
 *  data-* attributes; CSS sets the pixel dimensions per size and the
 *  border-radius per shape so consumers can override via inline CSS
 *  vars without re-implementing the variant matrix. */
export const rootClasses =
  'swift-avatar relative inline-flex shrink-0 items-center justify-center ' +
  'overflow-hidden select-none ' +
  // Background falls through to one of the palette slots via the inline
  // --avatar-bg var (set by the root from the hashed colour index).
  'bg-[var(--avatar-bg,var(--color-surface-muted))] ' +
  'text-[var(--avatar-color,var(--color-content-strong))] ' +
  'will-change-transform'

/** Pixel dimensions per size. CSS-side mirror lives in
 *  `theme/avatar.css` (so consumers can override via the data attribute
 *  selector); the Tailwind classes here are the JS-side fallback when
 *  the consumer hasn't pulled in the theme CSS. */
export const rootSizeClasses: Record<AvatarSize, string> = {
  xs: 'size-6 text-[10px] font-semibold',
  sm: 'size-8 text-xs font-semibold',
  md: 'size-10 text-sm font-semibold',
  lg: 'size-12 text-base font-semibold',
  xl: 'size-16 text-lg font-semibold',
}

export const rootShapeClasses: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  rounded: 'rounded-[var(--avatar-radius,0.5rem)]',
  square: 'rounded-none',
}

/* ── Image ──────────────────────────────────────────────────────── */

export const imageClasses =
  'swift-avatar-image absolute inset-0 size-full object-cover'

/* ── Fallback ───────────────────────────────────────────────────── */

export const fallbackClasses =
  'swift-avatar-fallback inline-flex size-full items-center justify-center ' +
  // Inherits root font sizing (set per size class above).
  'leading-none uppercase tracking-wide'

/* ── Badge ──────────────────────────────────────────────────────── */

/** Badge sits absolutely on a corner of the avatar. Position is picked
 *  via logical insets so RTL flips start ↔ end automatically. */
export const badgeClasses =
  'swift-avatar-badge absolute inline-flex items-center justify-center ' +
  'rounded-full ring-2 ring-[var(--avatar-badge-ring,var(--color-surface))] ' +
  'pointer-events-none'

/** Badge dimensions per parent avatar size — small enough not to swallow
 *  the avatar, large enough to be visible. */
export const badgeSizeClasses: Record<AvatarSize, string> = {
  xs: 'size-2',
  sm: 'size-2.5',
  md: 'size-3',
  lg: 'size-3.5',
  xl: 'size-4',
}

export const badgePositionClasses: Record<AvatarBadgePosition, string> = {
  'top-start': 'top-0 start-0',
  'top-end': 'top-0 end-0',
  'bottom-start': 'bottom-0 start-0',
  'bottom-end': 'bottom-0 end-0',
}

/** Status → bg colour. `online` uses success, `busy` uses critical,
 *  `away` uses warning, `offline` uses a neutral. */
export const badgeStatusClasses: Record<AvatarStatus, string> = {
  online: 'bg-content-success',
  busy: 'bg-content-critical',
  away: 'bg-content-warning',
  offline: 'bg-content-muted',
}
