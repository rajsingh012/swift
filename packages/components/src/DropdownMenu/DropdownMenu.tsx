import { DropdownMenuRoot } from './DropdownMenuRoot'
import { DropdownMenuTrigger } from './DropdownMenuTrigger'
import { DropdownMenuPortal } from './DropdownMenuPortal'
import { DropdownMenuContent } from './DropdownMenuContent'
import { DropdownMenuItem } from './DropdownMenuItem'
import { DropdownMenuCheckboxItem } from './DropdownMenuCheckboxItem'
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from './DropdownMenuParts'

/**
 * DropdownMenu — a button-triggered command menu.
 *
 *   <DropdownMenu>
 *     <DropdownMenu.Trigger>Options</DropdownMenu.Trigger>
 *     <DropdownMenu.Portal>
 *       <DropdownMenu.Content>
 *         <DropdownMenu.Item onSelect={…}>Edit</DropdownMenu.Item>
 *         <DropdownMenu.Separator />
 *         <DropdownMenu.CheckboxItem checked>Show grid</DropdownMenu.CheckboxItem>
 *       </DropdownMenu.Content>
 *     </DropdownMenu.Portal>
 *   </DropdownMenu>
 *
 * Floating placement, roving focus, typeahead, and Escape / outside-click
 * dismissal.
 */
export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Portal: DropdownMenuPortal,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Group: DropdownMenuGroup,
})
