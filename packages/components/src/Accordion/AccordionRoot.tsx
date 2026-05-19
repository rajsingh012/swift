import { forwardRef, useCallback, useMemo, useRef } from 'react'
import {
  AccordionRootContext,
  type AccordionRootContextValue,
} from './Accordion.context'
import { cx, rootClasses } from './Accordion.styles'
import type { AccordionRootProps } from './Accordion.types'
import { useControllableState } from './Accordion.utils'

export const AccordionRoot = forwardRef<HTMLDivElement, AccordionRootProps>(
  function Accordion(props, ref) {
    const {
      type = 'single',
      disabled = false,
      className,
      children,
      ...rest
    } = props as AccordionRootProps & {
      collapsible?: boolean
      value?: string | string[] | null
      defaultValue?: string | string[] | null
      onValueChange?: (value: never) => void
    }

    const collapsible =
      type === 'multiple' ? true : Boolean(rest.collapsible ?? false)

    const normalizedDefault: string[] = useMemo(() => {
      if (type === 'multiple') {
        return Array.isArray(rest.defaultValue) ? rest.defaultValue : []
      }
      if (typeof rest.defaultValue === 'string') return [rest.defaultValue]
      return []
    }, [type, rest.defaultValue])

    const normalizedControlled: string[] | undefined = useMemo(() => {
      if (rest.value === undefined) return undefined
      if (type === 'multiple') {
        return Array.isArray(rest.value) ? rest.value : []
      }
      if (rest.value === null) return []
      if (typeof rest.value === 'string') return [rest.value]
      return []
    }, [type, rest.value])

    const onValueChange = rest.onValueChange
    const handleChange = useCallback(
      (next: string[]) => {
        if (type === 'multiple') {
          ;(onValueChange as ((v: string[]) => void) | undefined)?.(next)
        } else {
          ;(onValueChange as ((v: string | null) => void) | undefined)?.(
            next[0] ?? null,
          )
        }
      },
      [type, onValueChange],
    )

    const [values, setValues] = useControllableState<string[]>(
      normalizedControlled,
      normalizedDefault,
      handleChange,
    )

    const triggersRef = useRef<Map<string, HTMLElement>>(new Map())
    const orderRef = useRef<string[]>([])

    const registerTrigger = useCallback(
      (itemValue: string, node: HTMLElement | null) => {
        if (node) {
          triggersRef.current.set(itemValue, node)
        } else {
          triggersRef.current.delete(itemValue)
        }
        orderRef.current = Array.from(triggersRef.current.keys())
      },
      [],
    )

    const toggle = useCallback(
      (itemValue: string) => {
        if (disabled) return
        if (type === 'multiple') {
          const isOpen = values.includes(itemValue)
          setValues(
            isOpen
              ? values.filter((v) => v !== itemValue)
              : [...values, itemValue],
          )
          return
        }
        const isOpen = values[0] === itemValue
        if (isOpen) {
          if (collapsible) setValues([])
          return
        }
        setValues([itemValue])
      },
      [collapsible, disabled, setValues, type, values],
    )

    const focusItem = useCallback(
      (
        fromItemValue: string,
        direction: 'next' | 'prev' | 'first' | 'last',
      ) => {
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
          const idx = enabled.indexOf(fromItemValue)
          if (idx === -1) {
            nextValue = enabled[0]
          } else if (direction === 'next') {
            nextValue = enabled[(idx + 1) % enabled.length]
          } else {
            nextValue = enabled[(idx - 1 + enabled.length) % enabled.length]
          }
        }

        if (!nextValue) return
        const node = triggersRef.current.get(nextValue)
        node?.focus()
      },
      [],
    )

    const ctx = useMemo<AccordionRootContextValue>(
      () => ({
        type,
        collapsible,
        disabled,
        values,
        toggle,
        registerTrigger,
        focusItem,
        orderRef,
      }),
      [type, collapsible, disabled, values, toggle, registerTrigger, focusItem],
    )

    const {
      collapsible: _c,
      value: _v,
      defaultValue: _dv,
      onValueChange: _ovc,
      ...domRest
    } = rest

    return (
      <AccordionRootContext.Provider value={ctx}>
        <div
          ref={ref}
          className={cx(rootClasses, className)}
          data-type={type}
          {...domRest}
        >
          {children}
        </div>
      </AccordionRootContext.Provider>
    )
  },
)
AccordionRoot.displayName = 'Accordion'
