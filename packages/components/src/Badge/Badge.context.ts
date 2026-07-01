import { createContext, useContext } from 'react'
import { DEFAULT_SIZE, DEFAULT_VARIANT } from './Badge.constants'
import type { BadgeSize, BadgeVariant } from './Badge.types'

/**
 * Value cascaded from `<Badge>` to its compound parts (`Badge.Dot`,
 * `Badge.Icon`, `Badge.Label`) so they inherit sizing/colour without
 * prop drilling. Parts remain usable standalone via the fallback below.
 */
export interface BadgeContextValue {
  size: BadgeSize
  variant: BadgeVariant
  /** True when provided by a `<Badge>` root (vs. the standalone fallback). */
  inRoot: boolean
}

const FALLBACK_CONTEXT: BadgeContextValue = {
  size: DEFAULT_SIZE,
  variant: DEFAULT_VARIANT,
  inRoot: false,
}

export const BadgeContext = createContext<BadgeContextValue | null>(null)

/**
 * Reads the nearest Badge context. Badge parts are intentionally usable on
 * their own, so this hook never throws — it falls back to sensible defaults
 * when used outside a `<Badge>` root. `componentName` is accepted for parity
 * with sibling `useX(componentName)` hooks.
 */
export function useBadgeContext(componentName: string): BadgeContextValue {
  void componentName
  return useContext(BadgeContext) ?? FALLBACK_CONTEXT
}
