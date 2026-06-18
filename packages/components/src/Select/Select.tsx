import { SelectRoot } from './SelectRoot'
import { SelectTrigger } from './SelectTrigger'
import { SelectValue } from './SelectValue'
import { SelectContent } from './SelectContent'
import { SelectItem } from './SelectItem'
import { SelectGroup, SelectPortal, SelectSeparator } from './SelectParts'

/**
 * Select — a listbox-backed single-select control.
 *
 *   <Select defaultValue="apple" onValueChange={setFruit}>
 *     <Select.Trigger>
 *       <Select.Value placeholder="Pick a fruit" />
 *     </Select.Trigger>
 *     <Select.Portal>
 *       <Select.Content>
 *         <Select.Item value="apple">Apple</Select.Item>
 *         <Select.Item value="banana">Banana</Select.Item>
 *       </Select.Content>
 *     </Select.Portal>
 *   </Select>
 *
 * Floating listbox, keyboard nav + typeahead, optional hidden input for forms
 * (`name`). Controlled/uncontrolled via `value`/`defaultValue`/`onValueChange`.
 */
export const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Value: SelectValue,
  Portal: SelectPortal,
  Content: SelectContent,
  Item: SelectItem,
  Group: SelectGroup,
  Separator: SelectSeparator,
})
