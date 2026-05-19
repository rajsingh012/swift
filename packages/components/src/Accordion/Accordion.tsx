import { AccordionContent } from './AccordionContent'
import { AccordionHeader } from './AccordionHeader'
import { AccordionItem } from './AccordionItem'
import { AccordionRoot } from './AccordionRoot'
import { AccordionTrigger } from './AccordionTrigger'

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Header: AccordionHeader,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
})
