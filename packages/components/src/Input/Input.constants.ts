export const DEFAULT_SIZE = 'md' as const
export const DEFAULT_VARIANT = 'outlined' as const
export const DEFAULT_LABEL_PLACEMENT = 'top' as const
export const DEFAULT_STATE = 'default' as const

export const ICON_PIXEL_SIZE = {
  sm: 14,
  md: 16,
  lg: 20,
} as const

/** Placeholder injected when labelPlacement="floating" — required for the
 *  CSS `:placeholder-shown` selector that drives the float animation. A
 *  single space looks empty but counts as a present placeholder. */
export const FLOATING_PLACEHOLDER = ' '
