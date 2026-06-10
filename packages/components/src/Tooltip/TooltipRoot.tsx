import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useControllableState } from '../internal/state'
import {
  DEFAULT_CLOSE_DELAY,
  DEFAULT_OFFSET,
  DEFAULT_OPEN_DELAY,
  DEFAULT_PLACEMENT,
} from './Tooltip.constants'
import {
  TooltipContext,
  useTooltipProvider,
  type TooltipContextValue,
} from './Tooltip.context'
import type { TooltipRootProps } from './Tooltip.types'

/**
 * Tooltip root — owns open state, the open/close delay timers, the shared
 * refs (trigger / arrow / pointer-inside), and the generated content id.
 * Delays inherit from an ancestor `TooltipProvider` when present; own
 * props always win. Renders no DOM of its own; composition is explicit
 * (`<Tooltip.Trigger/>` + `<Tooltip.Portal><Tooltip.Content/></...>`).
 */
export function TooltipRoot(props: TooltipRootProps): ReactNode {
  const {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    trigger = 'hover',
    placement = DEFAULT_PLACEMENT,
    offset = DEFAULT_OFFSET,
    openDelay: openDelayProp,
    closeDelay: closeDelayProp,
    interactive = false,
    disableTouch = false,
    disabled = false,
    dir: dirProp,
    id,
    children,
  } = props

  const provider = useTooltipProvider()
  const openDelay = openDelayProp ?? provider?.openDelay ?? DEFAULT_OPEN_DELAY
  const closeDelay =
    closeDelayProp ?? provider?.closeDelay ?? DEFAULT_CLOSE_DELAY

  const triggerModes = Array.isArray(trigger) ? trigger : [trigger]
  const hoverEnabled = triggerModes.includes('hover')
  const clickEnabled = triggerModes.includes('click')

  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange)
  const openRef = useRef(open)
  openRef.current = open
  // "Pinned" = held open by a click; hover-leave must not close it.
  const pinnedRef = useRef(false)

  const reactId = useId()
  const contentId = id ?? `swift-tooltip-${reactId}`

  const triggerRef = useRef<HTMLElement | null>(null)
  const arrowRef = useRef<HTMLSpanElement | null>(null)
  const isPointerInside = useRef(false)

  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearOpenTimer = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current)
      openTimer.current = null
    }
  }, [])
  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  // Keep a stable setter the callbacks below can depend on without
  // re-creating the whole intent API on every open/close.
  const setOpenRef = useRef(setOpen)
  setOpenRef.current = setOpen

  const cancelScheduled = useCallback(() => {
    clearOpenTimer()
    clearCloseTimer()
  }, [clearOpenTimer, clearCloseTimer])

  const openImmediate = useCallback(() => {
    if (disabled) return
    cancelScheduled()
    setOpenRef.current(true)
  }, [disabled, cancelScheduled])

  const closeImmediate = useCallback(() => {
    cancelScheduled()
    pinnedRef.current = false
    setOpenRef.current(false)
    provider?.registerClose()
  }, [cancelScheduled, provider])

  // Click toggle: pin open when closed or merely hover-open; dismiss when
  // already pinned. Lets hover preview the tooltip and a click hold it.
  const toggle = useCallback(() => {
    if (disabled) return
    cancelScheduled()
    if (openRef.current && pinnedRef.current) {
      pinnedRef.current = false
      setOpenRef.current(false)
      provider?.registerClose()
    } else {
      pinnedRef.current = true
      setOpenRef.current(true)
    }
  }, [disabled, cancelScheduled, provider])

  const scheduleOpen = useCallback(() => {
    if (disabled) return
    clearCloseTimer()
    // Inside the provider's skip window → open instantly.
    if (provider?.shouldSkipDelay() || openDelay <= 0) {
      clearOpenTimer()
      setOpenRef.current(true)
      return
    }
    if (openTimer.current) return
    openTimer.current = setTimeout(() => {
      openTimer.current = null
      setOpenRef.current(true)
    }, openDelay)
  }, [disabled, clearCloseTimer, clearOpenTimer, provider, openDelay])

  const scheduleClose = useCallback(() => {
    // A click-pinned tooltip ignores hover-leave; only an explicit
    // toggle / outside-click / Escape closes it.
    if (pinnedRef.current) return
    clearOpenTimer()
    if (closeDelay <= 0) {
      clearCloseTimer()
      setOpenRef.current(false)
      provider?.registerClose()
      return
    }
    if (closeTimer.current) return
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null
      setOpenRef.current(false)
      provider?.registerClose()
    }, closeDelay)
  }, [clearOpenTimer, clearCloseTimer, closeDelay, provider])

  // Tear down any pending timers if the tooltip unmounts mid-schedule.
  useEffect(
    () => () => {
      if (openTimer.current) clearTimeout(openTimer.current)
      if (closeTimer.current) clearTimeout(closeTimer.current)
    },
    [],
  )

  // Lazy direction detection from the trigger, deferred to an effect so
  // the server render never reads layout. `dir` prop always wins.
  const [detectedDir, setDetectedDir] = useState<'ltr' | 'rtl'>('ltr')
  useEffect(() => {
    if (dirProp || typeof window === 'undefined') return
    const node = triggerRef.current
    if (!node) return
    const computed = window.getComputedStyle(node).direction
    if (computed === 'rtl') setDetectedDir('rtl')
  }, [dirProp, open])
  const dir = dirProp ?? detectedDir

  const ctx = useMemo<TooltipContextValue>(
    () => ({
      open,
      contentId,
      triggerRef,
      arrowRef,
      isPointerInside,
      scheduleOpen,
      scheduleClose,
      openImmediate,
      closeImmediate,
      cancelScheduled,
      toggle,
      placement,
      offset,
      dir,
      interactive,
      disableTouch,
      disabled,
      hoverEnabled,
      clickEnabled,
    }),
    [
      open,
      contentId,
      scheduleOpen,
      scheduleClose,
      openImmediate,
      closeImmediate,
      cancelScheduled,
      toggle,
      placement,
      offset,
      dir,
      interactive,
      disableTouch,
      disabled,
      hoverEnabled,
      clickEnabled,
    ],
  )

  return (
    <TooltipContext.Provider value={ctx}>{children}</TooltipContext.Provider>
  )
}
TooltipRoot.displayName = 'Tooltip'
