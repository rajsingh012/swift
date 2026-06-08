import { Alert as AlertComponent } from './Alert'
import { AlertActions } from './AlertActions'
import { AlertClose } from './AlertClose'
import { AlertContent } from './AlertContent'
import { AlertDescription } from './AlertDescription'
import { AlertIcon } from './AlertIcon'
import { AlertTitle } from './AlertTitle'

export const Alert = Object.assign(AlertComponent, {
  Icon: AlertIcon,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription,
  Actions: AlertActions,
  Close: AlertClose,
}) as typeof AlertComponent & {
  Icon: typeof AlertIcon
  Content: typeof AlertContent
  Title: typeof AlertTitle
  Description: typeof AlertDescription
  Actions: typeof AlertActions
  Close: typeof AlertClose
}

export default Alert

export type {
  AlertActionsProps,
  AlertAppearance,
  AlertClasses,
  AlertCloseProps,
  AlertContentProps,
  AlertDescriptionProps,
  AlertIconProps,
  AlertProps,
  AlertRootProps,
  AlertSize,
  AlertTitleProps,
  AlertVariant,
} from './Alert.types'
