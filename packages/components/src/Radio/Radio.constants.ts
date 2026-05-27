import type { RadioSize } from './Radio.types'

export const DEFAULT_SIZE: RadioSize = 'md'

/** Outer circle edge length in px. Matches Checkbox.BOX_PIXEL_SIZE. */
export const BOX_PIXEL_SIZE: Record<RadioSize, number> = {
  sm: 14,
  md: 16,
  lg: 20,
}

/** Inner dot edge length in px. */
export const DOT_PIXEL_SIZE: Record<RadioSize, number> = {
  sm: 6,
  md: 8,
  lg: 10,
}
