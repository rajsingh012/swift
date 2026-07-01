import type { DividerVariant } from './Divider.types'

export { cx } from '../internal/cx'

/**
 * Structural classes for the divider wrapper. The visual line is drawn with
 * `border` so the `solid`/`dashed`/`dotted` style maps onto the native
 * border-style keywords — no extra CSS needed.
 */
export const rootClasses = 'swift-divider border-stroke'

export const horizontalClasses = 'w-full border-t'
export const verticalClasses =
  'inline-block self-stretch h-full min-h-[1em] border-l'

/** Border-style per variant — applies to the single drawn edge. */
export const variantClasses: Record<DividerVariant, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
}

/* ── Labelled (horizontal-only) layout ──────────────────────────── */

/**
 * When a label is present the divider becomes a flex row: a line, the
 * label, another line. The two lines flex to share remaining space; the
 * label align shifts the grow ratio so the label can sit left / centre /
 * right.
 */
export const labelledRootClasses =
  'swift-divider flex w-full items-center gap-3 text-content-muted'

export const labelLineClasses = 'border-t border-stroke'

export const labelClasses =
  'shrink-0 text-sm leading-none text-content-muted'
