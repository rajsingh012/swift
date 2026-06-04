import { TimePickerActions } from './TimePickerActions'
import { TimePickerCancel } from './TimePickerCancel'
import { TimePickerContent } from './TimePickerContent'
import { TimePickerOK } from './TimePickerOK'
import { TimePickerPortal } from './TimePickerPortal'
import { TimePickerRoot } from './TimePickerRoot'
import { TimePickerSteppers } from './TimePickerSteppers'
import { TimePickerTrigger } from './TimePickerTrigger'

/**
 * TimePicker — popover with a stepper UI (up/down chevrons per slot,
 * AM/PM toggle, formatted preview, OK / Cancel).
 *
 * Without children, renders the default trigger + popover with steppers
 * and actions. Compose the parts explicitly to customise the layout.
 */
export const TimePicker = Object.assign(TimePickerRoot, {
  Trigger: TimePickerTrigger,
  Portal: TimePickerPortal,
  Content: TimePickerContent,
  Steppers: TimePickerSteppers,
  Actions: TimePickerActions,
  Cancel: TimePickerCancel,
  OK: TimePickerOK,
}) as typeof TimePickerRoot & {
  Trigger: typeof TimePickerTrigger
  Portal: typeof TimePickerPortal
  Content: typeof TimePickerContent
  Steppers: typeof TimePickerSteppers
  Actions: typeof TimePickerActions
  Cancel: typeof TimePickerCancel
  OK: typeof TimePickerOK
}
