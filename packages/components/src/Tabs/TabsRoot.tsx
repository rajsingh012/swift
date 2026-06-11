import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useControllableState } from '../internal/state'
import {
  DEFAULT_ACTIVATION_MODE,
  DEFAULT_ORIENTATION,
} from './Tabs.constants'
import {
  TabsRootContext,
  type TabsFocusDirection,
  type TabsRootContextValue,
} from './Tabs.context'
import { cx, rootClasses } from './Tabs.styles'
import type { TabsApi, TabsRootProps } from './Tabs.types'

/**
 * Tabs root — owns the active value, the trigger registry, and the ARIA
 * id factory. Renders a `<div>` wrapper with `data-orientation` so the
 * theme tokens can swap layout direction.
 *
 * Uncontrolled-with-no-defaultValue auto-selects the first non-disabled
 * trigger on mount (matches Radix). This keeps the indicator and a
 * default panel visible without the consumer having to think about it.
 */
export const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>(
  function Tabs(props, ref) {
    const {
      value: valueProp,
      defaultValue,
      onValueChange,
      orientation = DEFAULT_ORIENTATION,
      activationMode = DEFAULT_ACTIVATION_MODE,
      lazyMount = false,
      loop = true,
      swipeable = false,
      dir: dirProp,
      id: idProp,
      apiRef,
      classes,
      className,
      children,
      ...rest
    } = props

    const reactId = useId()
    const baseId = idProp ?? `swift-tabs-${reactId}`

    // `null` is the unset state — used only briefly on mount when
    // uncontrolled-with-no-defaultValue, until the registry effect picks
    // the first non-disabled trigger. After that, value is always a
    // string. The context's typed `value: string | null` lets ARIA wiring
    // skip aria-selected on triggers when nothing's active yet.
    const [value, setValueInternal] = useControllableState<string | null>(
      valueProp,
      defaultValue ?? null,
      (next) => {
        if (next !== null) onValueChange?.(next)
      },
    )

    // ── RTL detection (sniff on mount, skip on SSR) ────────────────
    const rootRef = useRef<HTMLDivElement | null>(null)
    const listRef = useRef<HTMLDivElement | null>(null)
    const [detectedDir, setDetectedDir] = useState<'ltr' | 'rtl'>('ltr')
    useEffect(() => {
      if (dirProp !== undefined) return
      const el = rootRef.current
      if (!el) return
      const dir = el.closest('[dir]')?.getAttribute('dir')
      setDetectedDir(dir === 'rtl' ? 'rtl' : 'ltr')
    }, [dirProp])
    const dir = dirProp ?? detectedDir

    // ── Trigger registry ───────────────────────────────────────────
    const triggersRef = useRef<Map<string, HTMLElement>>(new Map())
    const orderRef = useRef<string[]>([])

    // Bumped on every value change so TabsIndicator's effect re-measures
    // without needing its own observer on the root.
    const [measureToken, setMeasureToken] = useState(0)

    const registerTrigger = useCallback(
      (triggerValue: string, node: HTMLElement | null) => {
        if (node) {
          triggersRef.current.set(triggerValue, node)
        } else {
          triggersRef.current.delete(triggerValue)
        }
        orderRef.current = Array.from(triggersRef.current.keys())
        // Bump the token so the indicator re-measures when a trigger
        // mounts (e.g. dynamic tab insertion).
        setMeasureToken((t) => t + 1)
      },
      [],
    )

    const setValue = useCallback(
      (next: string) => {
        setValueInternal(next)
        // Force an indicator remeasure even when setValue is called
        // with the existing value (e.g. user re-clicks the active tab).
        setMeasureToken((t) => t + 1)
      },
      [setValueInternal],
    )

    // ── Default-value-on-mount ─────────────────────────────────────
    // When uncontrolled and no defaultValue, pick the first registered
    // non-disabled trigger once the registry is populated.
    useEffect(() => {
      if (valueProp !== undefined) return
      if (value !== null) return
      const order = orderRef.current
      if (order.length === 0) return
      const first = order.find((v) => {
        const node = triggersRef.current.get(v)
        return node && !node.hasAttribute('data-disabled')
      })
      if (first) setValueInternal(first)
      // Re-run whenever a trigger registration changes; measureToken is
      // bumped by registerTrigger, so it's the right cue.
    }, [valueProp, value, measureToken, setValueInternal])

    // ── Keyboard navigation ────────────────────────────────────────
    const focusTrigger = useCallback(
      (from: string, direction: TabsFocusDirection) => {
        const order = orderRef.current
        if (order.length === 0) return
        const enabled = order.filter((v) => {
          const node = triggersRef.current.get(v)
          return node && !node.hasAttribute('data-disabled')
        })
        if (enabled.length === 0) return

        let nextValue: string | undefined
        if (direction === 'first') nextValue = enabled[0]
        else if (direction === 'last') nextValue = enabled[enabled.length - 1]
        else {
          const idx = enabled.indexOf(from)
          if (idx === -1) {
            nextValue = enabled[0]
          } else if (direction === 'next') {
            // With loop, wrap to the start; without, stay on the last
            // trigger when we've already hit the end.
            nextValue = loop
              ? enabled[(idx + 1) % enabled.length]
              : enabled[Math.min(idx + 1, enabled.length - 1)]
          } else {
            nextValue = loop
              ? enabled[(idx - 1 + enabled.length) % enabled.length]
              : enabled[Math.max(idx - 1, 0)]
          }
        }
        if (!nextValue) return

        const node = triggersRef.current.get(nextValue)
        node?.focus()
        // In automatic mode, focus-follows-selection: update the active
        // value too. Manual mode only moves focus; the consumer commits
        // via Enter/Space (handled inside TabsTrigger).
        if (activationMode === 'automatic') setValue(nextValue)
      },
      [activationMode, setValue, loop],
    )

    const triggerId = useCallback(
      (v: string) => `${baseId}-trigger-${v}`,
      [baseId],
    )
    const contentId = useCallback(
      (v: string) => `${baseId}-content-${v}`,
      [baseId],
    )

    // Mirror live value into a ref so the imperative handle's getValue
    // can read the latest without depending on a re-render cycle.
    const valueRef = useRef<string | null>(value)
    valueRef.current = value

    useImperativeHandle(
      apiRef,
      (): TabsApi => ({
        select: (next: string) => {
          const node = triggersRef.current.get(next)
          if (!node) return                              // unknown value
          if (node.hasAttribute('data-disabled')) return  // disabled trigger
          setValue(next)
        },
        focus: (next, options) => {
          const target = next ?? valueRef.current
          if (!target) return
          const node = triggersRef.current.get(target)
          node?.focus(options)
        },
        blur: () => {
          if (typeof document === 'undefined') return
          const active = document.activeElement as HTMLElement | null
          if (!active) return
          // Only blur if the focused element is one of our triggers,
          // so external focus state isn't disturbed.
          for (const node of triggersRef.current.values()) {
            if (node === active) {
              active.blur()
              return
            }
          }
        },
        getValue: () => valueRef.current,
      }),
      [setValue],
    )

    const ctx = useMemo<TabsRootContextValue>(
      () => ({
        baseId,
        value,
        orientation,
        activationMode,
        dir,
        lazyMount,
        swipeable,
        loop,
        triggersRef,
        orderRef,
        listRef,
        measureToken,
        setValue,
        registerTrigger,
        focusTrigger,
        triggerId,
        contentId,
      }),
      [
        baseId,
        value,
        orientation,
        activationMode,
        dir,
        lazyMount,
        swipeable,
        loop,
        measureToken,
        setValue,
        registerTrigger,
        focusTrigger,
        triggerId,
        contentId,
      ],
    )

    const setRootRef = (node: HTMLDivElement | null) => {
      rootRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as { current: HTMLDivElement | null }).current = node
    }

    return (
      <TabsRootContext.Provider value={ctx}>
        <div
          ref={setRootRef}
          data-orientation={orientation}
          dir={dirProp}
          className={cx(rootClasses, className, classes?.root)}
          {...rest}
        >
          {children}
        </div>
      </TabsRootContext.Provider>
    )
  },
)

TabsRoot.displayName = 'Tabs'
