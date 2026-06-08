import { useEffect, useMemo } from 'react'
import {
  DEFAULT_APPEARANCE,
  DEFAULT_DURATION,
  DEFAULT_MAX_VISIBLE,
  DEFAULT_POSITION,
} from './Toast.constants'
import { ToastContext, type ToastContextValue } from './Toast.context'
import { toastStore } from './Toast.store'
import type { ToastProviderProps } from './Toast.types'
import { ToastViewport } from './ToastViewport'

export function ToastProvider({
  children,
  position = DEFAULT_POSITION,
  appearance = DEFAULT_APPEARANCE,
  duration = DEFAULT_DURATION,
  maxVisible = DEFAULT_MAX_VISIBLE,
  renderViewport = true,
}: ToastProviderProps) {
  // Write defaults during render — idempotent and avoids the
  // "child mounted → toast() fired → parent effect not yet run"
  // window that would leave queued toasts using stale defaults.
  toastStore.setDefaults({ position, appearance, duration, maxVisible })

  useEffect(() => toastStore.registerProvider(), [])

  const ctx = useMemo<ToastContextValue>(
    () => ({
      defaultPosition: position,
      defaultDuration: duration,
      maxVisible,
    }),
    [position, duration, maxVisible],
  )

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {renderViewport ? <ToastViewport /> : null}
    </ToastContext.Provider>
  )
}
ToastProvider.displayName = 'ToastProvider'
