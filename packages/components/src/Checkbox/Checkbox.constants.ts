import type { CheckboxSize } from './Checkbox.types'

export const DEFAULT_SIZE: CheckboxSize = 'md'

/** Box edge length in px. Mirrors ICON_PIXEL_SIZE from Input.constants. */
export const BOX_PIXEL_SIZE: Record<CheckboxSize, number> = {
  sm: 14,
  md: 16,
  lg: 20,
}
