import type { ToastAppearance, ToastPosition, ToastType } from './Toast.types'

export const DEFAULT_TYPE: ToastType = 'default'
export const DEFAULT_APPEARANCE: ToastAppearance = 'subtle'
export const DEFAULT_POSITION: ToastPosition = 'bottom-right'
export const DEFAULT_DURATION = 5000
export const DEFAULT_MAX_VISIBLE = 3

/** Positions whose visual stack grows downward (newest at the bottom).
 *  Bottom-aligned positions grow upward — newest at the top. */
export const TOP_POSITIONS: ReadonlySet<ToastPosition> = new Set([
  'top-left',
  'top-center',
  'top-right',
])

export const ALL_POSITIONS: readonly ToastPosition[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const
