import { useCallback, useState, type Ref, type RefObject } from 'react'
import { cx } from './Accordion.styles'

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): Ref<T> {
  return (node: T | null) => {
    for (const r of refs) {
      if (!r) continue
      if (typeof r === 'function') r(node)
      else (r as RefObject<T | null>).current = node
    }
  }
}

export function mergeProps(
  internal: Record<string, unknown>,
  external: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...internal, ...external }

  if (internal.className || external.className) {
    merged.className = cx(
      internal.className as string | undefined,
      external.className as string | undefined,
    )
  }

  if (internal.style || external.style) {
    merged.style = {
      ...(internal.style as object | undefined),
      ...(external.style as object | undefined),
    }
  }

  for (const key of Object.keys(external)) {
    if (
      key.startsWith('on') &&
      typeof internal[key] === 'function' &&
      typeof external[key] === 'function'
    ) {
      const a = internal[key] as (...args: unknown[]) => void
      const b = external[key] as (...args: unknown[]) => void
      merged[key] = (...args: unknown[]) => {
        a(...args)
        b(...args)
      }
    }
  }

  return merged
}

export function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T) => void] {
  const isControlled = controlled !== undefined
  const [internal, setInternal] = useState<T>(defaultValue)
  const value = isControlled ? (controlled as T) : internal

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next)
      onChange?.(next)
    },
    [isControlled, onChange],
  )

  return [value, setValue]
}
