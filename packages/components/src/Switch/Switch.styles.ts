import type { SwitchSize } from './Switch.types'

export { cx } from '../internal/cx'

/* ── Root layout ────────────────────────────────────────────────── */

/**
 * Two-column grid mirroring Checkbox: [control] [text-stack]. `items-center`
 * keeps the pill anchored to the middle of a one-line label and the centre
 * of a multi-line label+description block.
 *
 * The `swift-switch` class is the hook for `theme/switch.css` — every token
 * resolves under that selector.
 */
export const rootClasses =
  'swift-switch inline-grid grid-cols-[auto_1fr] items-center gap-x-2 text-content-strong ' +
  'data-[disabled=true]:cursor-not-allowed'

/* ── Control (input + track + thumb wrapper) ────────────────────── */
/**
 * The control is a positioned wrapper so the absolute thumb anchors to it
 * and the overlaid native input can sit on top at opacity 0 for clicks +
 * keyboard. Size pulls from CSS vars in switch.css, so this string carries
 * no pixel maths.
 */
export const controlClasses =
  'relative inline-flex shrink-0 items-center justify-center'

export const hiddenInputClasses =
  // The input fills the same bounding box as the track on fine pointers and
  // expands to the 44px hit target on coarse pointers (the rule lives in
  // switch.css under @media (pointer: coarse)).
  'swift-switch-input absolute inset-0 m-0 h-full w-full cursor-pointer ' +
  'appearance-none opacity-0 disabled:cursor-not-allowed'

export const trackClasses = 'swift-switch-track'
export const thumbClasses = 'swift-switch-thumb'

/* ── Label / description / error ────────────────────────────────── */

export const labelClasses =
  'cursor-pointer font-medium leading-5 text-content-strong ' +
  'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-60'

export const labelSizeClasses: Record<SwitchSize, string> = {
  sm: 'text-xs leading-4',
  md: 'text-sm leading-5',
  lg: 'text-base leading-6',
}

export const descriptionClasses =
  'mt-0.5 text-xs text-content-muted data-[disabled=true]:opacity-60'

export const errorMessageClasses = 'mt-0.5 text-xs text-content-critical'

export const requiredAsteriskClasses = 'ms-0.5 text-content-critical'

export const textWrapperClasses = 'flex flex-col min-w-0'

/* ── Group ──────────────────────────────────────────────────────── */

export const groupRootClasses = 'flex flex-col gap-2'

export const groupItemsClasses: Record<'vertical' | 'horizontal', string> = {
  vertical: 'flex flex-col gap-2',
  horizontal: 'flex flex-row flex-wrap gap-x-4 gap-y-2',
}

export const groupLabelClasses =
  'text-sm font-medium text-content-strong data-[disabled=true]:opacity-50'
