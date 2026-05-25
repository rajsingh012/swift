import type { BadgeStatus, BadgeVariant } from './Badge.types'

export const DEFAULT_VARIANT = 'default' as const
export const DEFAULT_APPEARANCE = 'soft' as const
export const DEFAULT_SIZE = 'md' as const
export const DEFAULT_RADIUS = 'md' as const
export const DEFAULT_MAX_COUNT = 99 as const

/**
 * Maps a high-level status into the variant whose colour expresses it.
 * Keeping this in one place means a status badge inherits all four
 * appearances (solid / soft / outline / subtle) for free.
 */
export const STATUS_VARIANT_MAP: Record<BadgeStatus, BadgeVariant> = {
  online: 'success',
  offline: 'default',
  away: 'warning',
  busy: 'error',
}
