import { cx } from './Accordion.styles'

export { mergeRefs } from '../internal/refs'
export { useControllableState } from '../internal/state'

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
