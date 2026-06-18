import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { DropdownMenuPortalProps } from './DropdownMenu.types'

export function DropdownMenuPortal({ container, children }: DropdownMenuPortalProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return createPortal(children, container ?? document.body)
}
DropdownMenuPortal.displayName = 'DropdownMenu.Portal'
