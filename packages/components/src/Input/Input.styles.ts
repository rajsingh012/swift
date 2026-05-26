import type {
  InputLabelPlacement,
  InputSize,
  InputState,
  InputVariant,
} from './Input.types'

export function cx(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ')
}

/* ── Root layout ────────────────────────────────────────────────── */

/**
 * The root wraps label, wrapper, helper, and error. `inline-flex` lets the
 * Input sit alongside other inline elements; `fullWidth` flips it to `flex`.
 */
export const rootClasses = 'inline-flex flex-col gap-1.5 align-top'

/* ── Wrapper (the bordered container around the input) ──────────── */

/** Structural classes shared by every wrapper variant. */
const wrapperBaseClasses =
  'relative inline-flex items-center w-full ' +
  'transition-colors ' +
  'data-[disabled=true]:opacity-50 ' +
  'data-[disabled=true]:cursor-not-allowed'

const focusRingByState: Record<InputState | 'invalid', string> = {
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

const variantStateClasses: Record<InputVariant, Record<InputState | 'invalid', string>> = {
  outlined: {
    default:
      'rounded-md border border-stroke bg-surface ' +
      'hover:not-data-[disabled=true]:border-stroke-strong ' +
      'focus-within:not-data-[disabled=true]:border-stroke-brand',
    success:
      'rounded-md border border-stroke-success bg-surface ' +
      'focus-within:not-data-[disabled=true]:border-stroke-success',
    warning:
      'rounded-md border border-stroke-warning bg-surface ' +
      'focus-within:not-data-[disabled=true]:border-stroke-warning',
    error:
      'rounded-md border border-stroke-critical bg-surface ' +
      'focus-within:not-data-[disabled=true]:border-stroke-critical',
    invalid:
      'rounded-md border border-stroke-critical bg-surface ' +
      'focus-within:not-data-[disabled=true]:border-stroke-critical',
  },
  filled: {
    default:
      'rounded-md border border-transparent bg-surface-muted ' +
      'hover:not-data-[disabled=true]:bg-surface-subtle ' +
      'focus-within:not-data-[disabled=true]:border-stroke-brand ' +
      'focus-within:not-data-[disabled=true]:bg-surface',
    success:
      'rounded-md border border-stroke-success bg-surface-muted ' +
      'focus-within:not-data-[disabled=true]:bg-surface',
    warning:
      'rounded-md border border-stroke-warning bg-surface-muted ' +
      'focus-within:not-data-[disabled=true]:bg-surface',
    error:
      'rounded-md border border-stroke-critical bg-surface-muted ' +
      'focus-within:not-data-[disabled=true]:bg-surface',
    invalid:
      'rounded-md border border-stroke-critical bg-surface-muted ' +
      'focus-within:not-data-[disabled=true]:bg-surface',
  },
  flushed: {
    default:
      'border-b border-stroke bg-transparent rounded-none ' +
      'hover:not-data-[disabled=true]:border-stroke-strong ' +
      'focus-within:not-data-[disabled=true]:border-stroke-brand',
    success: 'border-b border-stroke-success bg-transparent rounded-none',
    warning: 'border-b border-stroke-warning bg-transparent rounded-none',
    error: 'border-b border-stroke-critical bg-transparent rounded-none',
    invalid: 'border-b border-stroke-critical bg-transparent rounded-none',
  },
}

export function wrapperClasses(
  variant: InputVariant,
  state: InputState,
  invalid: boolean,
): string {
  const stateKey: InputState | 'invalid' = invalid ? 'invalid' : state
  return cx(
    wrapperBaseClasses,
    variantStateClasses[variant][stateKey],
    // The flushed variant uses an underline; ring would look wrong.
    variant === 'flushed' ? '' : focusRingByState[stateKey],
  )
}

/* ── Wrapper sizing (height + horizontal padding) ───────────────── */

export const wrapperSizeClasses: Record<InputSize, string> = {
  sm: 'h-8 px-2.5 gap-1.5 text-sm',
  md: 'h-10 px-3 gap-2 text-base',
  lg: 'h-12 px-3.5 gap-2 text-base',
}

/**
 * Floating labels need extra vertical room so the floated label has somewhere
 * to live without overlapping the field text. We bump the height +4px.
 */
export const wrapperFloatingSizeClasses: Record<InputSize, string> = {
  sm: 'h-9 px-2.5 gap-1.5 text-sm',
  md: 'h-12 px-3 gap-2 text-base',
  lg: 'h-14 px-3.5 gap-2 text-base',
}

/* ── The <input> element ────────────────────────────────────────── */

/**
 * The bare input strips its own chrome — all visual state lives on the wrapper.
 * `peer` lets the floating label react to the input's :placeholder-shown and
 * :focus state with pure CSS, no JS state.
 */
export const fieldClasses =
  'peer ' +
  'w-full bg-transparent outline-none border-0 ' +
  'text-content-strong placeholder:text-content-muted ' +
  'disabled:cursor-not-allowed ' +
  'read-only:cursor-default ' +
  // Hide the floating placeholder space we inject (placeholder=" ").
  'placeholder-shown:placeholder:opacity-0'

/* ── Label ──────────────────────────────────────────────────────── */

export const topLabelBaseClasses =
  'inline-flex items-center gap-1 text-sm font-medium text-content-strong ' +
  'data-[disabled=true]:opacity-50'

export const requiredAsteriskClasses = 'text-content-critical'

/**
 * Floating label position. Uses :placeholder-shown to detect emptiness and
 * :peer-focus to detect focus. The default (rest) state is the floated-up
 * position so labels start floated when a value is present.
 */
const floatingLabelBase =
  'pointer-events-none absolute select-none ' +
  'text-content-muted ' +
  'transition-all duration-150 ease-out ' +
  'origin-[0_0]'

/**
 * Per-variant floating positions. `top-0 -translate-y-1/2` floats the label
 * over the wrapper's top border with a small bg-surface px to cover it
 * (outlined). For filled we shrink-in-place rather than escaping the surface.
 */
const floatingLabelByVariant: Record<InputVariant, string> = {
  outlined:
    // Rest (floated): sits on top border, scaled down, with bg to mask the border.
    'top-0 -translate-y-1/2 text-xs px-1 bg-surface ' +
    // Empty + unfocused: sit inside the field at full size, no bg mask.
    'peer-placeholder-shown:top-1/2 ' +
    'peer-placeholder-shown:-translate-y-1/2 ' +
    'peer-placeholder-shown:text-sm ' +
    'peer-placeholder-shown:bg-transparent ' +
    'peer-placeholder-shown:px-0 ' +
    // Focused: always floated up regardless of value.
    'peer-focus:top-0 ' +
    'peer-focus:-translate-y-1/2 ' +
    'peer-focus:text-xs ' +
    'peer-focus:px-1 ' +
    'peer-focus:bg-surface',
  filled:
    'top-1 text-xs ' +
    'peer-placeholder-shown:top-1/2 ' +
    'peer-placeholder-shown:-translate-y-1/2 ' +
    'peer-placeholder-shown:text-sm ' +
    'peer-focus:top-1 ' +
    'peer-focus:translate-y-0 ' +
    'peer-focus:text-xs',
  flushed:
    'top-0 -translate-y-full text-xs ' +
    'peer-placeholder-shown:top-1/2 ' +
    'peer-placeholder-shown:-translate-y-1/2 ' +
    'peer-placeholder-shown:text-sm ' +
    'peer-focus:top-0 ' +
    'peer-focus:-translate-y-full ' +
    'peer-focus:text-xs',
}

/**
 * Horizontal anchor for the floated state. peer-focus pins the label back to
 * this anchor whenever focus is acquired, even if peer-placeholder-shown has
 * shifted it right to clear a startAdornment.
 */
const floatingLabelByVariantX: Record<InputVariant, string> = {
  outlined: 'left-2.5 peer-focus:left-2.5',
  filled: 'left-3 peer-focus:left-3',
  flushed: 'left-0 peer-focus:left-0',
}

/**
 * When a startAdornment is present, the label collides with the icon in its
 * in-field (peer-placeholder-shown) state. Shift it right past the icon by
 * roughly `wrapper-px + icon-width + gap` for each size.
 */
const inFieldLeftWithAdornment: Record<InputSize, string> = {
  sm: 'peer-placeholder-shown:left-8',
  md: 'peer-placeholder-shown:left-9',
  lg: 'peer-placeholder-shown:left-11',
}

/**
 * Focused colour — turns brand when the user is editing.
 * Critical when invalid/error.
 */
const floatingLabelStateColor: Record<InputState | 'invalid', string> = {
  default: 'peer-focus:text-content-brand',
  success: 'text-content-success peer-focus:text-content-success',
  warning: 'text-content-warning peer-focus:text-content-warning',
  error: 'text-content-critical peer-focus:text-content-critical',
  invalid: 'text-content-critical peer-focus:text-content-critical',
}

export function floatingLabelClasses(
  variant: InputVariant,
  state: InputState,
  invalid: boolean,
  size: InputSize,
  hasStartAdornment: boolean,
): string {
  const stateKey: InputState | 'invalid' = invalid ? 'invalid' : state
  return cx(
    floatingLabelBase,
    floatingLabelByVariant[variant],
    floatingLabelByVariantX[variant],
    hasStartAdornment ? inFieldLeftWithAdornment[size] : '',
    floatingLabelStateColor[stateKey],
  )
}

export function labelClasses(
  placement: InputLabelPlacement,
  variant: InputVariant,
  state: InputState,
  invalid: boolean,
  size: InputSize,
  hasStartAdornment: boolean,
): string {
  return placement === 'floating'
    ? floatingLabelClasses(variant, state, invalid, size, hasStartAdornment)
    : topLabelBaseClasses
}

/* ── Helper / Error / Count ─────────────────────────────────────── */

export const helperTextClasses = 'text-xs text-content-muted'
export const errorMessageClasses = 'text-xs text-content-critical'
export const countClasses = 'text-xs text-content-muted tabular-nums'

/* ── Adornment slots ────────────────────────────────────────────── */

export const adornmentBaseClasses =
  'inline-flex shrink-0 items-center justify-center text-content-muted'

/* ── End-slot action buttons (clear / password toggle) ──────────── */

export const endActionButtonClasses =
  'inline-flex shrink-0 items-center justify-center cursor-pointer ' +
  'text-content-muted hover:text-content-strong ' +
  'rounded-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-stroke-brand ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

/* ── Input.Group (OTP) ──────────────────────────────────────────── */

export const groupRootClasses = 'inline-flex items-center gap-2'

/**
 * A single OTP cell — a square-ish field with centered text. Reuses the
 * wrapper styling but locks width so all cells line up.
 */
export const groupCellSizeClasses: Record<InputSize, string> = {
  sm: 'w-8 h-9 text-sm',
  md: 'w-10 h-11 text-base',
  lg: 'w-12 h-13 text-lg',
}

export const groupCellInputClasses =
  'peer w-full h-full bg-transparent outline-none border-0 text-center ' +
  'text-content-strong tabular-nums font-medium ' +
  'disabled:cursor-not-allowed'
