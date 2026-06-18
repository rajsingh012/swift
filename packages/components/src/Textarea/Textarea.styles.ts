import type {
  TextareaResize,
  TextareaSize,
  TextareaState,
  TextareaVariant,
} from './Textarea.types'

import { cx } from '../internal/cx'

export { cx }

/* ── Root layout (label + wrapper + footer) ─────────────────────── */

export const rootClasses = 'inline-flex flex-col gap-1.5 align-top'

/* ── Wrapper (bordered container) ───────────────────────────────── */

const wrapperBaseClasses =
  'relative inline-flex w-full ' +
  'transition-colors ' +
  'data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-not-allowed'

const focusRingByState: Record<TextareaState | 'invalid', string> = {
  default:
    'focus-within:not-data-[disabled=true]:ring-2 focus-within:not-data-[disabled=true]:ring-stroke-brand/40',
  success:
    'focus-within:not-data-[disabled=true]:ring-2 focus-within:not-data-[disabled=true]:ring-stroke-success/40',
  warning:
    'focus-within:not-data-[disabled=true]:ring-2 focus-within:not-data-[disabled=true]:ring-stroke-warning/40',
  error:
    'focus-within:not-data-[disabled=true]:ring-2 focus-within:not-data-[disabled=true]:ring-stroke-critical/40',
  invalid:
    'focus-within:not-data-[disabled=true]:ring-2 focus-within:not-data-[disabled=true]:ring-stroke-critical/40',
}

const variantStateClasses: Record<
  TextareaVariant,
  Record<TextareaState | 'invalid', string>
> = {
  outlined: {
    default:
      'rounded-md border border-stroke bg-surface ' +
      'hover:not-data-[disabled=true]:border-stroke-strong ' +
      'focus-within:not-data-[disabled=true]:border-stroke-brand',
    success:
      'rounded-md border border-stroke-success bg-surface focus-within:not-data-[disabled=true]:border-stroke-success',
    warning:
      'rounded-md border border-stroke-warning bg-surface focus-within:not-data-[disabled=true]:border-stroke-warning',
    error:
      'rounded-md border border-stroke-critical bg-surface focus-within:not-data-[disabled=true]:border-stroke-critical',
    invalid:
      'rounded-md border border-stroke-critical bg-surface focus-within:not-data-[disabled=true]:border-stroke-critical',
  },
  filled: {
    default:
      'rounded-md border border-transparent bg-surface-muted ' +
      'hover:not-data-[disabled=true]:bg-surface-subtle ' +
      'focus-within:not-data-[disabled=true]:border-stroke-brand focus-within:not-data-[disabled=true]:bg-surface',
    success:
      'rounded-md border border-stroke-success bg-surface-muted focus-within:not-data-[disabled=true]:bg-surface',
    warning:
      'rounded-md border border-stroke-warning bg-surface-muted focus-within:not-data-[disabled=true]:bg-surface',
    error:
      'rounded-md border border-stroke-critical bg-surface-muted focus-within:not-data-[disabled=true]:bg-surface',
    invalid:
      'rounded-md border border-stroke-critical bg-surface-muted focus-within:not-data-[disabled=true]:bg-surface',
  },
  flushed: {
    default:
      'border-b border-stroke bg-transparent rounded-none ' +
      'hover:not-data-[disabled=true]:border-stroke-strong focus-within:not-data-[disabled=true]:border-stroke-brand',
    success: 'border-b border-stroke-success bg-transparent rounded-none',
    warning: 'border-b border-stroke-warning bg-transparent rounded-none',
    error: 'border-b border-stroke-critical bg-transparent rounded-none',
    invalid: 'border-b border-stroke-critical bg-transparent rounded-none',
  },
}

export function wrapperClasses(
  variant: TextareaVariant,
  state: TextareaState,
  invalid: boolean,
): string {
  const stateKey: TextareaState | 'invalid' = invalid ? 'invalid' : state
  return cx(
    wrapperBaseClasses,
    variantStateClasses[variant][stateKey],
    variant === 'flushed' ? '' : focusRingByState[stateKey],
  )
}

/* ── Wrapper padding per size ───────────────────────────────────── */

export const wrapperSizeClasses: Record<TextareaSize, string> = {
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-3 py-2 text-base',
  lg: 'px-3.5 py-2.5 text-base',
}

/* ── The <textarea> element ─────────────────────────────────────── */

export const fieldClasses =
  'peer w-full bg-transparent outline-none border-0 ' +
  'text-content-strong placeholder:text-content-muted ' +
  'disabled:cursor-not-allowed read-only:cursor-default ' +
  'leading-normal'

export const resizeClasses: Record<TextareaResize, string> = {
  none: 'resize-none',
  vertical: 'resize-y',
  auto: 'resize-none overflow-hidden',
}

/* ── Label / helper / error / count ─────────────────────────────── */

export const labelClasses =
  'inline-flex items-center gap-1 text-sm font-medium text-content-strong data-[disabled=true]:opacity-50'

export const requiredAsteriskClasses = 'text-content-critical'

export const helperTextClasses = 'text-xs text-content-muted'
export const errorMessageClasses = 'text-xs text-content-critical'
export const countClasses = 'text-xs text-content-muted tabular-nums'
