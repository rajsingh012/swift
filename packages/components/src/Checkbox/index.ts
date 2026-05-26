import { CheckboxComponent } from './Checkbox'
import { CheckboxDescription } from './CheckboxDescription'
import { CheckboxErrorMessage } from './CheckboxErrorMessage'
import { CheckboxIndicator } from './CheckboxIndicator'
import { CheckboxInput } from './CheckboxInput'
import { CheckboxLabel } from './CheckboxLabel'
import { CheckboxRoot } from './CheckboxRoot'

export const Checkbox = Object.assign(CheckboxComponent, {
  Root: CheckboxRoot,
  Input: CheckboxInput,
  Indicator: CheckboxIndicator,
  Label: CheckboxLabel,
  Description: CheckboxDescription,
  ErrorMessage: CheckboxErrorMessage,
}) as typeof CheckboxComponent & {
  Root: typeof CheckboxRoot
  Input: typeof CheckboxInput
  Indicator: typeof CheckboxIndicator
  Label: typeof CheckboxLabel
  Description: typeof CheckboxDescription
  ErrorMessage: typeof CheckboxErrorMessage
}

export { CheckboxGroup } from './CheckboxGroup'

export type {
  CheckboxProps,
  CheckboxOwnProps,
  CheckboxClasses,
  CheckboxSize,
  CheckboxState,
  CheckboxRootProps,
  CheckboxInputProps,
  CheckboxIndicatorProps,
  CheckboxLabelProps,
  CheckboxDescriptionProps,
  CheckboxErrorMessageProps,
  CheckboxGroupProps,
  CheckboxGroupOwnProps,
} from './Checkbox.types'

export default Checkbox
