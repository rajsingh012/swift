import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  DEFAULT_OFFSET,
  DEFAULT_PLACEMENT,
} from './Popover.constants'
import { PopoverContext, type PopoverContextValue } from './Popover.context'
import type { PopoverRootProps } from './Popover.types'
import { useControllableState } from './Popover.utils'

/**
 * Popover root — owns open state, shared refs (trigger / anchor / arrow), the
 * generated ids, and positioning config. Renders no DOM; compose
 * `<Popover.Trigger>` + `<Popover.Portal><Popover.Content/></...>`.
 */
export function PopoverRoot(props: PopoverRootProps) {
  const {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    modal = false,
    placement = DEFAULT_PLACEMENT,
    offset = DEFAULT_OFFSET,
    dir: dirProp,
    id,
    children,
  } = props

  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange)

  const reactId = useId()
  const contentId = id ?? `swift-popover-${reactId}`
  const triggerId = `${contentId}-trigger`

  const triggerRef = useRef<HTMLElement | null>(null)
  const anchorRef = useRef<HTMLElement | null>(null)
  const arrowRef = useRef<HTMLSpanElement | null>(null)

  // Lazy RTL detection from the trigger; `dir` prop always wins.
  const [detectedDir, setDetectedDir] = useState<'ltr' | 'rtl'>('ltr')
  useEffect(() => {
    if (dirProp || typeof window === 'undefined') return
    const node = triggerRef.current
    if (!node) return
    if (window.getComputedStyle(node).direction === 'rtl') setDetectedDir('rtl')
  }, [dirProp, open])
  const dir = dirProp ?? detectedDir

  const ctx = useMemo<PopoverContextValue>(
    () => ({
      open,
      setOpen,
      modal,
      contentId,
      triggerId,
      triggerRef,
      anchorRef,
      arrowRef,
      placement,
      offset,
      dir,
    }),
    [open, setOpen, modal, contentId, triggerId, placement, offset, dir],
  )

  return <PopoverContext.Provider value={ctx}>{children}</PopoverContext.Provider>
}
PopoverRoot.displayName = 'Popover'
