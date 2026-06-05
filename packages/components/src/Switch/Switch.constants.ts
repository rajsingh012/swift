import type { SwitchSize, SwitchVariant } from './Switch.types'

export const DEFAULT_SIZE: SwitchSize = 'md'
export const DEFAULT_VARIANT: SwitchVariant = 'default'

/** Track outer dimensions in px, mirroring the CSS tokens. Exposed for
 *  consumers who need to measure (e.g. anchored popovers, tour overlays). */
export const TRACK_PIXEL_SIZE: Record<SwitchSize, { width: number; height: number }> = {
  sm: { width: 28, height: 16 },
  md: { width: 36, height: 20 },
  lg: { width: 44, height: 24 },
}

export const THUMB_PIXEL_SIZE: Record<SwitchSize, number> = {
  sm: 12,
  md: 16,
  lg: 20,
}
