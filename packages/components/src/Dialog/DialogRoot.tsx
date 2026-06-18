import { useId, useMemo, useRef, useState } from 'react'
import { DialogContext, type DialogContextValue } from './Dialog.context'
import type { DialogRootProps } from './Dialog.types'
import { useControllableState } from './Dialog.utils'

export function DialogRoot(props: DialogRootProps) {
  const { open: openProp, defaultOpen = false, onOpenChange, modal = true, children } =
    props

  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange)

  const reactId = useId()
  const contentId = `swift-dialog-content-${reactId}`
  const titleId = `swift-dialog-title-${reactId}`
  const descriptionId = `swift-dialog-description-${reactId}`

  const [hasTitle, setHasTitle] = useState(false)
  const [hasDescription, setHasDescription] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)

  const ctx = useMemo<DialogContextValue>(
    () => ({
      open,
      setOpen,
      modal,
      contentId,
      titleId,
      descriptionId,
      hasTitle,
      hasDescription,
      setHasTitle,
      setHasDescription,
      triggerRef,
    }),
    [open, setOpen, modal, contentId, titleId, descriptionId, hasTitle, hasDescription],
  )

  return <DialogContext.Provider value={ctx}>{children}</DialogContext.Provider>
}
DialogRoot.displayName = 'Dialog'
