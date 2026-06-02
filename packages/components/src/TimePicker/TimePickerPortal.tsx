import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { TimePickerPortalProps } from './TimePicker.types'

export function TimePickerPortal({ container, children }: TimePickerPortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  const target = container ?? document.body
  return createPortal(children, target)
}
TimePickerPortal.displayName = 'TimePicker.Portal'
