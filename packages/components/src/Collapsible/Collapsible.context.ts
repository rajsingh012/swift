import { createContext, useContext } from 'react'

export interface CollapsibleContextValue {
  open: boolean
  disabled: boolean
  toggle: () => void
  contentId: string
  triggerId: string
}

export const CollapsibleContext = createContext<CollapsibleContextValue | null>(
  null,
)

export function useCollapsible(componentName: string): CollapsibleContextValue {
  const ctx = useContext(CollapsibleContext)
  if (!ctx) {
    throw new Error(`<${componentName}> must be used inside <Collapsible>.`)
  }
  return ctx
}
