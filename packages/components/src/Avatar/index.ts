import { Avatar as AvatarComponent } from './Avatar'
import { AvatarBadge } from './AvatarBadge'
import { AvatarFallback } from './AvatarFallback'
import { AvatarImage } from './AvatarImage'

export const Avatar = Object.assign(AvatarComponent, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Badge: AvatarBadge,
}) as typeof AvatarComponent & {
  Image: typeof AvatarImage
  Fallback: typeof AvatarFallback
  Badge: typeof AvatarBadge
}

export default Avatar

export { AvatarGroup } from './AvatarGroup'

// Pure SSR-safe utility functions, exposed so consumers can reuse them
// for matching server-rendered placeholders, generating list keys, etc.
export { getInitials, getColourIndex } from './Avatar.utils'

export type {
  AvatarBadgePosition,
  AvatarBadgeProps,
  AvatarFallbackProps,
  AvatarGroupProps,
  AvatarImageProps,
  AvatarImageState,
  AvatarProps,
  AvatarShape,
  AvatarSize,
  AvatarStatus,
} from './Avatar.types'
