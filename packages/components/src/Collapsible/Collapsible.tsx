import { CollapsibleContent } from './CollapsibleContent'
import { CollapsibleRoot } from './CollapsibleRoot'
import { CollapsibleTrigger } from './CollapsibleTrigger'

/**
 * Collapsible — a single show/hide disclosure.
 *
 *   <Collapsible>
 *     <Collapsible.Trigger>Show more</Collapsible.Trigger>
 *     <Collapsible.Content>Hidden details…</Collapsible.Content>
 *   </Collapsible>
 */
export const Collapsible = Object.assign(CollapsibleRoot, {
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
})
