import { InputRootComponent } from './Input'
import { InputErrorMessage } from './InputErrorMessage'
import { InputField } from './InputField'
import { InputGroup } from './InputGroup'
import { InputHelperText } from './InputHelperText'
import { InputLabel } from './InputLabel'
import { InputRoot } from './InputRoot'

export const Input = Object.assign(InputRootComponent, {
  Root: InputRoot,
  Label: InputLabel,
  Field: InputField,
  HelperText: InputHelperText,
  ErrorMessage: InputErrorMessage,
  Group: InputGroup,
}) as typeof InputRootComponent & {
  Root: typeof InputRoot
  Label: typeof InputLabel
  Field: typeof InputField
  HelperText: typeof InputHelperText
  ErrorMessage: typeof InputErrorMessage
  Group: typeof InputGroup
}

export type {
  InputProps,
  InputOwnProps,
  InputClasses,
  InputSize,
  InputVariant,
  InputState,
  InputLabelPlacement,
  InputLabelProps,
  InputFieldProps,
  InputHelperTextProps,
  InputErrorMessageProps,
  InputGroupProps,
  InputGroupType,
  InputGroupOwnProps,
} from './Input.types'

export type { InputRootProps } from './InputRoot'

export default Input
