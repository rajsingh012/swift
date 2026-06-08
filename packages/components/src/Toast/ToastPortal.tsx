import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ToastPortalProps {
  container?: HTMLElement
  children: ReactNode
}

/**
 * SSR-safe portal — defers `createPortal` to a client-side effect so the
 * server render and the first client render produce the same (empty) tree.
 * Falls back to document.body when no container is supplied.
 */
export function ToastPortal({ container, children }: ToastPortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  const target = container ?? document.body
  return createPortal(children, target)
}
ToastPortal.displayName = 'ToastPortal'
