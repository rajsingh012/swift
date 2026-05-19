import { createContext, useContext, type RefObject } from 'react'
import type { AccordionType } from './Accordion.types'

export interface AccordionRootContextValue {
  type: AccordionType
  collapsible: boolean
  disabled: boolean
  values: string[]
  toggle: (itemValue: string) => void
  registerTrigger: (itemValue: string, node: HTMLElement | null) => void
  focusItem: (
    fromItemValue: string,
    direction: 'next' | 'prev' | 'first' | 'last',
  ) => void
  orderRef: RefObject<string[]>
}

export const AccordionRootContext =
  createContext<AccordionRootContextValue | null>(null)

export function useAccordionRoot(componentName: string): AccordionRootContextValue {
  const ctx = useContext(AccordionRootContext)
  if (!ctx) {
    throw new Error(
      `<${componentName}> must be used inside <Accordion>.`,
    )
  }
  return ctx
}

export interface AccordionItemContextValue {
  value: string
  open: boolean
  disabled: boolean
  triggerId: string
  contentId: string
}

export const AccordionItemContext =
  createContext<AccordionItemContextValue | null>(null)

export function useAccordionItem(componentName: string): AccordionItemContextValue {
  const ctx = useContext(AccordionItemContext)
  if (!ctx) {
    throw new Error(
      `<${componentName}> must be used inside <Accordion.Item>.`,
    )
  }
  return ctx
}
