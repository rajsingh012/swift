import { RadioComponent } from './Radio'
import { RadioDescription } from './RadioDescription'
import { RadioErrorMessage } from './RadioErrorMessage'
import { RadioIndicator } from './RadioIndicator'
import { RadioInput } from './RadioInput'
import { RadioLabel } from './RadioLabel'
import { RadioRoot } from './RadioRoot'

export const Radio = Object.assign(RadioComponent, {
  Root: RadioRoot,
  Input: RadioInput,
  Indicator: RadioIndicator,
  Label: RadioLabel,
  Description: RadioDescription,
  ErrorMessage: RadioErrorMessage,
}) as typeof RadioComponent & {
  Root: typeof RadioRoot
  Input: typeof RadioInput
  Indicator: typeof RadioIndicator
  Label: typeof RadioLabel
  Description: typeof RadioDescription
  ErrorMessage: typeof RadioErrorMessage
}

export { RadioGroup } from './RadioGroup'

export type {
  RadioProps,
  RadioOwnProps,
  RadioClasses,
  RadioSize,
  RadioRootProps,
  RadioInputProps,
  RadioIndicatorProps,
  RadioLabelProps,
  RadioDescriptionProps,
  RadioErrorMessageProps,
  RadioGroupProps,
  RadioGroupOwnProps,
} from './Radio.types'

export default Radio
