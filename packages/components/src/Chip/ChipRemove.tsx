import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { useChipContext } from './Chip.context'
import { cx, removeButtonSizeClasses } from './Chip.styles'
import type { ChipSize } from './Chip.types'

export interface ChipRemoveProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Override the size cascaded from the enclosing `<Chip>`. */
  size?: ChipSize
}

function CloseGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Trailing remove/dismiss button for a Chip. Inherits size and disabled state
 * from the enclosing `<Chip>` via context. Provides a default `aria-label`
 * ("Remove") which can be overridden.
 */
export const ChipRemove = forwardRef<HTMLButtonElement, ChipRemoveProps>(
  function ChipRemove(
    { className, children, size, disabled, 'aria-label': ariaLabel, ...rest },
    ref,
  ) {
    const ctx = useChipContext('Chip.Remove')
    const resolvedSize = size ?? ctx.size
    const isDisabled = disabled ?? ctx.disabled
    return (
      <button
        ref={ref}
        type="button"
        aria-label={ariaLabel ?? 'Remove'}
        disabled={isDisabled}
        tabIndex={isDisabled ? -1 : 0}
        className={cx(
          'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full',
          'opacity-70 transition-opacity hover:opacity-100',
          'focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current',
          'disabled:cursor-not-allowed',
          removeButtonSizeClasses[resolvedSize],
          className,
        )}
        {...rest}
      >
        {children ?? <CloseGlyph />}
      </button>
    )
  },
)
ChipRemove.displayName = 'Chip.Remove'
