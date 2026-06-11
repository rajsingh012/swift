import { cx } from './cx'

/**
 * Merge an internal (component-computed) props object with an external
 * (consumer-supplied) one for render-prop / element cloning patterns.
 *
 * Semantics — distinct from Slot.tsx's `mergeProps`:
 *   - plain props: external wins
 *   - className: composed (internal first, external appended)
 *   - style: shallow-merged, external wins per-property
 *   - `on*` handlers present on both sides: chained, internal first,
 *     external second — unconditionally (no `defaultPrevented` bail)
 */
export function mergeRenderProps(
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
