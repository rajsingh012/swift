import { useCallback, useMemo, useRef } from 'react'
import {
  DEFAULT_CLOSE_DELAY,
  DEFAULT_OPEN_DELAY,
  DEFAULT_SKIP_DELAY,
} from './Tooltip.constants'
import {
  TooltipProviderContext,
  type TooltipProviderContextValue,
} from './Tooltip.context'
import type { TooltipProviderProps } from './Tooltip.types'

/**
 * Supplies default open/close delays to descendant tooltips and runs the
 * shared "skip delay" window: once any tooltip closes, the next one to
 * open within `skipDelayDuration` skips its open delay — so the first
 * tooltip in a toolbar feels deliberate while the rest feel instant.
 *
 * Optional. A Tooltip without a Provider uses its own props/defaults and
 * simply never skips. The skip state is Provider-scoped (a ref + timer),
 * so separate Providers don't leak into one another.
 */
export function TooltipProvider({
  openDelay = DEFAULT_OPEN_DELAY,
  closeDelay = DEFAULT_CLOSE_DELAY,
  skipDelayDuration = DEFAULT_SKIP_DELAY,
  children,
}: TooltipProviderProps) {
  const skipping = useRef(false)
  const skipTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const registerClose = useCallback(() => {
    skipping.current = true
    if (skipTimer.current) clearTimeout(skipTimer.current)
    skipTimer.current = setTimeout(() => {
      skipping.current = false
      skipTimer.current = null
    }, skipDelayDuration)
  }, [skipDelayDuration])

  const shouldSkipDelay = useCallback(() => skipping.current, [])

  const ctx = useMemo<TooltipProviderContextValue>(
    () => ({ openDelay, closeDelay, registerClose, shouldSkipDelay }),
    [openDelay, closeDelay, registerClose, shouldSkipDelay],
  )

  return (
    <TooltipProviderContext.Provider value={ctx}>
      {children}
    </TooltipProviderContext.Provider>
  )
}
TooltipProvider.displayName = 'TooltipProvider'
