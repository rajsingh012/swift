import { ButtonRoot } from './ButtonRoot'
import { ButtonLabel } from './ButtonLabel'
import { ButtonLeftIcon } from './ButtonLeftIcon'
import { ButtonRightIcon } from './ButtonRightIcon'
import type { ButtonComponent } from './Button.types'

/**
 * Button supports two interchangeable APIs:
 *
 *   // Simple — pass children (and optional icons via composition):
 *   <Button variant="primary">Save</Button>
 *
 *   // Compound — explicit slots that inherit size/variant via context:
 *   <Button variant="primary">
 *     <Button.LeftIcon><SaveIcon /></Button.LeftIcon>
 *     <Button.Label>Save</Button.Label>
 *   </Button>
 */
export const Button = Object.assign(ButtonRoot as unknown as ButtonComponent, {
  Root: ButtonRoot,
  Label: ButtonLabel,
  LeftIcon: ButtonLeftIcon,
  RightIcon: ButtonRightIcon,
}) as ButtonComponent & {
  Root: typeof ButtonRoot
  Label: typeof ButtonLabel
  LeftIcon: typeof ButtonLeftIcon
  RightIcon: typeof ButtonRightIcon
}
