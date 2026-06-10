import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { TooltipPortalProps } from './Tooltip.types'

/**
 * SSR-safe portal. Defers until the client has mounted so the server
 * render never touches `document`, then portals into `container` (default
 * `document.body`) so the tooltip escapes `overflow: hidden` ancestors.
 */
export function TooltipPortal({ container, children }: TooltipPortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  const target = container ?? document.body
  return createPortal(children, target)
}
TooltipPortal.displayName = 'Tooltip.Portal'
