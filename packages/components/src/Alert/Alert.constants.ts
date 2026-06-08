import type { AlertAppearance, AlertSize, AlertVariant } from './Alert.types'

export const DEFAULT_VARIANT: AlertVariant = 'default'
export const DEFAULT_SIZE: AlertSize = 'md'
export const DEFAULT_APPEARANCE: AlertAppearance = 'subtle'

/** Variants that get `role="alert"` (assertive aria-live). Everything
 *  else gets `role="status"` (polite). Override per-instance via the
 *  `role` prop. */
export const ALERT_ROLE_VARIANTS: ReadonlySet<AlertVariant> = new Set(['error'])
