import {
  forwardRef,
  useState,
  type ElementType,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { DEFAULT_SIZE, DEFAULT_VARIANT, RIPPLE_DURATION_MS } from './Button.constants'
import {
  baseClasses,
  cx,
  iconOnlySizeClasses,
  linkSizeClasses,
  sizeClasses,
  variantClasses,
} from './Button.styles'
import type { ButtonComponent, ButtonOwnProps } from './Button.types'

type ButtonRenderProps = ButtonOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof ButtonOwnProps | 'onClick'> & {
    as?: ElementType
    onClick?: (event: MouseEvent<HTMLElement>) => void
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    href?: string
    target?: string
    rel?: string
    children?: ReactNode
  }

type Ripple = { id: number; x: number; y: number; radius: number }

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

const ButtonLeftIcon = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(function ButtonLeftIcon({ className, children, ...rest }, ref) {
  return (
    <span
      ref={ref}
      aria-hidden
      className={cx('inline-flex items-center', className)}
      {...rest}
    >
      {children}
    </span>
  )
})
ButtonLeftIcon.displayName = 'Button.LeftIcon'

const ButtonRightIcon = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(function ButtonRightIcon({ className, children, ...rest }, ref) {
  return (
    <span
      ref={ref}
      aria-hidden
      className={cx('inline-flex items-center', className)}
      {...rest}
    >
      {children}
    </span>
  )
})
ButtonRightIcon.displayName = 'Button.RightIcon'

const ButtonLabel = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  function ButtonLabel({ className, children, ...rest }, ref) {
    return (
      <span ref={ref} className={className} {...rest}>
        {children}
      </span>
    )
  },
)
ButtonLabel.displayName = 'Button.Label'

const ButtonRoot = forwardRef<HTMLElement, ButtonRenderProps>(function Button(
  props,
  ref,
) {
  const {
    as,
    variant = DEFAULT_VARIANT,
    size = DEFAULT_SIZE,
    loading = false,
    fullWidth = false,
    iconOnly = false,
    disableRipple = false,
    classes,
    className,
    children,
    onClick,
    disabled,
    type,
    ...rest
  } = props

  const Component: ElementType = as ?? 'button'
  const isNativeButton = Component === 'button'
  const isInteractionBlocked = Boolean(disabled) || loading

  const [ripples, setRipples] = useState<Ripple[]>([])

  const sizeClass =
    variant === 'unstyled'
      ? ''
      : variant === 'link'
        ? linkSizeClasses[size]
        : iconOnly
          ? iconOnlySizeClasses[size]
          : sizeClasses[size]

  const rootClassName = cx(
    baseClasses,
    variantClasses[variant],
    sizeClass,
    fullWidth ? 'w-full' : '',
    className,
    classes?.root,
  )

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isInteractionBlocked) {
      event.preventDefault()
      return
    }
    if (!disableRipple && variant !== 'link' && variant !== 'unstyled') {
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const radius = Math.max(
        Math.hypot(x, y),
        Math.hypot(rect.width - x, y),
        Math.hypot(x, rect.height - y),
        Math.hypot(rect.width - x, rect.height - y),
      )
      const id = Date.now() + Math.random()
      setRipples((current) => [...current, { id, x, y, radius }])
    }
    onClick?.(event as unknown as MouseEvent<HTMLButtonElement>)
  }

  const ariaProps: HTMLAttributes<HTMLElement> = {
    'aria-busy': loading || undefined,
    'aria-disabled': isInteractionBlocked || undefined,
  }

  const nativeButtonProps = isNativeButton
    ? { disabled: isInteractionBlocked, type: type ?? 'button' }
    : { role: 'button', tabIndex: isInteractionBlocked ? -1 : 0 }

  return (
    <Component
      ref={ref}
      className={rootClassName}
      onClick={handleClick}
      {...ariaProps}
      {...nativeButtonProps}
      {...rest}
    >
      <span className={cx('inline-flex items-center gap-[inherit]', loading && 'invisible')}>
        {children}
      </span>
      {loading && (
        <span
          aria-hidden
          className={cx(
            'pointer-events-none absolute inset-0 inline-flex items-center justify-center',
            classes?.loader,
          )}
        >
          <Spinner />
        </span>
      )}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden
          ref={(node) => {
            if (!node) return
            const anim = node.animate(
              [
                { transform: 'scale(0)', opacity: 0.35 },
                { transform: 'scale(1)', opacity: 0 },
              ],
              {
                duration: RIPPLE_DURATION_MS,
                easing: 'ease-out',
                fill: 'forwards',
              },
            )
            anim.onfinish = () =>
              setRipples((current) => current.filter((rp) => rp.id !== r.id))
          }}
          className="pointer-events-none absolute rounded-full bg-current"
          style={{
            left: r.x - r.radius,
            top: r.y - r.radius,
            width: r.radius * 2,
            height: r.radius * 2,
          }}
        />
      ))}
    </Component>
  )
})

export const Button = Object.assign(ButtonRoot as unknown as ButtonComponent, {
  LeftIcon: ButtonLeftIcon,
  RightIcon: ButtonRightIcon,
  Label: ButtonLabel,
}) as ButtonComponent & {
  LeftIcon: typeof ButtonLeftIcon
  RightIcon: typeof ButtonRightIcon
  Label: typeof ButtonLabel
}
