import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useControllableState } from '../internal/state'
import {
  DEFAULT_ORIENTATION,
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
} from './Toggle.constants'
import {
  ToggleGroupContext,
  type ToggleFocusDirection,
  type ToggleGroupContextValue,
} from './Toggle.context'
import { cx, groupClasses } from './Toggle.styles'
import type { ToggleGroupProps } from './Toggle.types'

/**
 * A set of related toggles with shared selection state. `type="single"`
 * behaves like a radio group (at most one pressed); `type="multiple"` lets
 * any number be pressed. Cascades `size`/`variant`/`disabled` to its
 * `<Toggle>` children and provides arrow-key roving focus.
 *
 *   <ToggleGroup type="single" defaultValue="left">
 *     <Toggle value="left"><AlignLeft /></Toggle>
 *     <Toggle value="center"><AlignCenter /></Toggle>
 *   </ToggleGroup>
 */
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(
  function ToggleGroup(props, ref) {
    const {
      size = DEFAULT_SIZE,
      variant = DEFAULT_VARIANT,
      orientation = DEFAULT_ORIENTATION,
      disabled = false,
      loop = true,
      dir: dirProp,
      classes,
      className,
      children,
      ...domRest
    } = props as ToggleGroupProps & {
      type?: 'single' | 'multiple'
      value?: string | string[] | null
      defaultValue?: string | string[] | null
      onValueChange?: (value: never) => void
    }

    const type = props.type ?? 'single'

    // Normalize single/multiple value handling into a string[] internally.
    const normalizedControlled: string[] | undefined = useMemo(() => {
      if (domRest.value === undefined) return undefined
      if (type === 'multiple') return Array.isArray(domRest.value) ? domRest.value : []
      if (domRest.value === null) return []
      return typeof domRest.value === 'string' ? [domRest.value] : []
    }, [type, domRest.value])

    const normalizedDefault: string[] = useMemo(() => {
      if (type === 'multiple')
        return Array.isArray(domRest.defaultValue) ? domRest.defaultValue : []
      return typeof domRest.defaultValue === 'string' ? [domRest.defaultValue] : []
    }, [type, domRest.defaultValue])

    const onValueChange = domRest.onValueChange as
      | ((v: string | string[] | null) => void)
      | undefined

    const handleChange = useCallback(
      (next: string[]) => {
        if (type === 'multiple') onValueChange?.(next)
        else onValueChange?.(next[0] ?? null)
      },
      [type, onValueChange],
    )

    const [values, setValues] = useControllableState<string[]>(
      normalizedControlled,
      normalizedDefault,
      handleChange,
    )

    const toggle = useCallback(
      (value: string) => {
        if (disabled) return
        if (type === 'multiple') {
          setValues(
            values.includes(value)
              ? values.filter((v) => v !== value)
              : [...values, value],
          )
        } else {
          setValues(values[0] === value ? [] : [value])
        }
      },
      [disabled, type, values, setValues],
    )

    const isPressed = useCallback(
      (value: string) => values.includes(value),
      [values],
    )

    // ── RTL detection ──
    const rootRef = useRef<HTMLDivElement | null>(null)
    const [detectedDir, setDetectedDir] = useState<'ltr' | 'rtl'>('ltr')
    useEffect(() => {
      if (dirProp !== undefined) return
      const sniffed = rootRef.current?.closest('[dir]')?.getAttribute('dir')
      setDetectedDir(sniffed === 'rtl' ? 'rtl' : 'ltr')
    }, [dirProp])
    const dir = dirProp ?? detectedDir

    // ── Item registry for keyboard nav ──
    const itemsRef = useRef<Map<string, HTMLElement>>(new Map())
    const orderRef = useRef<string[]>([])
    const registerItem = useCallback(
      (value: string, node: HTMLElement | null) => {
        if (node) itemsRef.current.set(value, node)
        else itemsRef.current.delete(value)
        orderRef.current = Array.from(itemsRef.current.keys())
      },
      [],
    )

    const focusItem = useCallback(
      (from: string, direction: ToggleFocusDirection) => {
        const order = orderRef.current
        if (order.length === 0) return
        const enabled = order.filter((v) => {
          const node = itemsRef.current.get(v)
          return node && !node.hasAttribute('disabled')
        })
        if (enabled.length === 0) return

        let next: string | undefined
        if (direction === 'first') next = enabled[0]
        else if (direction === 'last') next = enabled[enabled.length - 1]
        else {
          const idx = enabled.indexOf(from)
          if (idx === -1) next = enabled[0]
          else if (direction === 'next')
            next = loop
              ? enabled[(idx + 1) % enabled.length]
              : enabled[Math.min(idx + 1, enabled.length - 1)]
          else
            next = loop
              ? enabled[(idx - 1 + enabled.length) % enabled.length]
              : enabled[Math.max(idx - 1, 0)]
        }
        if (next) itemsRef.current.get(next)?.focus()
      },
      [loop],
    )

    const ctx = useMemo<ToggleGroupContextValue>(
      () => ({
        isPressed,
        toggle,
        size,
        variant,
        orientation,
        dir,
        disabled,
        itemsRef,
        orderRef,
        registerItem,
        focusItem,
        itemClass: classes?.item,
      }),
      [
        isPressed,
        toggle,
        size,
        variant,
        orientation,
        dir,
        disabled,
        registerItem,
        focusItem,
        classes?.item,
      ],
    )

    const setRootRef = (node: HTMLDivElement | null) => {
      rootRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as { current: HTMLDivElement | null }).current = node
    }

    const {
      type: _t,
      value: _v,
      defaultValue: _dv,
      onValueChange: _ovc,
      ...rest
    } = domRest

    return (
      <ToggleGroupContext.Provider value={ctx}>
        <div
          ref={setRootRef}
          role="group"
          aria-disabled={disabled || undefined}
          data-orientation={orientation}
          dir={dirProp}
          className={cx(groupClasses, className, classes?.root)}
          {...rest}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    )
  },
)
ToggleGroup.displayName = 'ToggleGroup'
