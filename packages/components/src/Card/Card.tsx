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
  DEFAULT_RADIUS,
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
} from './Card.constants'
import { CardContext, type CardContextValue } from './Card.context'
import {
  baseClasses,
  clickableChromeClasses,
  cx,
  radiusClasses,
  variantClasses,
} from './Card.styles'
import { Slot } from '../internal/Slot'
import type { CardComponent, CardOwnProps } from './Card.types'

type CardRenderProps = CardOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof CardOwnProps | 'onClick'> & {
    as?: ElementType
    onClick?: (event: MouseEvent<HTMLElement>) => void
    type?: 'button' | 'submit' | 'reset'
    href?: string
    children?: ReactNode
  }

const CardRoot = forwardRef<HTMLElement, CardRenderProps>(function Card(
  props,
  ref,
) {
  const {
    as,
    asChild = false,
    variant = DEFAULT_VARIANT,
    size = DEFAULT_SIZE,
    radius = DEFAULT_RADIUS,
    clickable = false,
    loading = false,
    disabled = false,
    classes,
    className,
    children,
    onClick,
    onKeyDown,
    type,
    ...rest
  } = props

  const isInteractionBlocked = disabled || loading

  // `asChild` wins over `as`. If neither is set, clickable picks the most
  // semantic native element (button), otherwise we fall back to div.
  const Component: ElementType = asChild
    ? Slot
    : (as ?? (clickable ? 'button' : 'div'))

  const isNativeButton = Component === 'button'
  const isNativeAnchor = Component === 'a'

  const rootClassName = cx(
    baseClasses,
    variantClasses[variant],
    radiusClasses[radius],
    clickable && clickableChromeClasses,
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
    if (isNativeButton || isNativeAnchor) return // browser handles it
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      ;(event.currentTarget as HTMLElement).click()
    }
  }

  // Build interactive attributes only when clickable. Native button gets
  // disabled+type; anchor gets href passthrough; everything else gets the
  // ARIA button shim (role + tabIndex + keyboard handler).
  const interactiveProps: HTMLAttributes<HTMLElement> & {
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    tabIndex?: number
  } = {}

  if (clickable) {
    if (isNativeButton) {
      interactiveProps.type = type ?? 'button'
      interactiveProps.disabled = isInteractionBlocked
    } else if (!isNativeAnchor) {
      interactiveProps.role = 'button'
      interactiveProps.tabIndex = isInteractionBlocked ? -1 : 0
    }
  }

  const ariaProps: HTMLAttributes<HTMLElement> = {
    'aria-busy': loading || undefined,
    'aria-disabled': isInteractionBlocked || undefined,
  }

  const ctx = useMemo<CardContextValue>(() => ({ size }), [size])

  return (
    <CardContext.Provider value={ctx}>
      <Component
        ref={ref}
        className={rootClassName}
        data-variant={variant}
        data-size={size}
        data-clickable={clickable || undefined}
        data-loading={loading || undefined}
        data-disabled={disabled || undefined}
        onClick={clickable ? handleClick : onClick}
        onKeyDown={clickable ? handleKeyDown : onKeyDown}
        {...interactiveProps}
        {...ariaProps}
        {...rest}
      >
        {loading ? <CardLoadingSkeleton /> : children}
      </Component>
    </CardContext.Provider>
  )
})

function CardLoadingSkeleton() {
  return (
    <div className="grid gap-3 p-5" aria-hidden>
      <div className="h-4 w-2/5 animate-pulse rounded bg-surface-muted" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-surface-muted" />
      <div className="h-3 w-3/5 animate-pulse rounded bg-surface-muted" />
    </div>
  )
}

export const CardRootComponent = CardRoot as unknown as CardComponent
