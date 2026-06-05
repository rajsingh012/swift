import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { Slot } from '../internal/Slot'
import { mergeRefs } from '../internal/refs'
import { useTabsRoot } from './Tabs.context'
import { cx, triggerClasses } from './Tabs.styles'
import type { TabsTriggerProps } from './Tabs.types'

/**
 * `role="tab"` button. Registers itself with the root on mount so
 * keyboard nav, default-value resolution, and the indicator can all
 * find it by `value`. Implements roving tabindex (only the active
 * trigger is tab-reachable; arrows move focus among triggers).
 *
 * `asChild` clones the consumer's single child element with our props
 * via the internal Slot — useful for using a `<Button>` or a custom
 * link as a tab.
 */
export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger(props, ref) {
    const {
      value,
      disabled = false,
      asChild = false,
      className,
      children,
      onClick,
      onKeyDown,
      ...rest
    } = props
    const root = useTabsRoot('Tabs.Trigger')

    // CRITICAL: depend only on the stable destructured callbacks below,
    // never on the whole `root` object. `root`'s identity changes on
    // every `measureToken` bump — wiring the callback ref to `root`
    // makes it re-fire (old-ref(null) + new-ref(node)) every render,
    // which re-calls registerTrigger, which bumps measureToken, which
    // changes root again → infinite update loop. The functions below
    // are useCallback'd inside TabsRoot with empty / id-only deps, so
    // their identity is stable across renders.
    const { registerTrigger, setValue, focusTrigger, triggerId, contentId } =
      root

    const isActive = root.value === value

    const setTriggerRef = useCallback(
      (node: HTMLElement | null) => {
        registerTrigger(value, node)
      },
      [value, registerTrigger],
    )
    useEffect(() => {
      return () => {
        registerTrigger(value, null)
      }
    }, [value, registerTrigger])

    const handleClick = (event: MouseEvent<HTMLElement>) => {
      onClick?.(event as unknown as MouseEvent<HTMLButtonElement>)
      if (event.defaultPrevented) return
      if (disabled) return
      setValue(value)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event as unknown as KeyboardEvent<HTMLButtonElement>)
      if (event.defaultPrevented) return

      // Manual activation: Enter / Space commits the focused trigger.
      if (event.key === 'Enter' || event.key === ' ') {
        // Browser default would already activate a <button>, but in
        // manual mode an automatic-mode focus shouldn't have selected
        // it yet — so we explicitly commit here and prevent the default
        // to keep behavior consistent across asChild / native button.
        event.preventDefault()
        if (!disabled) setValue(value)
        return
      }

      const isHorizontal = root.orientation === 'horizontal'
      const isRtl = root.dir === 'rtl'

      // Translate arrow keys into a logical next/prev direction. RTL
      // flips horizontal axis; vertical orientation ignores LR keys.
      let direction: 'next' | 'prev' | 'first' | 'last' | null = null
      switch (event.key) {
        case 'ArrowRight':
          if (isHorizontal) direction = isRtl ? 'prev' : 'next'
          break
        case 'ArrowLeft':
          if (isHorizontal) direction = isRtl ? 'next' : 'prev'
          break
        case 'ArrowDown':
          if (!isHorizontal) direction = 'next'
          break
        case 'ArrowUp':
          if (!isHorizontal) direction = 'prev'
          break
        case 'Home':
          direction = 'first'
          break
        case 'End':
          direction = 'last'
          break
      }

      if (direction) {
        event.preventDefault()
        focusTrigger(value, direction)
      }
    }

    const triggerProps = {
      role: 'tab' as const,
      id: triggerId(value),
      type: 'button' as const,
      'aria-selected': isActive,
      'aria-controls': contentId(value),
      'aria-disabled': disabled || undefined,
      // Roving tabindex — only the active trigger is reachable via Tab.
      // Disabled triggers stay focusable via arrow keys? No — they get
      // skipped by focusTrigger's enabled filter. They get tabIndex=-1
      // and don't receive focus at all.
      tabIndex: isActive ? 0 : -1,
      disabled,
      // data-disabled is what registerTrigger / focusTrigger filter on.
      'data-disabled': disabled ? '' : undefined,
      'data-state': isActive ? ('active' as const) : ('inactive' as const),
      'data-orientation': root.orientation,
      className: cx(triggerClasses, className),
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      ...rest,
    }

    // CRITICAL #2: memoize the merged ref. `mergeRefs(...)` returns a
    // brand-new function every render. If we passed that directly to
    // `ref={...}`, React would see a new identity each render → call
    // old-ref(null) + new-ref(node) → both call setTriggerRef →
    // registerTrigger bumps measureToken → ctx changes → re-render →
    // another new mergedRef → loop forever. Memoizing on the stable
    // setTriggerRef + the (typically stable) forwarded ref keeps the
    // identity stable, so React only fires the ref on mount/unmount.
    const mergedRef = useMemo(
      () => mergeRefs(setTriggerRef, ref),
      [setTriggerRef, ref],
    )

    if (asChild) {
      return (
        <Slot ref={mergedRef} {...triggerProps}>
          {children}
        </Slot>
      )
    }

    return (
      <button ref={mergedRef} {...triggerProps}>
        {children}
      </button>
    )
  },
)

TabsTrigger.displayName = 'Tabs.Trigger'
