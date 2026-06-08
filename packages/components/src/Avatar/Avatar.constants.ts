import type {
  AvatarBadgePosition,
  AvatarShape,
  AvatarSize,
} from './Avatar.types'

export const DEFAULT_SIZE: AvatarSize = 'md'
export const DEFAULT_SHAPE: AvatarShape = 'circle'
export const DEFAULT_BADGE_POSITION: AvatarBadgePosition = 'bottom-end'
export const FALLBACK_DELAY_MS = 600

/** Pixel size per `AvatarSize`. Mirrors `theme/avatar.css` for any
 *  consumer that needs to compute layout off the size token (e.g.
 *  positioning a tooltip arrow at the badge centre). */
export const SIZE_PIXELS: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
}

/** Number of palette slots for the deterministic fallback colour hash.
 *  CSS side exposes `--avatar-palette-0` … `--avatar-palette-7` so
 *  consumers can retheme the swatches without touching JS. */
export const COLOUR_PALETTE_SIZE = 8
