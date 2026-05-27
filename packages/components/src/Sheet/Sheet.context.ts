import { createContext, useContext, type RefObject } from 'react'

export interface SheetContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  modal: boolean
  contentId: string
  titleId: string
  descriptionId: string
  hasTitle: boolean
  hasDescription: boolean
  setHasTitle: (present: boolean) => void
  setHasDescription: (present: boolean) => void
  triggerRef: RefObject<HTMLElement | null>
}

export const SheetContext = createContext<SheetContextValue | null>(null)

export function useSheet(componentName: string): SheetContextValue {
  const ctx = useContext(SheetContext)
  if (!ctx) {
    throw new Error(`<${componentName}> must be used inside <Sheet>.`)
  }
  return ctx
}
