import { forwardRef } from 'react'
import { DEFAULT_BADGE_POSITION } from './Avatar.constants'
import { useAvatarContext } from './Avatar.context'
import {
  badgeClasses,
  badgePositionClasses,
  badgeSizeClasses,
  badgeStatusClasses,
  cx,
} from './Avatar.styles'
import type { AvatarBadgeProps } from './Avatar.types'

/**
 * Corner indicator overlaid on the avatar. Two flavours:
 *
 * 1. **Status dot** — pass `status='online'|'offline'|'busy'|'away'`,
 *    omit children; renders a small coloured circle keyed off the
 *    status, with the parent surface as a ring so it lifts off the
 *    avatar's edge cleanly.
 * 2. **Custom content** — pass children (icon, count, etc.); status is
 *    ignored. The badge becomes a free-form container; the consumer
 *    owns size + colour via className.
 *
 * Position uses logical insets (`start`/`end`) so RTL flips
 * automatically. Size scales with the parent avatar's size.
 */
export const AvatarBadge = forwardRef<HTMLSpanElement, AvatarBadgeProps>(
  function AvatarBadge(
    { className, status, position = DEFAULT_BADGE_POSITION, children, ...rest },
    ref,
  ) {
    const { size } = useAvatarContext()

    const isStatusDot = status !== undefined && children === undefined

    return (
      <span
        ref={ref}
        data-status={status}
        data-position={position}
        className={cx(
          badgeClasses,
          badgePositionClasses[position],
          // Only apply the size + status colour when this is a status
          // dot — custom-content badges size themselves.
          isStatusDot && badgeSizeClasses[size],
          isStatusDot && status ? badgeStatusClasses[status] : undefined,
          className,
        )}
        {...rest}
      >
        {isStatusDot ? null : children}
      </span>
    )
  },
)
AvatarBadge.displayName = 'Avatar.Badge'
