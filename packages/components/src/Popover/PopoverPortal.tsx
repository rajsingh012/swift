import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { PopoverPortalProps } from './Popover.types'

/** SSR-safe portal into `container` (default `document.body`). */
export function PopoverPortal({ container, children }: PopoverPortalProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return createPortal(children, container ?? document.body)
}
PopoverPortal.displayName = 'Popover.Portal'
