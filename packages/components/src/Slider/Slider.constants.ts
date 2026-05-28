import type { SliderOrientation } from './Slider.types'

export const DEFAULT_MIN = 0
export const DEFAULT_MAX = 100
export const DEFAULT_STEP = 1
export const DEFAULT_ORIENTATION: SliderOrientation = 'horizontal'
export const DEFAULT_MIN_STEPS_BETWEEN_THUMBS = 0

/**
 * PageUp / PageDown move by this fraction of the (max - min) range — or by
 * `step`, whichever is larger. Matches the WAI-ARIA APG slider recommendation.
 */
export const PAGE_KEY_FRACTION = 0.1
