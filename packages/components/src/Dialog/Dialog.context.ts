import { createContext, useContext, type RefObject } from 'react'

export interface DialogContextValue {
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

export const DialogContext = createContext<DialogContextValue | null>(null)

export function useDialog(componentName: string): DialogContextValue {
  const ctx = useContext(DialogContext)
  if (!ctx) {
    throw new Error(`<${componentName}> must be used inside <Dialog>.`)
  }
  return ctx
}
