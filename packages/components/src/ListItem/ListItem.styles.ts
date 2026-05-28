import type {
  ListItemAlign,
  ListItemDensity,
  ListItemOrientation,
  ListItemSize,
} from './ListItem.types'

export function cx(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ')
}

/* ── Root ───────────────────────────────────────────────────────── */

/**
 * Flex row with three slots: leading · content · trailing. The middle
 * slot uses `min-w-0` so its children can opt into text truncation
 * without the row pushing itself wider than its container.
 *
 * All visuals (hover background, selected tint, radius, gap, padding)
 * route through `--list-item-*` tokens declared in `list-item.css`,
 * so a single row can be retuned via inline style and a whole List
 * can be themed at the root.
 */
export const rootClasses =
  'swift-list-item relative flex w-full items-stretch text-left text-content ' +
  // Shorter transition feels snappier than the default 150ms `transition-colors`
  // on a full-width row — hover paint covers a lot of pixels.
  'transition-[background-color,border-color,color] duration-100 ease-out outline-none ' +
  'bg-[var(--list-item-bg,transparent)] ' +
  'rounded-[var(--list-item-radius,0px)] ' +
  'data-[clickable=true]:cursor-pointer ' +
  // Hover paints only when the row is in its 'rest' state — selected and
  // active rows already carry a tinted surface, and overlaying a plain
  // hover on top would read as a mode flicker (selected → unselected →
  // selected as the cursor leaves). The selected / active rows get their
  // own hover deepening below.
  'data-[clickable=true]:data-[disabled=false]:data-[selected=false]:data-[active=false]:hover:bg-[var(--list-item-hover-bg)] ' +
  // Touch / press feedback — slightly darker than hover. Pointer down only.
  'data-[clickable=true]:data-[disabled=false]:data-[selected=false]:data-[active=false]:active:bg-[var(--list-item-press-bg)] ' +
  // Selected: brand-tinted surface, stronger text. Hovering a selected
  // row deepens the same tint so there is still feedback without losing
  // the selected identity.
  'data-[selected=true]:bg-[var(--list-item-selected-bg)] ' +
  'data-[selected=true]:text-content-strong ' +
  'data-[clickable=true]:data-[selected=true]:data-[disabled=false]:hover:bg-[var(--list-item-selected-hover-bg)] ' +
  // Active (current nav target). Same pattern — hover deepens, not
  // replaces.
  'data-[active=true]:bg-[var(--list-item-active-bg)] ' +
  'data-[clickable=true]:data-[active=true]:data-[disabled=false]:hover:bg-[var(--list-item-active-hover-bg)] ' +
  // Disabled chrome.
  'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed ' +
  // Inset focus ring — full-width rows clipped by an `overflow-hidden`
  // bordered List would have any *outer* ring chopped off; inset keeps
  // the ring inside the row and avoids the transparent ring-offset gap.
  'data-[clickable=true]:focus-visible:ring-2 ' +
  'data-[clickable=true]:focus-visible:ring-inset ' +
  'data-[clickable=true]:focus-visible:ring-stroke-brand'

/* ── Size → typography + slot sizing ────────────────────────────── */

export const titleSizeClasses: Record<ListItemSize, string> = {
  sm: 'text-xs leading-4 font-medium',
  md: 'text-sm leading-5 font-medium',
  lg: 'text-base leading-6 font-semibold',
}

export const descriptionSizeClasses: Record<ListItemSize, string> = {
  sm: 'text-[11px] leading-4',
  md: 'text-xs leading-4',
  lg: 'text-sm leading-5',
}

/** Default leading slot dimensions — consumers can override per-row. */
export const leadingSizeClasses: Record<ListItemSize, string> = {
  sm: 'min-w-6 min-h-6',
  md: 'min-w-8 min-h-8',
  lg: 'min-w-10 min-h-10',
}

/**
 * When `align="start"` (multi-line description) the Leading/Trailing slot
 * collapses its height to the title's first-line height. Combined with
 * `items-center` inside the slot, a 14 px checkbox or 16 px icon ends up
 * vertically centered on the title's cap-mid — instead of pinned to the
 * row's top edge several pixels above the text baseline.
 *
 * Widths still come from `leadingSizeClasses` so adjacent rows keep their
 * leading columns optically aligned across the list.
 */
export const firstLineHeightClasses: Record<ListItemSize, string> = {
  sm: 'h-4', // text-xs leading-4 → 16px
  md: 'h-5', // text-sm leading-5 → 20px
  lg: 'h-6', // text-base leading-6 → 24px
}

export const leadingWidthClasses: Record<ListItemSize, string> = {
  sm: 'min-w-6',
  md: 'min-w-8',
  lg: 'min-w-10',
}

/* ── Density → row padding + min height ─────────────────────────── */

/**
 * Vertical padding per density. Horizontal padding is fixed via the
 * `--list-item-padding-x` token so dense rows still feel like list
 * cells, not buttons. The 44px floor (mobile touch target) applies to
 * clickable rows only — static items can be tighter.
 */
export const densityYClasses: Record<ListItemDensity, string> = {
  compact: 'py-1.5',
  comfortable: 'py-2.5',
  spacious: 'py-4',
}

/** Min-height for interactive rows — meets the 44px touch target floor. */
export const clickableMinHeightClasses: Record<ListItemDensity, string> = {
  compact: 'min-h-11', // 44px
  comfortable: 'min-h-12', // 48px
  spacious: 'min-h-14', // 56px
}

/* ── Gap between slots ──────────────────────────────────────────── */

export const slotGapClasses: Record<ListItemSize, string> = {
  sm: 'gap-2.5',
  md: 'gap-3',
  lg: 'gap-3.5',
}

/* ── Alignment ──────────────────────────────────────────────────── */

export const alignClasses: Record<ListItemAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
}

/* ── Orientation ────────────────────────────────────────────────── */

/**
 * Vertical stacks slots top-to-bottom. `items-stretch` lets Leading
 * (typically an image or media block) span the row's full width — and
 * Tailwind's `flex` default of row-direction is overridden here.
 */
export const orientationClasses: Record<ListItemOrientation, string> = {
  horizontal: '',
  vertical: 'flex-col items-stretch',
}

/* ── Slot wrappers ──────────────────────────────────────────────── */

export const leadingClasses =
  'flex shrink-0 items-center justify-center text-content-muted'

export const contentClasses =
  'flex min-w-0 flex-1 flex-col justify-center gap-0.5'

export const trailingClasses =
  'flex shrink-0 items-center justify-end gap-2 text-content-muted'

export const actionsClasses = 'flex shrink-0 items-center gap-1'

export const titleClasses = 'text-content-strong'

export const descriptionClasses = 'text-content-muted'

export const truncateClasses = 'truncate'

export const clampClasses: Record<1 | 2 | 3, string> = {
  1: 'truncate',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
}

/* ── Divider ────────────────────────────────────────────────────── */

export const dividerClasses = 'border-b border-stroke-muted'

/* ── List container ─────────────────────────────────────────────── */

export const listBaseClasses = 'm-0 flex flex-col p-0 list-none'

export const listVariantClasses: Record<'plain' | 'bordered', string> = {
  plain: '',
  bordered:
    'overflow-hidden rounded-[var(--list-radius,0.75rem)] border border-stroke',
}

/**
 * When the List owns dividers, every child except the last gets a
 * hairline bottom border. Skipping the last child keeps the bordered
 * variant from doubling-up on its own border.
 */
export const listDividerClasses =
  '[&>*:not(:last-child)]:border-b [&>*:not(:last-child)]:border-stroke-muted'
