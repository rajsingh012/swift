import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { DatePickerPortalProps } from './DatePicker.types'

export function DatePickerPortal({ container, children }: DatePickerPortalProps) {
  const [mounted, setMounted] = useState(false)

  // Defer until client mount so SSR never touches `document`.
  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  const target = container ?? document.body
  return createPortal(children, target)
}
DatePickerPortal.displayName = 'DatePicker.Portal'
