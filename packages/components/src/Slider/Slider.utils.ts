import type { SliderOrientation } from './Slider.types'

export function clamp(value: number, min: number, max: number): number {
  if (max < min) return min
  return Math.min(max, Math.max(min, value))
}

export function valueToPercent(value: number, min: number, max: number): number {
  const range = max - min
  if (range <= 0) return 0
  return ((value - min) / range) * 100
}

/**
 * Snap a value to the nearest step from `min`. We pivot off `min` (not 0)
 * because the step grid should align with the configured minimum — e.g.
 * `min={1} step={2}` should yield {1, 3, 5, …}, not {0, 2, 4, …}.
 *
 * We also strip floating-point dust with `parseFloat(.toFixed(decimals))`:
 * unrounded `0.1 + 0.1 + 0.1` would give `0.30000000000000004` and feed
 * the consumer back values they didn't expect.
 */
export function snapToStep(value: number, min: number, step: number): number {
  if (step <= 0) return value
  const offset = value - min
  const snapped = Math.round(offset / step) * step
  const result = min + snapped
  // Number of decimals to keep — match the step's precision.
  const decimals = (String(step).split('.')[1] ?? '').length
  return decimals > 0 ? Number.parseFloat(result.toFixed(decimals)) : result
}

/**
 * Convert a 0-100 percent (orientation-agnostic; pre-resolved by
 * `getPointerPercent`) into a value, snapped to step and clamped to [min, max].
 */
export function percentToValue(
  percent: number,
  min: number,
  max: number,
  step: number,
): number {
  const raw = (percent / 100) * (max - min) + min
  return clamp(snapToStep(raw, min, step), min, max)
}

/**
 * Translate a pointer event's coordinates into a 0-100 percent along the
 * track, with RTL / orientation / inverted all collapsed into the result.
 *
 * Convention: 0% always means "the min end of the value scale" — the visual
 * end may be left/right/top/bottom depending on orientation × RTL × inverted.
 */
export function getPointerPercent(
  clientX: number,
  clientY: number,
  rect: DOMRect,
  orientation: SliderOrientation,
  isRtl: boolean,
  inverted: boolean,
): number {
  let percent: number
  if (orientation === 'horizontal') {
    const offset = clientX - rect.left
    percent = rect.width <= 0 ? 0 : (offset / rect.width) * 100
    if (isRtl) percent = 100 - percent
  } else {
    // Vertical default: top = max, bottom = min — matches the visual model
    // ("higher" = "larger value").
    const offset = clientY - rect.top
    percent = rect.height <= 0 ? 0 : 100 - (offset / rect.height) * 100
  }
  if (inverted) percent = 100 - percent
  return clamp(percent, 0, 100)
}

/**
 * For a range slider — clamp `next` so a thumb at `activeIndex` can't
 * cross its neighbours, respecting `minStepsBetweenThumbs`.
 */
export function clampForRange(
  values: number[],
  activeIndex: number,
  next: number,
  step: number,
  minStepsBetweenThumbs: number,
  min: number,
  max: number,
): number {
  const gap = step * Math.max(0, minStepsBetweenThumbs)
  const lower = activeIndex > 0 ? values[activeIndex - 1] + gap : min
  const upper =
    activeIndex < values.length - 1 ? values[activeIndex + 1] - gap : max
  return clamp(next, lower, upper)
}

/**
 * Find the thumb closest to `target`. Used when the user clicks the
 * track — the nearest thumb moves to the click position. Ties resolve
 * toward the side the click came from so range-slider track-clicks
 * past the rightmost thumb still move the right thumb (and vice versa).
 */
export function closestThumbIndex(values: number[], target: number): number {
  let bestIndex = 0
  let bestDist = Infinity
  for (let i = 0; i < values.length; i++) {
    const dist = Math.abs(values[i] - target)
    if (dist < bestDist) {
      bestIndex = i
      bestDist = dist
    } else if (dist === bestDist && target > values[i]) {
      bestIndex = i
    }
  }
  return bestIndex
}

/** Shallow array equality — to skip onValueChange calls when nothing moved. */
export function valuesEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}
