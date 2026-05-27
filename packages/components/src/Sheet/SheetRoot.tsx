import { useId, useMemo, useRef, useState } from 'react'
import { SheetContext, type SheetContextValue } from './Sheet.context'
import type { SheetRootProps } from './Sheet.types'
import { useControllableState } from './Sheet.utils'

export function SheetRoot(props: SheetRootProps) {
  const {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    modal = true,
    children,
  } = props

  const [open, setOpen] = useControllableState(
    openProp,
    defaultOpen,
    onOpenChange,
  )

  const reactId = useId()
  const contentId = `sheet-content-${reactId}`
  const titleId = `sheet-title-${reactId}`
  const descriptionId = `sheet-description-${reactId}`

  const [hasTitle, setHasTitle] = useState(false)
  const [hasDescription, setHasDescription] = useState(false)
  const triggerRef = useRef<HTMLElement | null>(null)

  const ctx = useMemo<SheetContextValue>(
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
    [
      open,
      setOpen,
      modal,
      contentId,
      titleId,
      descriptionId,
      hasTitle,
      hasDescription,
    ],
  )

  return <SheetContext.Provider value={ctx}>{children}</SheetContext.Provider>
}
SheetRoot.displayName = 'Sheet'
