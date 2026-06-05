import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from 'react'

type SlotProps = HTMLAttributes<HTMLElement> & { children?: React.ReactNode }

type AnyProps = Record<string, unknown>

/**
 * Merges Slot props onto a single child element — the minimal subset of
 * Radix's Slot used by `asChild` across the library. We:
 *   - compose `className` (Slot's wins cascade order, child's appended)
 *   - merge `style`
 *   - chain event handlers (child runs first; Slot's runs unless the
 *     child called `event.preventDefault()`)
 *   - forward refs to whichever element the child renders
 *
 * Anything not covered here (data-*, aria-*, role, tabIndex, …) is a
 * plain override — the Slot wins, since the consumer is the one asking
 * for the Slot's semantics.
 */
function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...childProps }

  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key]
    const childValue = childProps[key]

    if (key === 'className') {
      merged.className = [slotValue, childValue].filter(Boolean).join(' ')
      continue
    }

    if (key === 'style') {
      merged.style = { ...(childValue as object), ...(slotValue as object) }
      continue
    }

    if (/^on[A-Z]/.test(key) && typeof slotValue === 'function') {
      // Chain: child handler first, then Slot's — Slot's bails if the
      // child called preventDefault, matching browser semantics.
      if (typeof childValue === 'function') {
        merged[key] = (...args: unknown[]) => {
          ;(childValue as (...a: unknown[]) => void)(...args)
          const evt = args[0] as { defaultPrevented?: boolean } | undefined
          if (!evt?.defaultPrevented) {
            ;(slotValue as (...a: unknown[]) => void)(...args)
          }
        }
        continue
      }
    }

    merged[key] = slotValue
  }

  return merged
}

export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  ref,
) {
  const onlyChild = Children.only(children)
  const child = isValidElement(onlyChild)
    ? (onlyChild as ReactElement<AnyProps> & { ref?: Ref<unknown> })
    : null
  const childRef = child?.ref

  // CRITICAL: memoize the composed ref. Without this, `composeRefs(...)`
  // (and the `else` branch's bare `childRef`) reach `cloneElement` with
  // a fresh function reference every render. React then re-fires the
  // ref on every render — old-ref(null) followed by new-ref(node) —
  // which cascades through any state-touching ref in the chain (e.g.
  // Tabs.Trigger's `registerTrigger`) and produces a "Maximum update
  // depth exceeded" infinite loop. Stable inputs (`ref`, `childRef`)
  // give a stable composed ref, so React fires it exactly on mount/
  // unmount as intended.
  const composedRef = useMemo<Ref<unknown> | undefined>(() => {
    if (ref && childRef) return composeRefs(ref, childRef)
    if (ref) return ref as Ref<unknown>
    if (childRef) return childRef
    return undefined
  }, [ref, childRef])

  if (!child) return null

  const merged = mergeProps(slotProps as AnyProps, child.props as AnyProps)
  if (composedRef !== undefined) merged.ref = composedRef

  return cloneElement(child, merged)
})

export function composeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T) => {
    for (const r of refs) {
      if (!r) continue
      if (typeof r === 'function') {
        r(node)
      } else {
        ;(r as { current: T | null }).current = node
      }
    }
  }
}
