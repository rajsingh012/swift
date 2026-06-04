import type { CarouselAlign } from './Carousel.types'

export { mergeRefs } from '../internal/refs'
export { useControllableState } from '../internal/state'

/**
 * Cached layout snapshot for one slide. `left` is `offsetLeft` (the
 * pre-transform layout box) and `width` is `offsetWidth` — both stable
 * regardless of the track's current `transform`, which is what we want:
 * positions are pure layout, the transform is a pure visual offset.
 */
export type ItemPosition = { left: number; width: number }

/**
 * Snapshot the layout of every track child. Called once after mount
 * and on every layout change (item added/removed, container resized,
 * fonts loaded). The result is cached in a ref so the per-frame
 * animation tick reads it without re-measuring.
 */
export function measurePositions(track: HTMLElement): ItemPosition[] {
  const out: ItemPosition[] = []
  for (let i = 0; i < track.children.length; i++) {
    const child = track.children[i] as HTMLElement
    out.push({ left: child.offsetLeft, width: child.offsetWidth })
  }
  return out
}

/**
 * The `transform: translateX(offset)` value that places the item at
 * `index` at the snap-aligned position inside the viewport.
 *
 *     align=start  → item.left sits at viewport-left   (offset = -item.left)
 *     align=center → item.center sits at viewport-center
 *     align=end    → item.right sits at viewport-right
 *
 * Returns `null` when the index is out of range.
 */
export function offsetForIndex(
  positions: ItemPosition[],
  viewportWidth: number,
  index: number,
  align: CarouselAlign,
): number | null {
  const p = positions[index]
  if (!p) return null
  if (align === 'center') return (viewportWidth - p.width) / 2 - p.left
  if (align === 'end') return viewportWidth - p.width - p.left
  return -p.left
}

/**
 * Inverse of `offsetForIndex`: given the current transform, which
 * slide is snapped most closely to the alignment point? Used for the
 * "resnap to nearest" logic at drag release, and to update
 * selectedIndex during a drag so indicators light up live.
 *
 * Internally compares each slide's anchor against the viewport's
 * alignment anchor — same conceptual math as scroll-snap, just driven
 * by our own offset state instead of the browser's scroll position.
 */
export function nearestIndexFromOffset(
  positions: ItemPosition[],
  viewportWidth: number,
  offset: number,
  align: CarouselAlign,
): number {
  if (positions.length === 0) return 0

  let nearest = 0
  let nearestDist = Infinity

  for (let i = 0; i < positions.length; i++) {
    const p = positions[i]
    let anchor: number
    let target: number
    if (align === 'center') {
      anchor = p.left + p.width / 2
      target = -offset + viewportWidth / 2
    } else if (align === 'end') {
      anchor = p.left + p.width
      target = -offset + viewportWidth
    } else {
      anchor = p.left
      target = -offset
    }
    const dist = Math.abs(anchor - target)
    if (dist < nearestDist) {
      nearestDist = dist
      nearest = i
    }
  }
  return nearest
}

/**
 * Continuous version of `nearestIndexFromOffset` — instead of snapping
 * to a whole slide index, returns a fractional value that linearly
 * interpolates between consecutive snap anchors.
 *
 * Used by per-frame visual effects (coverflow) where each slide's
 * rotation/scale/depth needs to track the drag smoothly between snaps,
 * not pop at boundaries. Returns 2.3 if the carousel is 30 % of the
 * way from snap 2 to snap 3.
 */
export function fractionalIndexFromOffset(
  positions: ItemPosition[],
  viewportWidth: number,
  offset: number,
  align: CarouselAlign,
): number {
  if (positions.length === 0) return 0

  let target: number
  if (align === 'center') target = -offset + viewportWidth / 2
  else if (align === 'end') target = -offset + viewportWidth
  else target = -offset

  // Pre-compute each slide's anchor in the same coordinate space as
  // `target`. Stored once per call rather than recomputed per pair.
  const anchors = positions.map((p) =>
    align === 'center'
      ? p.left + p.width / 2
      : align === 'end'
        ? p.left + p.width
        : p.left,
  )

  if (target <= anchors[0]) return 0
  if (target >= anchors[anchors.length - 1]) return anchors.length - 1

  for (let i = 0; i < anchors.length - 1; i++) {
    if (target >= anchors[i] && target < anchors[i + 1]) {
      const span = anchors[i + 1] - anchors[i]
      const t = span > 0 ? (target - anchors[i]) / span : 0
      return i + t
    }
  }
  return 0
}

