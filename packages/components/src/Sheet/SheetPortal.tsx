import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { SheetPortalProps } from './Sheet.types'

export function SheetPortal({ container, children }: SheetPortalProps) {
  const [mounted, setMounted] = useState(false)

  // Portals can't render during SSR — wait for the client mount so we never
  // mismatch hydration or touch `document` on the server.
  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  const target = container ?? document.body
  return createPortal(children, target)
}
SheetPortal.displayName = 'Sheet.Portal'
