import type { Placement } from '../internal/floating'

/** Hover/focus dwell before the tooltip opens, in ms. */
export const DEFAULT_OPEN_DELAY = 700

/** Grace period before the tooltip closes, in ms. Reduces flicker and
 *  gives the pointer time to cross the gap into an interactive tooltip. */
export const DEFAULT_CLOSE_DELAY = 300

/** Main-axis gap between trigger and tooltip, in px. */
export const DEFAULT_OFFSET = 8

/** After a tooltip closes, the next one within this window opens with no
 *  delay (the "skip delay" behaviour), in ms. Provider-scoped. */
export const DEFAULT_SKIP_DELAY = 300

/** Default preferred placement. */
export const DEFAULT_PLACEMENT: Placement = 'top'

/** Press-and-hold duration that opens a tooltip on touch devices, in ms. */
export const TOUCH_LONG_PRESS_MS = 500

/** Movement past this many px during a touch press cancels the long-press. */
export const TOUCH_MOVE_THRESHOLD = 10

/** Arrow square edge length, in px. Mirrors `--tooltip-arrow-size`. */
export const ARROW_SIZE = 8

/** Collision padding from the viewport edges, in px. */
export const COLLISION_PADDING = 8