/**
 * Per-item 3D transform for the iTunes-style coverflow effect.
 *
 * For each track child, computes its DISTANCE (in fractional slide
 * units) from the carousel's current alignment point. Side slides
 * rotate around Y to face the centre, recede in Z, scale down, and
 * pull horizontally toward the centre so they fan out around the
 * active slide. The active slide stays at scale 1, rotation 0, depth 0.
 *
 * Written imperatively — same pattern as the track translate — so it
 * runs on the rAF tick without triggering React renders. The CSS
 * transition on items is disabled in coverflow mode (see
 * `theme/carousel.css`) because the engine already writes a smooth
 * value every frame; a CSS transition on top would lag behind the
 * drag.
 *
 * Tuning, calibrated to read like the iTunes / iOS Cover Flow:
 *   - `rotateY = sign(d) * min(75°, 50° * √|d|)` — fast rise to ~50°
 *     at the immediate neighbour, then asymptotes to a 75° cap. The
 *     square-root curve avoids the edge-on flicker you get with a
 *     hard linear ramp.
 *   - `translateZ = -30 px * |d|` — subtle depth. Doing the heavy
 *     lifting here would compound with the perspective and shrink
 *     distant slides into unreadable smudges; the explicit `scale`
 *     handles size, Z just adds a touch of recession.
 *   - `scale = max(0.65, 1 - 0.07 * |d|)` — gentle 7 % drop per
 *     slide so even d=4 stays legible.
 *   - `translateX = sign(d) * min(250 px, 50 px * |d|)` — pulls side
 *     slides toward the centre. Without this, slides 2+ away sit at
 *     their full layout offset and disappear off the viewport.
 */
export function applyCoverflowTransforms(
  track: HTMLElement,
  positions: ItemPosition[],
  viewportWidth: number,
  offset: number,
  align: CarouselAlign,
): void {
  if (positions.length === 0) return

  const fractional = fractionalIndexFromOffset(
    positions,
    viewportWidth,
    offset,
    align,
  )

  for (let i = 0; i < track.children.length; i++) {
    const child = track.children[i] as HTMLElement
    const distance = i - fractional
    const absDist = Math.abs(distance)
    const sign = Math.sign(distance)

    const rotateY = -sign * Math.min(75, 50 * Math.sqrt(absDist))
    const translateZ = absDist * -30
    const scale = Math.max(0.65, 1 - absDist * 0.07)
    const overlap = -sign * Math.min(absDist * 50, 250)
    // Fade-and-hide cap: only 7 slides (active + 3 each side) read as
    // part of the carousel. Past d=3 the slide fades out over one
    // slide-unit and clips itself out of the hit-test path. Without
    // this cap, the `translateX` overlap pulls cloned slides from far
    // away into a narrow mobile viewport — you'd see a wall of tiny
    // tilted strips behind the focal slide.
    const opacity = absDist <= 3 ? 1 : Math.max(0, 1 - (absDist - 3))

    child.style.transform =
      `translateX(${overlap}px) ` +
      `rotateY(${rotateY}deg) ` +
      `translateZ(${translateZ}px) ` +
      `scale(${scale})`
    child.style.opacity = String(opacity)
    // Higher z-index for slides closer to centre so they composite on
    // top during the rotation crossover.
    child.style.zIndex = String(100 - Math.round(absDist * 10))
    // Pointer-events off on faded slides so a barely-visible far-clone
    // can't accidentally swallow a tap meant for the active slide.
    child.style.pointerEvents = opacity < 0.05 ? 'none' : ''
  }
}

/**
 * Clear any inline transforms left over from a previous coverflow run.
 * Called when `effect` flips away from `coverflow` so the slides
 * return to their default (flat, layout-positioned) rendering.
 */
export function clearItemTransforms(track: HTMLElement): void {
  for (let i = 0; i < track.children.length; i++) {
    const child = track.children[i] as HTMLElement
    child.style.transform = ''
    child.style.zIndex = ''
    child.style.opacity = ''
    child.style.pointerEvents = ''
  }
}

/**
 * GPU-accelerated tween from `from` → `to` over `duration` ms using
 * easeOutCubic. We apply via a caller-supplied `applyOffset` so the
 * tick stays generic — the caller writes
 * `track.style.transform = translate3d(${x}px, 0, 0)` (or whatever)
 * directly, and we never go through React re-render.
 *
 * Why this beats `viewport.scrollLeft` + rAF: setting `scrollLeft`
 * triggers a synchronous reflow on the main thread every frame.
 * Setting `transform` on a `will-change: transform` element stays on
 * the compositor — no reflow, no repaint of slide content, smooth
 * 60 fps even with heavy image content inside slides.
 *
 * `onComplete` fires only on a natural finish — NOT when the cancel
 * function is called. Used by the loop-wrap logic to instant-jump
 * from a clone to the matching real slide.
 */
export function animateOffset(
  applyOffset: (x: number) => void,
  from: number,
  to: number,
  duration: number,
  onComplete?: () => void,
): () => void {
  if (from === to || duration <= 0) {
    applyOffset(to)
    onComplete?.()
    return () => {}
  }

  const startTime = performance.now()
  let cancelled = false
  let rafId = 0

  const tick = (now: number) => {
    if (cancelled) return
    const elapsed = now - startTime
    const t = Math.min(1, elapsed / duration)
    // easeOutCubic — fast start, gentle settle. Matches the "physics"
    // feel users expect from a carousel snap. Tunable per consumer
    // via the `duration` prop on the root.
    const eased = 1 - Math.pow(1 - t, 3)
    applyOffset(from + (to - from) * eased)
    if (t < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      onComplete?.()
    }
  }

  rafId = requestAnimationFrame(tick)

  return () => {
    cancelled = true
    if (rafId) cancelAnimationFrame(rafId)
  }
}
