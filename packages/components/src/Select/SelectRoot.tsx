import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { DEFAULT_OFFSET, DEFAULT_PLACEMENT } from './Select.constants'
import {
  SelectContext,
  type SelectContextValue,
  type SelectFocusDirection,
} from './Select.context'
import type { SelectItemData, SelectRootProps } from './Select.types'
import { useControllableState } from './Select.utils'

/**
 * Select root — owns value + open state, the item registry (for keyboard nav
 * and typeahead), the value→label map (so the trigger can render the chosen
 * label), positioning config, and an optional hidden input for forms.
 */
export function SelectRoot(props: SelectRootProps) {
  const {
    value: valueProp,
    defaultValue = null,
    onValueChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    required = false,
    name,
    placement = DEFAULT_PLACEMENT,
    offset = DEFAULT_OFFSET,
    dir: dirProp,
    id,
    children,
  } = props

  const [value, setValueState] = useControllableState<string | null>(
    valueProp,
    defaultValue,
    (next) => {
      if (next !== null) onValueChange?.(next)
    },
  )
  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange)
  const [highlighted, setHighlighted] = useState<string | null>(null)

  const reactId = useId()
  const contentId = id ?? `swift-select-${reactId}`
  const triggerId = `${contentId}-trigger`
  const labelId = `${contentId}-label`

  const triggerRef = useRef<HTMLElement | null>(null)

  const [detectedDir, setDetectedDir] = useState<'ltr' | 'rtl'>('ltr')
  useEffect(() => {
    if (dirProp || typeof window === 'undefined') return
    const node = triggerRef.current
    if (node && window.getComputedStyle(node).direction === 'rtl') setDetectedDir('rtl')
  }, [dirProp, open])
  const dir = dirProp ?? detectedDir

  // ── Label registry (value → display text) ──
  // Backed by a version counter so <Select.Value> re-renders when an item
  // registers its label (the ref alone wouldn't trigger a render).
  const labelsRef = useRef<Map<string, string>>(new Map())
  const [labelVersion, bumpLabels] = useState(0)
  const registerLabel = useCallback((v: string, text: string) => {
    if (labelsRef.current.get(v) === text) return
    labelsRef.current.set(v, text)
    bumpLabels((n) => n + 1)
  }, [])

  // ── Item registry (keyboard nav / typeahead) ──
  const itemsRef = useRef<SelectItemData[]>([])
  const registerItem = useCallback((item: SelectItemData) => {
    const existing = itemsRef.current.findIndex((i) => i.value === item.value)
    if (existing === -1) itemsRef.current.push(item)
    else itemsRef.current[existing] = item
  }, [])
  const unregisterItem = useCallback((v: string) => {
    itemsRef.current = itemsRef.current.filter((i) => i.value !== v)
  }, [])

  const enabledItems = useCallback(() => {
    const live = itemsRef.current.filter(
      (i) => i.ref.current?.isConnected && !i.disabled,
    )
    live.sort((a, b) => {
      const an = a.ref.current
      const bn = b.ref.current
      if (!an || !bn) return 0
      return an.compareDocumentPosition(bn) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    })
    return live
  }, [])

  const setValue = useCallback(
    (next: string) => {
      setValueState(next)
      setOpen(false)
    },
    [setValueState, setOpen],
  )

  const moveHighlight = useCallback(
    (direction: SelectFocusDirection) => {
      const items = enabledItems()
      if (items.length === 0) return
      const values = items.map((i) => i.value)
      const current = highlighted ?? value
      let nextIdx: number
      const idx = current ? values.indexOf(current) : -1
      switch (direction) {
        case 'first':
          nextIdx = 0
          break
        case 'last':
          nextIdx = values.length - 1
          break
        case 'next':
          nextIdx = idx === -1 ? 0 : Math.min(idx + 1, values.length - 1)
          break
        case 'prev':
          nextIdx = idx === -1 ? values.length - 1 : Math.max(idx - 1, 0)
          break
      }
      setHighlighted(values[nextIdx])
      items[nextIdx].ref.current?.scrollIntoView?.({ block: 'nearest' })
    },
    [enabledItems, highlighted, value],
  )

  // ── Typeahead ──
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
      const current = highlighted ?? value
      const startIdx = current ? items.findIndex((i) => i.value === current) + 1 : 0
      const ordered = [...items.slice(startIdx), ...items.slice(0, startIdx)]
      const match = ordered.find((i) => i.textValue.toLowerCase().startsWith(query))
      if (match) {
        setHighlighted(match.value)
        match.ref.current?.scrollIntoView?.({ block: 'nearest' })
        if (!open) setValueState(match.value)
      }
    },
    [enabledItems, highlighted, value, open, setValueState],
  )

  useEffect(
    () => () => {
      if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current)
    },
    [],
  )

  const ctx = useMemo<SelectContextValue>(
    () => ({
      open,
      setOpen,
      value,
      setValue,
      disabled,
      required,
      contentId,
      triggerId,
      labelId,
      triggerRef,
      placement,
      offset,
      dir,
      labelsRef,
      registerLabel,
      itemsRef,
      registerItem,
      unregisterItem,
      highlighted,
      setHighlighted,
      moveHighlight,
      onTypeahead,
    }),
    [
      open,
      setOpen,
      value,
      setValue,
      disabled,
      required,
      contentId,
      triggerId,
      labelId,
      placement,
      offset,
      dir,
      registerLabel,
      registerItem,
      unregisterItem,
      highlighted,
      moveHighlight,
      onTypeahead,
      labelVersion,
    ],
  )

  return (
    <SelectContext.Provider value={ctx}>
      {children}
      {name ? (
        <input
          type="hidden"
          name={name}
          value={value ?? ''}
          required={required}
        />
      ) : null}
    </SelectContext.Provider>
  )
}
SelectRoot.displayName = 'Select'
