import { useCallback, useState } from 'react'

/**
 * Controlled / uncontrolled state primitive. If `controlled` is defined
 * the consumer owns the value; otherwise we hold an internal copy and
 * still fan out to `onChange` on every update. Used by every overlay /
 * value-holding compound component in the library.
 */
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
