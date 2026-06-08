import { CheckCircleFilled } from '@swift/icons/CheckCircleFilled'
import { CloseCircleFilled } from '@swift/icons/CloseCircleFilled'
import { ExclamationCircleFilled } from '@swift/icons/ExclamationCircleFilled'
import { InfoCircleFilled } from '@swift/icons/InfoCircleFilled'
import type { ComponentType } from 'react'
import type { AlertVariant } from './Alert.types'

type IconComponent = ComponentType<{ size?: number; className?: string }>

/** Default glyph rendered when `variant !== 'default'` and no `icon`
 *  override is supplied. The `default` variant renders no leading icon.
 *  Same icon set Toast uses — kept independent so the two components
 *  can diverge later without coupling. */
export const DEFAULT_VARIANT_ICON: Partial<Record<AlertVariant, IconComponent>> =
  {
    success: CheckCircleFilled,
    error: CloseCircleFilled,
    warning: ExclamationCircleFilled,
    info: InfoCircleFilled,
  }
