import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { Button } from '../Button'
import {
  DEFAULT_APPEARANCE,
  DEFAULT_MAX_COUNT,
  DEFAULT_RADIUS,
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
  STATUS_VARIANT_MAP,
} from './Badge.constants'
import {
  appearanceVariantClasses,
  baseClasses,
  cx,
  decorativeDotSizeClasses,
  dotColourClasses,
  dotOnlySizeClasses,
  iconSizeClasses,
  radiusClasses,
  removeButtonSizeClasses,
  sizeClasses,
} from './Badge.styles'
import type {
  BadgeComponent,
  BadgeOwnProps,
  BadgeSize,
  BadgeVariant,
} from './Badge.types'

type BadgeRenderProps = BadgeOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof BadgeOwnProps | 'onClick'> & {
    as?: ElementType
    onClick?: (event: MouseEvent<HTMLElement>) => void
    children?: ReactNode
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

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden
      className={cx('animate-spin', className)}
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
  )
}

/* ── Compound parts ─────────────────────────────────────────────────────── */

interface BadgeDotProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
}

const BadgeDot = forwardRef<HTMLSpanElement, BadgeDotProps>(function BadgeDot(
  { className, variant = DEFAULT_VARIANT, size = DEFAULT_SIZE, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      aria-hidden
      className={cx(
        'inline-block shrink-0 rounded-full',
        decorativeDotSizeClasses[size],
        dotColourClasses[variant],
        className,
      )}
      {...rest}
    />
  )
})
BadgeDot.displayName = 'Badge.Dot'

const BadgeIcon = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement> & { size?: BadgeSize }
>(function BadgeIcon({ className, children, size = DEFAULT_SIZE, ...rest }, ref) {
  return (
    <span
      ref={ref}
      aria-hidden
      className={cx(
        'inline-flex shrink-0 items-center justify-center',
        iconSizeClasses[size],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  )
})
BadgeIcon.displayName = 'Badge.Icon'

const BadgeLabel = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  function BadgeLabel({ className, children, ...rest }, ref) {
    return (
      <span ref={ref} className={className} {...rest}>
        {children}
      </span>
    )
  },
)
BadgeLabel.displayName = 'Badge.Label'

/* ── Root ───────────────────────────────────────────────────────────────── */

const BadgeRoot = forwardRef<HTMLElement, BadgeRenderProps>(function Badge(
  props,
  ref,
) {
  const {
    as,
    variant: variantProp,
    appearance = DEFAULT_APPEARANCE,
    size = DEFAULT_SIZE,
    radius = DEFAULT_RADIUS,
    pill = false,
    dot = false,
    status,
    count,
    max = DEFAULT_MAX_COUNT,
    startIcon,
    endIcon,
    removable = false,
    onRemove,
    clickable = false,
    loading = false,
    disabled = false,
    classes,
    className,
    children,
    onClick,
    onKeyDown,
    role,
    tabIndex,
    'aria-label': ariaLabel,
    ...rest
  } = props

  // Status takes precedence on variant — it semantically encodes the colour.
  const variant: BadgeVariant = status
    ? STATUS_VARIANT_MAP[status]
    : (variantProp ?? DEFAULT_VARIANT)

  const isStatusOnly = status !== undefined && children === undefined && count === undefined
  const isInteractionBlocked = disabled || loading

  const Component: ElementType = as ?? 'span'
  const effectiveRadius = pill ? 'full' : radius

  const numericContent =
    count !== undefined ? (count > max ? `${max}+` : String(count)) : null

  const rootClassName = cx(
    baseClasses,
    isStatusOnly ? dotOnlySizeClasses[size] : sizeClasses[size],
    isStatusOnly ? 'rounded-full' : radiusClasses[effectiveRadius],
    appearanceVariantClasses[appearance][variant],
    isStatusOnly && dotColourClasses[variant],
    className,
    classes?.root,
  )

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (isInteractionBlocked) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (!clickable || isInteractionBlocked) return
    // Match the WAI-ARIA button pattern — both Enter and Space trigger.
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      ;(event.currentTarget as HTMLElement).click()
    }
  }

  const handleRemove = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    if (isInteractionBlocked) {
      event.preventDefault()
      return
    }
    onRemove?.(event as MouseEvent<HTMLButtonElement>)
  }

  // Accessibility: a dot-only status needs a label since there is no text
  // for assistive tech to read.
  const accessibleLabel =
    ariaLabel ??
    (isStatusOnly ? `Status: ${status}` : undefined)

  const interactiveProps =
    clickable && Component !== 'button'
      ? {
          role: role ?? 'button',
          tabIndex: tabIndex ?? (isInteractionBlocked ? -1 : 0),
        }
      : { role, tabIndex }

  const ariaProps: HTMLAttributes<HTMLElement> = {
    'aria-busy': loading || undefined,
    'aria-disabled': isInteractionBlocked || undefined,
    'aria-label': accessibleLabel,
  }

  return (
    <Component
      ref={ref}
      className={rootClassName}
      data-variant={variant}
      data-appearance={appearance}
      data-size={size}
      data-clickable={clickable || undefined}
      onClick={clickable ? handleClick : onClick}
      onKeyDown={clickable ? handleKeyDown : onKeyDown}
      {...interactiveProps}
      {...ariaProps}
      {...rest}
    >
      {!isStatusOnly && (
        <>
          {loading ? (
            <span
              aria-hidden
              className={cx(
                'inline-flex shrink-0 items-center justify-center',
                iconSizeClasses[size],
              )}
            >
              <Spinner />
            </span>
          ) : dot ? (
            <BadgeDot
              variant={variant}
              size={size}
              className={classes?.dot}
            />
          ) : startIcon ? (
            <span
              aria-hidden
              className={cx(
                'inline-flex shrink-0 items-center justify-center',
                iconSizeClasses[size],
                classes?.startIcon,
              )}
            >
              {startIcon}
            </span>
          ) : null}

          {numericContent !== null ? (
            <span className={classes?.label}>{numericContent}</span>
          ) : children !== undefined ? (
            <span className={classes?.label}>{children}</span>
          ) : null}

          {endIcon && !removable ? (
            <span
              aria-hidden
              className={cx(
                'inline-flex shrink-0 items-center justify-center',
                iconSizeClasses[size],
                classes?.endIcon,
              )}
            >
              {endIcon}
            </span>
          ) : null}

          {removable ? (
            <Button
              variant="unstyled"
              aria-label="Remove"
              disabled={isInteractionBlocked}
              onClick={handleRemove}
              className={cx(
                'shrink-0 justify-center rounded-full',
                'opacity-70 transition-opacity hover:opacity-100',
                'focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current',
                removeButtonSizeClasses[size],
                classes?.removeButton,
              )}
            >
              <CloseGlyph />
            </Button>
          ) : null}
        </>
      )}
    </Component>
  )
})

export const Badge = Object.assign(BadgeRoot as unknown as BadgeComponent, {
  Dot: BadgeDot,
  Icon: BadgeIcon,
  Label: BadgeLabel,
}) as BadgeComponent & {
  Dot: typeof BadgeDot
  Icon: typeof BadgeIcon
  Label: typeof BadgeLabel
}
