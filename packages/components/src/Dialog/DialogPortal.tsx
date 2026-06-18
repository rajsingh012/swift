import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { DialogPortalProps } from './Dialog.types'

export function DialogPortal({ container, children }: DialogPortalProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return createPortal(children, container ?? document.body)
}
DialogPortal.displayName = 'Dialog.Portal'
