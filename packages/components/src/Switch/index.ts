import { SwitchComponent } from './Switch'
import { SwitchDescription } from './SwitchDescription'
import { SwitchErrorMessage } from './SwitchErrorMessage'
import { SwitchInput } from './SwitchInput'
import { SwitchLabel } from './SwitchLabel'
import { SwitchRoot } from './SwitchRoot'
import { SwitchThumb } from './SwitchThumb'
import { SwitchTrack } from './SwitchTrack'

export const Switch = Object.assign(SwitchComponent, {
  Root: SwitchRoot,
  Input: SwitchInput,
  Track: SwitchTrack,
  Thumb: SwitchThumb,
  Label: SwitchLabel,
  Description: SwitchDescription,
  ErrorMessage: SwitchErrorMessage,
}) as typeof SwitchComponent & {
  Root: typeof SwitchRoot
  Input: typeof SwitchInput
  Track: typeof SwitchTrack
  Thumb: typeof SwitchThumb
  Label: typeof SwitchLabel
  Description: typeof SwitchDescription
  ErrorMessage: typeof SwitchErrorMessage
}

export default Switch

export { SwitchGroup } from './SwitchGroup'

export type {
  SwitchApi,
  SwitchProps,
  SwitchOwnProps,
  SwitchClasses,
  SwitchSize,
  SwitchVariant,
  SwitchRootProps,
  SwitchInputProps,
  SwitchTrackProps,
  SwitchThumbProps,
  SwitchLabelProps,
  SwitchDescriptionProps,
  SwitchErrorMessageProps,
  SwitchGroupProps,
  SwitchGroupOwnProps,
} from './Switch.types'
