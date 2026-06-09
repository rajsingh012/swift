import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useControllableState } from '../internal/state'
import { DEFAULT_ORIENTATION, DEFAULT_SIZE } from './SegmentedControl.constants'
import {
  SegmentedControlContext,
  type SegmentedControlContextValue,
  type SegmentedFocusDirection,
} from './SegmentedControl.context'
import { cx, rootClasses } from './SegmentedControl.styles'
import type { SegmentedControlRootProps } from './SegmentedControl.types'

/**
 * SegmentedControl root — a single-selection control rendered as a
 * `role="radiogroup"`. Owns the active value, the item registry, the ARIA
 * id factory, and keyboard navigation. The visual chrome (track, sliding
 * pill) lives in theme/segmented-control.css; this component only emits the
 * structural `<div>` plus data-attributes the CSS hooks onto.
 *
 * Uncontrolled-with-no-defaultValue auto-selects the first non-disabled item
 * on mount — a segmented control always shows a selection.
 */
export const SegmentedControlRoot = forwardRef<
  HTMLDivElement,
  SegmentedControlRootProps
>(function SegmentedControl(props, ref) {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    orientation = DEFAULT_ORIENTATION,
    size = DEFAULT_SIZE,
    disabled = false,
    readOnly = false,
    fullWidth = false,
    equalWidth = false,
    loop = true,
    dir: dirProp,
    id: idProp,
    name,
    classes,
    className,
    children,
    ...rest
  } = props

  const reactId = useId()
  const baseId = idProp ?? `swift-segmented-${reactId}`

  // `null` is the unset state — used only briefly on mount when
  // uncontrolled-with-no-defaultValue, until the registry effect picks the
  // first non-disabled item. After that, value is always a string. The
  // context's typed `value: string | null` lets the items skip aria-checked
  // wiring when nothing's active yet.
  const [value, setValueInternal] = useControllableState<string | null>(
    valueProp,
    defaultValue ?? null,
    (next) => {
      if (next !== null) onValueChange?.(next)
    },
  )

  // ── RTL detection (sniff on mount, skip on SSR) ──────────────────
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [detectedDir, setDetectedDir] = useState<'ltr' | 'rtl'>('ltr')
  useEffect(() => {
    if (dirProp !== undefined) return
    const el = rootRef.current
    if (!el) return
    const sniffed = el.closest('[dir]')?.getAttribute('dir')
    setDetectedDir(sniffed === 'rtl' ? 'rtl' : 'ltr')
  }, [dirProp])
  const dir = dirProp ?? detectedDir

  // ── Item registry ────────────────────────────────────────────────
  const itemsRef = useRef<Map<string, HTMLElement>>(new Map())
  const orderRef = useRef<string[]>([])

  // Bumped on every value change / item (un)mount so the Indicator's effect
  // re-measures without needing its own observer on the root.
  const [measureToken, setMeasureToken] = useState(0)

  const registerItem = useCallback(
    (itemValue: string, node: HTMLElement | null) => {
      if (node) {
        itemsRef.current.set(itemValue, node)
      } else {
        itemsRef.current.delete(itemValue)
      }
      orderRef.current = Array.from(itemsRef.current.keys())
      setMeasureToken((t) => t + 1)
    },
    [],
  )

  const setValue = useCallback(
    (next: string) => {
      setValueInternal(next)
      // Force a remeasure even when called with the existing value.
      setMeasureToken((t) => t + 1)
    },
    [setValueInternal],
  )

  // ── Default-value-on-mount ────────────────────────────────────────
  // When uncontrolled and no defaultValue, select the first registered
  // non-disabled item once the registry is populated.
  useEffect(() => {
    if (valueProp !== undefined) return
    if (value !== null) return
    const order = orderRef.current
    if (order.length === 0) return
    const first = order.find((v) => {
      const node = itemsRef.current.get(v)
      return node && !node.hasAttribute('data-disabled')
    })
    if (first) setValueInternal(first)
  }, [valueProp, value, measureToken, setValueInternal])

  // ── Keyboard navigation ───────────────────────────────────────────
  const focusItem = useCallback(
    (from: string, direction: SegmentedFocusDirection) => {
      if (disabled || readOnly) return
      const order = orderRef.current
      if (order.length === 0) return
      const enabled = order.filter((v) => {
        const node = itemsRef.current.get(v)
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

      const node = itemsRef.current.get(nextValue)
      node?.focus()
      // Radio-group semantics: arrow nav moves focus AND selects
      // (selection-follows-focus, like native radios).
      setValue(nextValue)
    },
    [disabled, readOnly, loop, setValue],
  )

  const itemId = useCallback(
    (v: string) => `${baseId}-item-${v}`,
    [baseId],
  )

  const ctx = useMemo<SegmentedControlContextValue>(
    () => ({
      baseId,
      value,
      orientation,
      size,
      dir,
      disabled,
      readOnly,
      itemsRef,
      orderRef,
      rootRef,
      measureToken,
      setValue,
      registerItem,
      focusItem,
      itemId,
      itemClass: classes?.item,
      indicatorClass: classes?.indicator,
    }),
    [
      baseId,
      value,
      orientation,
      size,
      dir,
      disabled,
      readOnly,
      measureToken,
      setValue,
      registerItem,
      focusItem,
      itemId,
      classes?.item,
      classes?.indicator,
    ],
  )

  const setRootRef = (node: HTMLDivElement | null) => {
    rootRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as { current: HTMLDivElement | null }).current = node
  }

  const widthMode = fullWidth ? 'full' : equalWidth ? 'equal' : 'fit'

  return (
    <SegmentedControlContext.Provider value={ctx}>
      <div
        ref={setRootRef}
        role="radiogroup"
        aria-orientation={orientation}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        data-orientation={orientation}
        data-size={size}
        data-width={widthMode}
        data-disabled={disabled ? 'true' : undefined}
        data-readonly={readOnly ? 'true' : undefined}
        dir={dirProp}
        className={cx(rootClasses, className, classes?.root)}
        {...rest}
      >
        {children}
        {/* Hidden input mirrors the selected value into the surrounding form. */}
        {name ? (
          <input type="hidden" name={name} value={value ?? ''} />
        ) : null}
      </div>
    </SegmentedControlContext.Provider>
  )
})

SegmentedControlRoot.displayName = 'SegmentedControl'
