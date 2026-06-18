import type { SelectSize, SelectState, SelectVariant } from './Select.types'

import { cx } from '../internal/cx'

export { cx }

/* ── Trigger ────────────────────────────────────────────────────── */

const triggerBase =
  'swift-select-trigger inline-flex items-center justify-between gap-2 w-full ' +
  'cursor-pointer text-left text-content-strong transition-colors outline-none ' +
  'data-[placeholder]:text-content-muted ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

const focusRingByState: Record<SelectState | 'invalid', string> = {
  default: 'focus-visible:ring-2 focus-visible:ring-stroke-brand/40',
  success: 'focus-visible:ring-2 focus-visible:ring-stroke-success/40',
  warning: 'focus-visible:ring-2 focus-visible:ring-stroke-warning/40',
  error: 'focus-visible:ring-2 focus-visible:ring-stroke-critical/40',
  invalid: 'focus-visible:ring-2 focus-visible:ring-stroke-critical/40',
}

const variantStateClasses: Record<SelectVariant, Record<SelectState | 'invalid', string>> = {
  outlined: {
    default: 'rounded-md border border-stroke bg-surface hover:not-disabled:border-stroke-strong focus-visible:border-stroke-brand',
    success: 'rounded-md border border-stroke-success bg-surface',
    warning: 'rounded-md border border-stroke-warning bg-surface',
    error: 'rounded-md border border-stroke-critical bg-surface',
    invalid: 'rounded-md border border-stroke-critical bg-surface',
  },
  filled: {
    default: 'rounded-md border border-transparent bg-surface-muted hover:not-disabled:bg-surface-subtle focus-visible:border-stroke-brand focus-visible:bg-surface',
    success: 'rounded-md border border-stroke-success bg-surface-muted',
    warning: 'rounded-md border border-stroke-warning bg-surface-muted',
    error: 'rounded-md border border-stroke-critical bg-surface-muted',
    invalid: 'rounded-md border border-stroke-critical bg-surface-muted',
  },
  flushed: {
    default: 'border-b border-stroke bg-transparent rounded-none hover:not-disabled:border-stroke-strong focus-visible:border-stroke-brand',
    success: 'border-b border-stroke-success bg-transparent rounded-none',
    warning: 'border-b border-stroke-warning bg-transparent rounded-none',
    error: 'border-b border-stroke-critical bg-transparent rounded-none',
    invalid: 'border-b border-stroke-critical bg-transparent rounded-none',
  },
}

export function triggerClasses(
  variant: SelectVariant,
  state: SelectState,
  invalid: boolean,
): string {
  const key: SelectState | 'invalid' = invalid ? 'invalid' : state
  return cx(
    triggerBase,
    variantStateClasses[variant][key],
    variant === 'flushed' ? '' : focusRingByState[key],
  )
}

export const triggerSizeClasses: Record<SelectSize, string> = {
  sm: 'h-8 px-2.5 text-sm',
  md: 'h-10 px-3 text-base',
  lg: 'h-12 px-3.5 text-base',
}

export const triggerIconClasses =
  'shrink-0 text-content-muted transition-transform data-[state=open]:rotate-180 [&_svg]:size-4'

/* ── Content (listbox) ──────────────────────────────────────────── */

export const contentClasses =
  'swift-select-content fixed z-[var(--z-modal,50)] outline-none ' +
  'min-w-[8rem] max-h-[var(--select-max-height,18rem)] overflow-y-auto ' +
  'rounded-lg border border-stroke bg-surface-elevated p-1 shadow-[var(--shadow-level4)]'

export const itemClasses =
  'swift-select-item relative flex cursor-pointer select-none items-center gap-2 ' +
  'rounded-md py-1.5 px-2 text-sm text-content outline-none ' +
  'data-[highlighted]:bg-surface-muted data-[highlighted]:text-content-strong ' +
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'

/**
 * In-flow check slot — a fixed-width column reserved on every item so labels
 * align whether or not they're selected, and the check can never overlap the
 * text (the previous absolute positioning collided with the label).
 */
export const itemIndicatorClasses =
  'inline-flex size-4 shrink-0 items-center justify-center text-content-brand [&_svg]:size-4'

export const groupLabelClasses = 'px-2 py-1.5 text-xs font-medium text-content-muted'
export const separatorClasses = 'swift-select-separator -mx-1 my-1 h-px bg-stroke'
