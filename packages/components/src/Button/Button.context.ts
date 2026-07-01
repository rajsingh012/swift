import { createContext, useContext } from 'react'
import { DEFAULT_SIZE, DEFAULT_VARIANT } from './Button.constants'
import type { ButtonSize, ButtonVariant } from './Button.types'

/**
 * Value cascaded from `<Button>` (the root) to its compound parts
 * (`Button.Label`, `Button.LeftIcon`, `Button.RightIcon`). Parts read this to
 * size their icons and inherit visual state without prop drilling.
 *
 * `inRoot` distinguishes "rendered inside a Button root" from "rendered
 * standalone with fallback defaults" so parts can adapt gracefully. Parts are
 * usable outside a root — they simply fall back to the defaults below.
 */
export interface ButtonContextValue {
  size: ButtonSize
  variant: ButtonVariant
  loading: boolean
  disabled: boolean
  iconOnly: boolean
  /** True when provided by a `<Button>` root (vs. the standalone fallback). */
  inRoot: boolean
}

const FALLBACK_CONTEXT: ButtonContextValue = {
  size: DEFAULT_SIZE,
  variant: DEFAULT_VARIANT,
  loading: false,
  disabled: false,
  iconOnly: false,
  inRoot: false,
}

export const ButtonContext = createContext<ButtonContextValue | null>(null)

/**
 * Reads the nearest Button context. Unlike most compound components in this
 * library, Button parts are intentionally usable on their own, so this hook
 * never throws — it falls back to sensible defaults when used outside a
 * `<Button>` root. `componentName` is accepted for parity with sibling
 * `useX(componentName)` hooks and future dev warnings.
 */
export function useButtonContext(componentName: string): ButtonContextValue {
  void componentName
  return useContext(ButtonContext) ?? FALLBACK_CONTEXT
}
