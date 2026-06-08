/**
 * Toast — the imperative `toast()` API + the `<ToastProvider>` and
 * `<ToastViewport>` mounting points.
 *
 * The visual layer is a nested `<Alert>` (see `ToastRoot.tsx`), so the
 * variants / appearances vocabulary is shared. Consumers wanting
 * compound parts (`Alert.Title`, `Alert.Action`, …) for custom toast
 * rendering should import them from `@swift/components/Alert` directly
 * — Toast no longer ships its own compound parts since they would
 * duplicate Alert's.
 */
export { ToastProvider } from './ToastProvider'
export { ToastViewport } from './ToastViewport'
export { toast } from './toast'
export { ToastRoot } from './ToastRoot'

export type {
  ToastApi,
  ToastActionConfig,
  ToastAppearance,
  ToastItem,
  ToastOptions,
  ToastPosition,
  ToastProviderProps,
  ToastRootProps,
  ToastType,
  ToastViewportProps,
} from './Toast.types'
