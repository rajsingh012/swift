export { cx } from '../internal/cx'

/* ── Root ───────────────────────────────────────────────────────── */

/**
 * The root reserves enough cross-axis space for the thumb to overflow the
 * track without overflow:hidden clipping. `touch-none` is required — the
 * default pan-y on mobile would otherwise compete with our pointer drag.
 */
export const rootClasses =
  'swift-slider relative inline-flex select-none touch-none items-center ' +
  'data-[orientation=horizontal]:w-full data-[orientation=horizontal]:min-h-5 ' +
  'data-[orientation=vertical]:h-full data-[orientation=vertical]:min-w-5 ' +
  'data-[orientation=vertical]:flex-col data-[orientation=vertical]:justify-center ' +
  'data-[disabled=true]:cursor-not-allowed'

/* ── Track ──────────────────────────────────────────────────────── */

export const trackClasses =
  'swift-slider-track relative grow overflow-hidden rounded-full ' +
  'bg-[var(--slider-track-bg)] cursor-pointer ' +
  'data-[orientation=horizontal]:h-[var(--slider-track-size)] data-[orientation=horizontal]:w-full ' +
  'data-[orientation=vertical]:w-[var(--slider-track-size)] data-[orientation=vertical]:h-full ' +
  'data-[disabled=true]:cursor-not-allowed'

/* ── Range (filled portion) ─────────────────────────────────────── */

export const rangeClasses =
  'swift-slider-range absolute bg-[var(--slider-range-bg)] ' +
  'data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full ' +
  'data-[disabled=true]:bg-stroke-strong'

/* ── Thumb ──────────────────────────────────────────────────────── */

/**
 * Positioning: `left|top` driven by inline `style` (percent of the value
 * within [min, max]); the transforms here just centre the thumb on that
 * coordinate. `inset-block-start: 50%` for horizontal centres it across
 * the track height — same logical-property game vertical-wise.
 */
export const thumbClasses =
  'swift-slider-thumb absolute block rounded-full ' +
  'h-[var(--slider-thumb-size)] w-[var(--slider-thumb-size)] ' +
  'bg-[var(--slider-thumb-bg)] border-2 border-[var(--slider-thumb-border)] ' +
  'shadow-[var(--slider-thumb-shadow)] cursor-grab ' +
  'transition-[box-shadow,transform] duration-150 motion-reduce:transition-none outline-none ' +
  'data-[orientation=horizontal]:top-1/2 data-[orientation=horizontal]:-translate-y-1/2 ' +
  'data-[orientation=horizontal]:-translate-x-1/2 ' +
  'data-[orientation=vertical]:left-1/2 data-[orientation=vertical]:-translate-x-1/2 ' +
  'data-[orientation=vertical]:translate-y-1/2 ' +
  'hover:shadow-md hover:scale-110 ' +
  'data-[dragging=true]:cursor-grabbing data-[dragging=true]:scale-110 data-[dragging=true]:shadow-lg ' +
  'focus-visible:ring-4 focus-visible:ring-[var(--slider-focus-ring)] ' +
  'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-stroke ' +
  'data-[readonly=true]:cursor-default'

/* ── Mark (tick + label) ────────────────────────────────────────── */

/**
 * Mark wrapper — a zero-size anchor at the tick's value position. We
 * pin it to the track centerline (horizontal: top: 50%; vertical:
 * left: 50%) so the dot child sits visually ON the rail. The label
 * absolutely positions itself relative to this anchor.
 *
 * `pointer-events: none` — marks are display-only. Clicks fall through
 * to the track behind them so users can still drag from anywhere.
 */
export const markWrapperClasses =
  'swift-slider-mark absolute pointer-events-none ' +
  'data-[orientation=horizontal]:top-1/2 data-[orientation=horizontal]:-translate-x-1/2 data-[orientation=horizontal]:-translate-y-1/2 ' +
  'data-[orientation=vertical]:left-1/2 data-[orientation=vertical]:translate-y-1/2 data-[orientation=vertical]:-translate-x-1/2'

/**
 * The dot itself. Two-colour: inactive marks paint with a strong-stroke
 * grey so they pop against the unfilled rail; marks inside the active
 * range flip to `content-on-brand` (white) so they read as punched-out
 * dots on the brand-coloured range portion.
 *
 * Sized 8 px so it overhangs the 4 px track by 2 px on each side — the
 * resulting "pebble" shape is the visual idiom for a tick stop.
 */
export const markDotClasses =
  'swift-slider-mark-dot block h-2 w-2 rounded-full ' +
  'bg-[var(--slider-mark-dot-bg)] ' +
  'data-[active=true]:bg-[var(--slider-mark-active-dot-bg)]'

/**
 * The label below (horizontal) or beside (vertical) the dot. Absolutely
 * positioned off the wrapper so the dot stays the geometric anchor for
 * the `left: X%` placement.
 */
export const markLabelClasses =
  'swift-slider-mark-label absolute whitespace-nowrap text-xs text-content-muted ' +
  'data-[orientation=horizontal]:top-full data-[orientation=horizontal]:left-1/2 data-[orientation=horizontal]:-translate-x-1/2 data-[orientation=horizontal]:mt-3 ' +
  'data-[orientation=vertical]:left-full data-[orientation=vertical]:top-1/2 data-[orientation=vertical]:-translate-y-1/2 data-[orientation=vertical]:ml-3 ' +
  'data-[active=true]:text-content-strong data-[active=true]:font-medium'

/* ── Value readout ──────────────────────────────────────────────── */

export const valueClasses =
  'swift-slider-value tabular-nums text-content-strong text-sm font-medium'

/* ── Label ──────────────────────────────────────────────────────── */

export const labelClasses =
  'swift-slider-label text-sm font-medium text-content-strong ' +
  'data-[disabled=true]:opacity-50'
