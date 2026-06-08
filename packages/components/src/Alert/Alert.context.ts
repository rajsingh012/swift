import { createContext, useContext } from 'react'
import {
  DEFAULT_APPEARANCE,
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
} from './Alert.constants'
import type { AlertAppearance, AlertSize, AlertVariant } from './Alert.types'

export interface AlertContextValue {
  /** Root element id — referenced by aria-labelledby / aria-describedby
   *  on the root if a Title / Description are present. */
  id: string
  /** Stable id for `Alert.Title` so the root can wire `aria-labelledby`. */
  titleId: string
  /** Stable id for `Alert.Description` so the root can wire `aria-describedby`. */
  descriptionId: string

  variant: AlertVariant
  size: AlertSize
  appearance: AlertAppearance

  /** Whether the alert is currently mounted-and-open. Compound parts
   *  read this to drive `data-state` etc. when they're rendered outside
   *  the root <div>'s data-state cascade. */
  open: boolean

  /** Whether a close button should render. Drives Alert.Close's render
   *  guard so consumers can drop `<Alert.Close />` unconditionally and
   *  let the parent decide whether to render it. */
  dismissible: boolean

  /** Trigger dismiss. Called by Alert.Close (and by the convenience
   *  layout's auto-rendered close button). */
  close: () => void
}

/** Default values used when a compound part is rendered without a Root —
 *  rare, but lets the parts fail soft (no crash, just default chrome). */
const FALLBACK: AlertContextValue = {
  id: '',
  titleId: '',
  descriptionId: '',
  variant: DEFAULT_VARIANT,
  size: DEFAULT_SIZE,
  appearance: DEFAULT_APPEARANCE,
  open: true,
  dismissible: false,
  close: () => {},
}

export const AlertContext = createContext<AlertContextValue | null>(null)

export function useAlertContext(): AlertContextValue {
  return useContext(AlertContext) ?? FALLBACK
}
