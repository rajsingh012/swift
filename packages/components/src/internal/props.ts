import type { ReactNode } from 'react'
import { cx } from './cx'

/**
 * A `render*` callback prop.
 *
 * The library-wide convention for letting a consumer build their own UI
 * for a slot **from the component's internal state** — instead of the
 * component exposing a prop for every visual knob. The component computes
 * `State` (selection, counts, handlers, open/closed, …) and hands it to
 * the consumer's function.
 *
 *   renderIndicator?: RenderProp<{ index: number; selected: boolean; goTo(): void }>
 *
 * This is intentionally DISTINCT from the `render` prop found on Text /
 * Box / Badge / Button / Accordion.Trigger, which *replaces the host
 * element* (the `asChild`-as-a-function pattern) and merges DOM props via
 * `mergeRenderProps`. A `RenderProp` does not touch the host element — it
 * only produces the content for a slot. Keep the two separate: `render`
 * = "swap my element", `renderX` = "build this slot's UI from state".
 *
 * A `RenderProp` also accepts a plain node, so a consumer who doesn't need
 * the state can pass static content. `resolveRenderProp` collapses both
 * forms.
 */
export type RenderProp<State, Return = ReactNode> =
  | Return
  | ((state: State) => Return)

/**
 * Resolve a {@link RenderProp}: call the function form with `state`, or
 * return the static node as-is. Returns `undefined` when the prop wasn't
 * provided, so callers can fall back to their default rendering.
 *
 * Replaces the hand-rolled `typeof x === 'function' ? x(state) : x` checks
 * that were duplicated across components.
 */
export function resolveRenderProp<State, Return = ReactNode>(
  prop: RenderProp<State, Return> | undefined,
  state: State,
): Return | undefined {
  if (prop === undefined) return undefined
  return typeof prop === 'function'
    ? (prop as (state: State) => Return)(state)
    : prop
}

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
