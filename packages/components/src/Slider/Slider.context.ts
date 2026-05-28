import { createContext, useContext, type PointerEvent, type RefObject } from 'react'
import type { SliderOrientation, SliderValue } from './Slider.types'

export interface SliderContextValue {
  values: SliderValue
  min: number
  max: number
  step: number
  orientation: SliderOrientation
  disabled: boolean
  readOnly: boolean
  isRtl: boolean
  inverted: boolean

  /** Track element ref — used by Thumb / Mark / Range for geometry math. */
  trackRef: RefObject<HTMLSpanElement | null>

  /** Currently-dragged thumb (null when no drag). Drives `data-dragging`. */
  activeThumbIndex: number | null

  /**
   * Auto-assign an index to a `<Slider.Thumb />` that didn't pass `index`.
   * Called during render — relies on React's stable child-render order.
   * Reset on every Root render so the counter starts at 0.
   */
  getNextThumbIndex: () => number

  /** Move a single thumb. `commit: true` also fires `onValueCommit`. */
  setThumbValue: (
    index: number,
    nextValue: number,
    options?: { commit?: boolean },
  ) => void

  /**
   * Start a pointer drag on a thumb. Captures the pointer on the
   * passed element so dragging works even when the cursor leaves the
   * thumb (typical for fast drags).
   */
  startThumbDrag: (
    event: PointerEvent<HTMLSpanElement>,
    index: number,
  ) => void

  /** Format a single value for display (defaults to `String(value)`). */
  format: (value: number) => string
}

export const SliderContext = createContext<SliderContextValue | null>(null)

export function useSliderContext(component: string): SliderContextValue {
  const ctx = useContext(SliderContext)
  if (!ctx) {
    throw new Error(
      `${component} must be rendered inside a <Slider>. ` +
        `Wrap it in <Slider>…</Slider> or use the convenience API <Slider defaultValue={[…]} />.`,
    )
  }
  return ctx
}
