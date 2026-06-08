import { ToastAction } from './ToastAction'
import { ToastClose } from './ToastClose'
import { ToastDescription } from './ToastDescription'
import { ToastIcon } from './ToastIcon'
import { ToastRoot } from './ToastRoot'
import { ToastTitle } from './ToastTitle'

export const Toast = Object.assign(ToastRoot, {
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
  Icon: ToastIcon,
}) as typeof ToastRoot & {
  Title: typeof ToastTitle
  Description: typeof ToastDescription
  Action: typeof ToastAction
  Close: typeof ToastClose
  Icon: typeof ToastIcon
}

export default Toast

export { ToastProvider } from './ToastProvider'
export { ToastViewport } from './ToastViewport'
export { toast } from './toast'

export type {
  ToastApi,
  ToastActionConfig,
  ToastActionProps,
  ToastAppearance,
  ToastCloseProps,
  ToastDescriptionProps,
  ToastIconProps,
  ToastItem,
  ToastOptions,
  ToastPosition,
  ToastProviderProps,
  ToastRootProps,
  ToastTitleProps,
  ToastType,
  ToastViewportProps,
} from './Toast.types'
