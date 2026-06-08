import { useMemo, type ReactNode } from 'react'
import { ToastProvider, toast } from '@swift/components/Toast'

export { ToastProvider }

/**
 * Compat shim — existing call sites use `useToast().show(message)`. The
 * underlying engine is now @swift/components/Toast, so new code should
 * prefer `import { toast } from '@swift/components/Toast'` directly.
 */
export function useToast() {
  return useMemo(
    () => ({
      show: (message: ReactNode) => toast.success(message),
    }),
    [],
  )
}
