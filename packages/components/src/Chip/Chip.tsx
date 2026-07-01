import {
  forwardRef,
  useMemo,
  type ElementType,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import {
  DEFAULT_APPEARANCE,
  DEFAULT_RADIUS,
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
} from './Chip.constants'
import {
  ChipContext,
  useOptionalChipGroup,
  type ChipContextValue,
} from './Chip.context'
import { ChipLabel } from './ChipLabel'
import { ChipLeftIcon } from './ChipLeftIcon'
import { ChipRightIcon } from './ChipRightIcon'
import { ChipRemove } from './ChipRemove'
import {
  appearanceVariantClasses,
  avatarSizeClasses,
  baseClasses,
  cx,
  iconSizeClasses,
  radiusClasses,
  removeButtonSizeClasses,
  selectedClasses,
  sizeClasses,
} from './Chip.styles'
import type { ChipComponent, ChipOwnProps } from './Chip.types'

type ChipRenderProps = ChipOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof ChipOwnProps | 'onClick'> & {
    as?: ElementType
    onClick?: (event: MouseEvent<HTMLElement>) => void
    type?: 'button' | 'submit' | 'reset'
    href?: string
    children?: ReactNode
  }

function CheckGlyph({ className }: { className?: string }) {
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
        d="M5 12.5l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
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

const ChipRoot = forwardRef<HTMLElement, ChipRenderProps>(function Chip(
  props,
  ref,
) {
  const group = useOptionalChipGroup()

  const {
    as,
    variant = DEFAULT_VARIANT,
    appearance = DEFAULT_APPEARANCE,
    size: sizeProp,
    radius = DEFAULT_RADIUS,
    selected: selectedProp,
    onSelectedChange,
    value,
    disabled: disabledProp = false,
    loading = false,
    removable = false,
    onRemove,
    startIcon,
    endIcon,
    avatar,
    showCheckOnSelected = true,
    classes,
    className,
    children,
    onClick,
    onKeyDown,
    type,
    ...rest
  } = props

  // Group integration: a chip with `value` inside a `<ChipGroup>` reads its
  // selected state and disabled-state from the group automatically.
  const inGroup = group !== null && value !== undefined
  const groupSelected = inGroup ? group.selectedValues.has(value) : undefined
  const selected = groupSelected ?? selectedProp ?? false

  const disabled = disabledProp || (inGroup ? Boolean(group?.disabled) : false)
  const size = sizeProp ?? group?.size ?? DEFAULT_SIZE

  const isInteractionBlocked = disabled || loading

  const Component: ElementType = as ?? 'button'
  const isNativeButton = Component === 'button'

  const rootClassName = cx(
    baseClasses,
    sizeClasses[size],
    radiusClasses[radius],
    selected
      ? selectedClasses[variant]
      : appearanceVariantClasses[appearance][variant],
    className,
    classes?.root,
  )

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (isInteractionBlocked) {
      event.preventDefault()
      return
    }
    onClick?.(event)
    if (event.defaultPrevented) return

    // Toggle behaviour: group selection wins; otherwise call onSelectedChange.
    if (inGroup && value !== undefined) {
      group!.toggle(value)
    } else if (onSelectedChange) {
      onSelectedChange(!selected)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (isNativeButton) return // browser handles Enter / Space for <button>
    if (isInteractionBlocked) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      ;(event.currentTarget as HTMLElement).click()
    }
  }

  const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (isInteractionBlocked) {
      event.preventDefault()
      return
    }
    onRemove?.(event)
  }

  const interactiveProps = isNativeButton
    ? { type: type ?? 'button', disabled: isInteractionBlocked }
    : {
        role: 'button',
        tabIndex: isInteractionBlocked ? -1 : 0,
      }

  const ariaProps: HTMLAttributes<HTMLElement> = {
    'aria-pressed': selected || undefined,
    'aria-busy': loading || undefined,
    'aria-disabled': isInteractionBlocked || undefined,
  }

  const showCheck = selected && showCheckOnSelected
  const hasLeadingSlot = loading || showCheck || avatar || startIcon

  const ctx = useMemo<ChipContextValue>(
    () => ({ size, variant, selected, disabled: isInteractionBlocked, inRoot: true }),
    [size, variant, selected, isInteractionBlocked],
  )

  return (
    <ChipContext.Provider value={ctx}>
    <Component
      ref={ref}
      className={rootClassName}
      data-variant={variant}
      data-appearance={appearance}
      data-size={size}
      data-selected={selected || undefined}
      data-disabled={disabled || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...interactiveProps}
      {...ariaProps}
      {...rest}
    >
      {hasLeadingSlot ? (
        loading ? (
          <span
            aria-hidden
            className={cx(
              'inline-flex shrink-0 items-center justify-center',
              iconSizeClasses[size],
            )}
          >
            <Spinner />
          </span>
        ) : showCheck ? (
          <span
            aria-hidden
            className={cx(
              'inline-flex shrink-0 items-center justify-center',
              iconSizeClasses[size],
              classes?.check,
            )}
          >
            <CheckGlyph />
          </span>
        ) : avatar ? (
          <span
            aria-hidden
            className={cx(
              'inline-flex shrink-0 items-center justify-center',
              avatarSizeClasses[size],
              classes?.avatar,
            )}
          >
            {avatar}
          </span>
        ) : (
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
        )
      ) : null}

      {children !== undefined ? (
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
        <button
          type="button"
          tabIndex={isInteractionBlocked ? -1 : 0}
          aria-label="Remove"
          disabled={isInteractionBlocked}
          onClick={handleRemove}
          className={cx(
            'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full',
            'opacity-70 transition-opacity hover:opacity-100',
            'focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current',
            'disabled:cursor-not-allowed',
            removeButtonSizeClasses[size],
            classes?.removeButton,
          )}
        >
          <CloseGlyph />
        </button>
      ) : null}
    </Component>
    </ChipContext.Provider>
  )
})

export const Chip = Object.assign(ChipRoot as unknown as ChipComponent, {
  Root: ChipRoot,
  Label: ChipLabel,
  LeftIcon: ChipLeftIcon,
  RightIcon: ChipRightIcon,
  Remove: ChipRemove,
}) as ChipComponent & {
  Root: typeof ChipRoot
  Label: typeof ChipLabel
  LeftIcon: typeof ChipLeftIcon
  RightIcon: typeof ChipRightIcon
  Remove: typeof ChipRemove
}
