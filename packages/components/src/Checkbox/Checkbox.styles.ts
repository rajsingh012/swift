import type { CheckboxSize } from './Checkbox.types'

export { cx } from '../internal/cx'

/* ── Root layout ────────────────────────────────────────────────── */

/**
 * Two-column grid: [box] [text]. `items-center` centres the box against the
 * entire text stack — handles single-line labels cleanly and keeps the box
 * visually anchored to the middle of the label+description block.
 */
export const rootClasses =
  'inline-grid grid-cols-[auto_1fr] items-center gap-x-2 text-content-strong ' +
  'data-[disabled=true]:cursor-not-allowed'

export const rowClasses = 'inline-flex items-center'

/* ── Control (the clickable box) ────────────────────────────────── */

/**
 * The visible square. We position the real <input> absolutely over it with
 * opacity 0, so a click on the box delegates to the input (firing native
 * change + form events) and keyboard activation works for free.
 */
const controlBaseClasses =
  'relative inline-flex shrink-0 items-center justify-center ' +
  // rounded-xs (4px) — the theme overrides rounded-sm to 8px, which on a
  // 14–20px box produces a circle. xs gives the usual checkbox corner.
  'rounded-xs border transition-colors cursor-pointer ' +
  'select-none ' +
  // Brand fill in checked + indeterminate states (default, non-invalid path).
  'border-stroke ' +
  'data-[invalid=false]:data-[state=checked]:border-stroke-brand ' +
  'data-[invalid=false]:data-[state=checked]:bg-surface-brand ' +
  'data-[invalid=false]:data-[state=indeterminate]:border-stroke-brand ' +
  'data-[invalid=false]:data-[state=indeterminate]:bg-surface-brand ' +
  // Hover (only when not disabled/readonly, and only on the non-invalid path).
  'data-[invalid=false]:data-[disabled=false]:data-[readonly=false]:hover:border-stroke-strong ' +
  'data-[invalid=false]:data-[state=checked]:data-[disabled=false]:hover:bg-surface-brand ' +
  // Invalid path — explicitly covers the unchecked, checked, indeterminate,
  // and hover combinations so the brand rules above are always beaten.
  'data-[invalid=true]:border-stroke-critical ' +
  'data-[invalid=true]:data-[state=checked]:border-stroke-critical ' +
  'data-[invalid=true]:data-[state=checked]:bg-surface-critical ' +
  'data-[invalid=true]:data-[state=indeterminate]:border-stroke-critical ' +
  'data-[invalid=true]:data-[state=indeterminate]:bg-surface-critical ' +
  'data-[invalid=true]:data-[disabled=false]:data-[readonly=false]:hover:border-stroke-critical ' +
  'data-[invalid=true]:data-[state=checked]:data-[disabled=false]:hover:bg-surface-critical ' +
  // Disabled / readonly chrome.
  'data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed ' +
  'data-[readonly=true]:cursor-default ' +
  // Keyboard-only focus ring on the box, driven by :focus-visible on the
  // overlaid input (peer-focus-visible).
  'peer-focus-visible:ring-2 peer-focus-visible:ring-stroke-brand/40 ' +
  'data-[invalid=true]:peer-focus-visible:ring-stroke-critical/40'

export const controlSizeClasses: Record<CheckboxSize, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export function controlClasses(): string {
  return controlBaseClasses
}

/* ── The real <input> sits invisibly over the box ───────────────── */

export const hiddenInputClasses =
  'peer absolute inset-0 m-0 h-full w-full cursor-[inherit] appearance-none opacity-0 ' +
  'disabled:cursor-not-allowed'

/* ── Indicator glyph ────────────────────────────────────────────── */

export const indicatorClasses =
  'pointer-events-none inline-flex items-center justify-center ' +
  'text-content-on-brand'

export const indicatorSizeClasses: Record<CheckboxSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-3.5 w-3.5',
  lg: 'h-4 w-4',
}

/* ── Label + description + error ────────────────────────────────── */

export const labelClasses =
  'cursor-pointer text-sm font-medium leading-5 text-content-strong ' +
  'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50'

export const labelSizeClasses: Record<CheckboxSize, string> = {
  sm: 'text-xs leading-4',
  md: 'text-sm leading-5',
  lg: 'text-base leading-6',
}

export const descriptionClasses =
  'mt-0.5 text-xs text-content-muted data-[disabled=true]:opacity-50'

export const errorMessageClasses = 'mt-0.5 text-xs text-content-critical'

export const requiredAsteriskClasses = 'ms-0.5 text-content-critical'

/* ── Group ──────────────────────────────────────────────────────── */

export const groupRootClasses = 'flex flex-col gap-2'

export const groupItemsClasses: Record<'vertical' | 'horizontal', string> = {
  vertical: 'flex flex-col gap-2',
  horizontal: 'flex flex-row flex-wrap gap-x-4 gap-y-2',
}

export const groupLabelClasses =
  'text-sm font-medium text-content-strong data-[disabled=true]:opacity-50'

export const textWrapperClasses = 'flex flex-col min-w-0'
