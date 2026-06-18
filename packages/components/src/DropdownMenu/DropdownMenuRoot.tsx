import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { DEFAULT_OFFSET, DEFAULT_PLACEMENT } from './DropdownMenu.constants'
import {
  DropdownMenuContext,
  type DropdownMenuContextValue,
  type MenuFocusDirection,
} from './DropdownMenu.context'
import type { DropdownMenuRootProps } from './DropdownMenu.types'
import { useControllableState } from './DropdownMenu.utils'

/**
 * DropdownMenu root — owns open state, the item registry for roving focus and
 * typeahead, shared refs, and positioning config. Renders no DOM.
 */
export function DropdownMenuRoot(props: DropdownMenuRootProps) {
  const {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    placement = DEFAULT_PLACEMENT,
    offset = DEFAULT_OFFSET,
    dir: dirProp,
    id,
    children,
  } = props

  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange)

  const reactId = useId()
  const contentId = id ?? `swift-menu-${reactId}`
  const triggerId = `${contentId}-trigger`

  const triggerRef = useRef<HTMLElement | null>(null)
  const itemsRef = useRef<HTMLElement[]>([])

  const [detectedDir, setDetectedDir] = useState<'ltr' | 'rtl'>('ltr')
  useEffect(() => {
    if (dirProp || typeof window === 'undefined') return
    const node = triggerRef.current
    if (node && window.getComputedStyle(node).direction === 'rtl') setDetectedDir('rtl')
  }, [dirProp, open])
  const dir = dirProp ?? detectedDir

  // Items register their DOM node; we keep them in document order by sorting on
  // DOM position at read time (simpler than tracking insertion order across
  // conditional rendering).
  const registerItem = useCallback((node: HTMLElement | null) => {
    if (!node) return
    if (!itemsRef.current.includes(node)) itemsRef.current.push(node)
  }, [])

  const enabledItems = useCallback(() => {
    // Filter to live, enabled items and sort by DOM order.
    const live = itemsRef.current.filter(
      (el) => el.isConnected && !el.hasAttribute('data-disabled'),
    )
    live.sort((a, b) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    )
    // Prune dead nodes so the array doesn't grow unbounded.
    itemsRef.current = itemsRef.current.filter((el) => el.isConnected)
    return live
  }, [])

  const focusItem = useCallback(
    (from: HTMLElement | null, direction: MenuFocusDirection) => {
      const items = enabledItems()
      if (items.length === 0) return
      let next: HTMLElement | undefined
      if (direction === 'first') next = items[0]
      else if (direction === 'last') next = items[items.length - 1]
      else {
        const idx = from ? items.indexOf(from) : -1
        if (idx === -1) next = items[0]
        else if (direction === 'next') next = items[(idx + 1) % items.length]
        else next = items[(idx - 1 + items.length) % items.length]
      }
      next?.focus()
    },
    [enabledItems],
  )

  // Typeahead buffer — characters typed within a short window jump to the
  // matching item.
  const typeaheadBuffer = useRef('')
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onTypeahead = useCallback(
    (char: string) => {
      const items = enabledItems()
      if (items.length === 0) return
      typeaheadBuffer.current += char.toLowerCase()
      if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current)
      typeaheadTimer.current = setTimeout(() => {
        typeaheadBuffer.current = ''
      }, 500)

      const query = typeaheadBuffer.current
      const active = document.activeElement as HTMLElement | null
      const startIdx = active ? items.indexOf(active) + 1 : 0
      // Search from after the current item, wrapping around.
      const ordered = [...items.slice(startIdx), ...items.slice(0, startIdx)]
      const match = ordered.find((el) =>
        (el.textContent ?? '').trim().toLowerCase().startsWith(query),
      )
      match?.focus()
    },
    [enabledItems],
  )

  useEffect(
    () => () => {
      if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current)
    },
    [],
  )

  const ctx = useMemo<DropdownMenuContextValue>(
    () => ({
      open,
      setOpen,
      contentId,
      triggerId,
      triggerRef,
      placement,
      offset,
      dir,
      itemsRef,
      registerItem,
      focusItem,
      onTypeahead,
    }),
    [open, setOpen, contentId, triggerId, placement, offset, dir, registerItem, focusItem, onTypeahead],
  )

  return (
    <DropdownMenuContext.Provider value={ctx}>
      {children}
    </DropdownMenuContext.Provider>
  )
}
DropdownMenuRoot.displayName = 'DropdownMenu'
