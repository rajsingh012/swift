import type { ButtonSize, ButtonVariant } from './Button.types'

/**
 * Structural classes applied to every Button variant — layout, behavior,
 * disabled handling. No visual chrome (radius, font, ring) so that
 * `variant="unstyled"` can opt out of chrome entirely.
 */
export const baseClasses =
  'relative overflow-hidden inline-flex items-center select-none ' +
  'cursor-pointer transition-colors outline-none ' +
  'aria-disabled:opacity-50 aria-disabled:cursor-not-allowed ' +
  'disabled:opacity-50 disabled:cursor-not-allowed'

/**
 * Visual chrome shared by every styled variant (everything except `unstyled`).
 * Applied on top of baseClasses by variantClasses below.
 */
const chromeClasses =
  'justify-center font-semibold leading-none whitespace-nowrap ' +
  'focus-visible:ring-2 focus-visible:ring-stroke-brand focus-visible:ring-offset-2'

export const variantClasses: Record<ButtonVariant, string> = {
  primary:
    chromeClasses +
    ' bg-surface-brand text-content-on-brand hover:not-disabled:bg-brand-600 active:not-disabled:bg-brand-700',
  secondary:
    chromeClasses +
    ' bg-surface-muted text-content-strong border border-stroke hover:not-disabled:bg-surface-subtle active:not-disabled:bg-surface',
  outline:
    chromeClasses +
    ' bg-transparent text-content-brand border border-stroke-brand hover:not-disabled:bg-surface-brand-muted active:not-disabled:bg-surface-brand-muted',
  ghost:
    chromeClasses +
    ' bg-transparent text-content-strong hover:not-disabled:bg-surface-muted',
  danger:
    chromeClasses +
    ' bg-surface-critical text-content-inverse hover:not-disabled:bg-critical-600 active:not-disabled:bg-critical-700',
  link:
    chromeClasses +
    ' bg-transparent text-content-brand underline-offset-2 hover:not-disabled:underline',
  unstyled: '',
}

export const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-md',
  md: 'h-10 px-4 text-base gap-2 rounded-md',
  lg: 'h-12 px-5 text-lg gap-2 rounded-lg',
}

export const iconOnlySizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 w-8 p-0 gap-0',
  md: 'h-10 w-10 p-0 gap-0',
  lg: 'h-12 w-12 p-0 gap-0',
}

export const linkSizeClasses: Record<ButtonSize, string> = {
  sm: 'h-auto px-0 text-sm gap-1.5',
  md: 'h-auto px-0 text-base gap-2',
  lg: 'h-auto px-0 text-lg gap-2',
}

export { cx } from '../internal/cx'
