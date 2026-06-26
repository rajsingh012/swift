import { forwardRef } from 'react'
import { DEFAULT_LABEL, DEFAULT_SIZE, DEFAULT_VARIANT } from './Spinner.constants'
import {
  cx,
  labelTextClasses,
  rootClasses,
  sizeClasses,
  svgClasses,
  variantClasses,
} from './Spinner.styles'
import type { SpinnerProps } from './Spinner.types'

/**
 * An indeterminate loading indicator — a rotating ring.
 *
 *   <Spinner />
 *   <Spinner size="lg" variant="brand" />
 *   <Spinner>Loading…</Spinner>
 *
 * Accessibility: renders `role="status"` so screen readers announce it as a
 * live region. The accessible name comes from visible `children` when given,
 * otherwise from `label` (default "Loading"). The SVG itself is
 * `aria-hidden`.
 */
const SpinnerRoot = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  props,
  ref,
) {
  const {
    size = DEFAULT_SIZE,
    variant = DEFAULT_VARIANT,
    label = DEFAULT_LABEL,
    children,
    className,
    ...rest
  } = props

  // Visible text labels the status itself; otherwise expose `label` to AT
  // directly on the status element so no visually-hidden node is needed.
  const hasVisibleText = children != null

  return (
    <span
      ref={ref}
      role="status"
      aria-label={hasVisibleText ? undefined : label}
      data-size={size}
      data-variant={variant}
      className={cx(rootClasses, className)}
      {...rest}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={cx(svgClasses, sizeClasses[size], variantClasses[variant])}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="3"
        />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {hasVisibleText ? (
        <span className={labelTextClasses}>{children}</span>
      ) : null}
    </span>
  )
})
SpinnerRoot.displayName = 'Spinner'

export const Spinner = Object.assign(SpinnerRoot, { Root: SpinnerRoot })
