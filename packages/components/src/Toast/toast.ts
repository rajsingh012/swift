import type { ReactNode } from 'react'
import { toastStore } from './Toast.store'
import type { ToastApi, ToastOptions, ToastType } from './Toast.types'

function variant(type: ToastType) {
  return (message: ReactNode, options: ToastOptions = {}): string =>
    toastStore.add(message, { ...options, type: options.type ?? type })
}

function base(message: ReactNode, options?: ToastOptions): string {
  return toastStore.add(message, options)
}

/**
 * Imperative entry point. Safe to import and call from anywhere — the
 * store is a module-singleton and is decoupled from React. Calls fired
 * before <ToastProvider> mounts are dropped on first unmount (when the
 * provider count drops back to zero), so app boot ordering matters but
 * isn't fragile.
 *
 *     import { toast } from '@swift/components/Toast'
 *     toast.success('Saved')
 *     toast.error('Failed', { action: { label: 'Retry', onClick: retry } })
 *     toast.dismiss(id)        // dismiss one
 *     toast.dismiss()          // dismiss all
 */
export const toast: ToastApi = Object.assign(base, {
  success: variant('success'),
  error: variant('error'),
  warning: variant('warning'),
  info: variant('info'),
  dismiss: (id?: string) => toastStore.dismiss(id),
})
