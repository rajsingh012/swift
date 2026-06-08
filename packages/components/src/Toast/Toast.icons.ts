import { CheckCircleFilled } from '@swift/icons/CheckCircleFilled'
import { CloseCircleFilled } from '@swift/icons/CloseCircleFilled'
import { ExclamationCircleFilled } from '@swift/icons/ExclamationCircleFilled'
import { InfoCircleFilled } from '@swift/icons/InfoCircleFilled'
import type { ComponentType } from 'react'
import type { ToastType } from './Toast.types'

type IconComponent = ComponentType<{ size?: number; className?: string }>

/** Default glyph rendered when `type !== 'default'` and no `icon` override
 *  is supplied. The `default` type renders no leading icon. */
export const DEFAULT_TYPE_ICON: Partial<Record<ToastType, IconComponent>> = {
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled,
  info: InfoCircleFilled,
}
