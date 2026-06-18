import { useEffect, useLayoutEffect, useState, type RefObject } from 'react'

/* ------------------------------------------------------------------ *
 * Floating positioning engine — the library's shared, dependency-free
 * answer to "where does the overlay go?". Hand-rolled (no Floating-UI /
 * Popper) so it can be the common foundation for Tooltip and, later,
 * Popover / Dropdown / Select / HoverCard.
 *
 * `computePosition` is a PURE function — no DOM, no `window` — so it is
 * trivially unit-testable. `useFloating` is the thin React wrapper that
 * measures rects, runs the math, and keeps the result fresh on scroll /
 * resize.
 *
 * Middleware order is fixed: offset → flip → shift → arrow. Arrow runs
 * last because it depends on the final (flipped + shifted) placement.
 * ------------------------------------------------------------------ */

export type Side = 'top' | 'bottom' | 'left' | 'right'
export type Align = 'start' | 'center' | 'end'

export type Placement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

/** A `getBoundingClientRect`-shaped, viewport-relative rectangle. */
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

export interface Boundary {
  width: number
  height: number
}

export interface ComputePositionOptions {
  /** Preferred placement before collision handling. Default `'top'`. */
  placement?: Placement
  /** Main-axis gap between trigger and floating, in px. Default `0`. */
  offset?: number
  /** Inset from the boundary edges used for collision tests. Default `8`. */
  padding?: number
  /** Writing direction. `'rtl'` mirrors left/right and start/end. Default `'ltr'`. */
  dir?: 'ltr' | 'rtl'
  /** Arrow square edge length, used to clamp the arrow inside the floating. Default `0`. */
  arrowSize?: number
  /** Minimum inset of the arrow from the floating's corners (e.g. border radius). Default `0`. */
  arrowPadding?: number
  /**
   * Collision boundary. Defaults to an infinite boundary, which disables
   * flip/shift — callers that want collision handling (i.e. `useFloating`)
   * always pass the real viewport. Keeping the default infinite is what
   * lets `computePosition` stay pure (no `window` read).
   */
  boundary?: Boundary
  /** Flip to the opposite side when the preferred side is clipped. Default `true`. */
  flip?: boolean
  /** Slide along the cross-axis to stay within the boundary. Default `true`. */
  shift?: boolean
}

export interface ComputePositionResult {
  /** Floating left edge, viewport coordinates. */
  x: number
  /** Floating top edge, viewport coordinates. */
  y: number
  /** Placement actually used, after flip. */
  placement: Placement
  side: Side
  align: Align
  /**
   * Arrow offset (top-left corner of the arrow square) along the cross
   * axis, within the floating. Only the relevant axis is set; the other
   * is `null`.
   */
  arrow: { x: number | null; y: number | null }
}

const INFINITE_BOUNDARY: Boundary = {
  width: Number.POSITIVE_INFINITY,
  height: Number.POSITIVE_INFINITY,
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function parsePlacement(placement: Placement): { side: Side; align: Align } {
  const [side, align] = placement.split('-') as [Side, Align | undefined]
  return { side, align: align ?? 'center' }
}

function toPlacement(side: Side, align: Align): Placement {
  return (align === 'center' ? side : `${side}-${align}`) as Placement
}

const OPPOSITE: Record<Side, Side> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

/**
 * Top-left corner of the floating for a given side + align, ignoring
 * collisions. `align` positions along the cross-axis (horizontal for
 * top/bottom, vertical for left/right).
 */
function getCoords(
  side: Side,
  align: Align,
  trigger: Rect,
  floating: Rect,
  offset: number,
): { x: number; y: number } {
  let x = 0
  let y = 0

  // Main axis.
  switch (side) {
    case 'top':
      y = trigger.y - floating.height - offset
      break
    case 'bottom':
      y = trigger.y + trigger.height + offset
      break
    case 'left':
      x = trigger.x - floating.width - offset
      break
    case 'right':
      x = trigger.x + trigger.width + offset
      break
  }

  // Cross axis.
  const alignCoord = (
    triggerStart: number,
    triggerSize: number,
    floatingSize: number,
  ): number => {
    switch (align) {
      case 'start':
        return triggerStart
      case 'end':
        return triggerStart + triggerSize - floatingSize
      default:
        return triggerStart + triggerSize / 2 - floatingSize / 2
    }
  }

  if (side === 'top' || side === 'bottom') {
    x = alignCoord(trigger.x, trigger.width, floating.width)
  } else {
    y = alignCoord(trigger.y, trigger.height, floating.height)
  }

  return { x, y }
}

/** How much the floating is clipped by the boundary along its main axis. */
function mainAxisClip(
  side: Side,
  coords: { x: number; y: number },
  floating: Rect,
  boundary: Boundary,
  padding: number,
): number {
  let start: number
  let end: number
  let limit: number
  if (side === 'top' || side === 'bottom') {
    start = coords.y
    end = coords.y + floating.height
    limit = boundary.height
  } else {
    start = coords.x
    end = coords.x + floating.width
    limit = boundary.width
  }
  return Math.max(0, padding - start) + Math.max(0, end - (limit - padding))
}

/**
 * Pure placement solver. Given the trigger and floating rects (viewport
 * coordinates; floating's x/y are ignored, only its size matters), return
 * where to put the floating, the resolved placement, and the arrow offset.
 */
export function computePosition(
  trigger: Rect,
  floating: Rect,
  options: ComputePositionOptions = {},
): ComputePositionResult {
  const {
    placement = 'top',
    offset = 0,
    padding = 8,
    dir = 'ltr',
    arrowSize = 0,
    arrowPadding = 0,
    boundary = INFINITE_BOUNDARY,
    flip = true,
    shift = true,
  } = options

  let { side, align } = parsePlacement(placement)

  // ── RTL: mirror physical left/right, and the cross-axis start/end of
  //    top/bottom placements (logical "start" sits on the right edge). ──
  if (dir === 'rtl') {
    if (side === 'left') side = 'right'
    else if (side === 'right') side = 'left'
    if ((side === 'top' || side === 'bottom') && align !== 'center') {
      align = align === 'start' ? 'end' : 'start'
    }
  }

  // ── offset (folded into the base coords) ──
  let resolvedSide = side
  let coords = getCoords(side, align, trigger, floating, offset)

  // ── flip (main axis only; alignment preserved) ──
  if (flip) {
    const preferredClip = mainAxisClip(side, coords, floating, boundary, padding)
    if (preferredClip > 0) {
      const oppSide = OPPOSITE[side]
      const oppCoords = getCoords(oppSide, align, trigger, floating, offset)
      const oppClip = mainAxisClip(oppSide, oppCoords, floating, boundary, padding)
      if (oppClip < preferredClip) {
        resolvedSide = oppSide
        coords = oppCoords
      }
    }
  }

  // ── shift (cross axis only; clamp into the boundary) ──
  if (shift) {
    if (resolvedSide === 'top' || resolvedSide === 'bottom') {
      coords.x = clamp(
        coords.x,
        padding,
        boundary.width - floating.width - padding,
      )
    } else {
      coords.y = clamp(
        coords.y,
        padding,
        boundary.height - floating.height - padding,
      )
    }
  }

  // ── arrow ──
  // Where the arrow's centre should sit, in floating-local coordinates.
  //  - center: point straight at the trigger centre (robust under shift).
  //  - start/end: anchor near the aligned edge. This equals the trigger
  //    centre when the trigger fits inside the tooltip, and degrades to the
  //    tooltip centre when the trigger is larger — so a wide trigger never
  //    forces the arrow to clamp onto the opposite corner.
  const arrowHalf = arrowSize / 2
  const arrowTarget = (
    triggerStart: number,
    triggerSize: number,
    floatStart: number,
    floatSize: number,
  ): number => {
    if (align === 'start' || align === 'end') {
      const inset = Math.min(triggerSize / 2, floatSize / 2)
      return align === 'start' ? inset : floatSize - inset
    }
    return triggerStart + triggerSize / 2 - floatStart
  }

  let arrowX: number | null = null
  let arrowY: number | null = null
  if (resolvedSide === 'top' || resolvedSide === 'bottom') {
    const target = arrowTarget(trigger.x, trigger.width, coords.x, floating.width)
    const min = arrowPadding + arrowHalf
    const max = floating.width - arrowPadding - arrowHalf
    arrowX = clamp(target, min, max) - arrowHalf
  } else {
    const target = arrowTarget(trigger.y, trigger.height, coords.y, floating.height)
    const min = arrowPadding + arrowHalf
    const max = floating.height - arrowPadding - arrowHalf
    arrowY = clamp(target, min, max) - arrowHalf
  }

  return {
    x: coords.x,
    y: coords.y,
    placement: toPlacement(resolvedSide, align),
    side: resolvedSide,
    align,
    arrow: { x: arrowX, y: arrowY },
  }
}

/* ------------------------------------------------------------------ *
 * useFloating — React binding. Measures with getBoundingClientRect and
 * positions with `position: fixed`, so trigger rect and floating coords
 * are both viewport-relative and compose directly (no scroll-offset
 * math). Repositions on scroll (capture, to catch any ancestor scroller)
 * and resize. SSR-safe: no work until `open` and only inside a layout
 * effect.
 * ------------------------------------------------------------------ */

// useLayoutEffect on the client, useEffect on the server (avoids the SSR warning).
const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export interface UseFloatingOptions extends ComputePositionOptions {
  /** Only measure / position / listen while open (or force-mounted). */
  open: boolean
}

export interface UseFloatingState {
  x: number
  y: number
  placement: Placement
  side: Side
  align: Align
  arrowX: number | null
  arrowY: number | null
  /** False until the first measurement lands — hide the floating until then. */
  isPositioned: boolean
  /** True when the trigger has scrolled out of the viewport — hide the floating. */
  hidden: boolean
}

const INITIAL_STATE: UseFloatingState = {
  x: 0,
  y: 0,
  placement: 'top',
  side: 'top',
  align: 'center',
  arrowX: null,
  arrowY: null,
  isPositioned: false,
  hidden: false,
}

export function useFloating(
  triggerRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  arrowRef: RefObject<HTMLElement | null> | undefined,
  options: UseFloatingOptions,
): UseFloatingState {
  const {
    open,
    placement = 'top',
    offset = 0,
    padding = 8,
    dir = 'ltr',
    arrowSize = 0,
    arrowPadding = 0,
    boundary,
    flip = true,
    shift = true,
  } = options

  const [state, setState] = useState<UseFloatingState>(INITIAL_STATE)

  useIsoLayoutEffect(() => {
    if (!open) {
      // Reset so the next open re-hides until re-measured (no stale flash).
      setState((prev) => (prev.isPositioned ? { ...prev, isPositioned: false } : prev))
      return
    }

    const update = () => {
      const trigger = triggerRef.current
      const floating = floatingRef.current
      if (!trigger || !floating) return

      const tRect = trigger.getBoundingClientRect()
      // offsetWidth/Height (not getBoundingClientRect) so the entrance
      // `transform: scale()` animation doesn't report a shrunken size and
      // throw the placement off on the first frame.
      const fWidth = floating.offsetWidth
      const fHeight = floating.offsetHeight

      // Prefer the live arrow size if an arrow node is registered.
      const arrowNode = arrowRef?.current
      const resolvedArrowSize = arrowNode
        ? Math.max(arrowNode.offsetWidth, arrowNode.offsetHeight)
        : arrowSize

      const viewport: Boundary =
        boundary ?? { width: window.innerWidth, height: window.innerHeight }

      // Trigger fully outside the viewport → hide the floating (so a pinned
      // tooltip doesn't cling to the edge once its trigger scrolls away).
      // A fully-degenerate rect (all zeros — e.g. an unmeasurable element in
      // jsdom, or a not-yet-laid-out node) is "unmeasurable", not "off-screen",
      // so we don't hide on it — otherwise the floating would never appear.
      const isDegenerate =
        tRect.width === 0 &&
        tRect.height === 0 &&
        tRect.top === 0 &&
        tRect.left === 0
      const triggerHidden =
        !isDegenerate &&
        (tRect.bottom <= 0 ||
          tRect.top >= viewport.height ||
          tRect.right <= 0 ||
          tRect.left >= viewport.width)

      const result = computePosition(
        { x: tRect.x, y: tRect.y, width: tRect.width, height: tRect.height },
        { x: 0, y: 0, width: fWidth, height: fHeight },
        {
          placement,
          offset,
          padding,
          dir,
          arrowSize: resolvedArrowSize,
          arrowPadding,
          boundary: viewport,
          flip,
          shift,
        },
      )

      setState({
        x: result.x,
        y: result.y,
        placement: result.placement,
        side: result.side,
        align: result.align,
        arrowX: result.arrow.x,
        arrowY: result.arrow.y,
        isPositioned: true,
        hidden: triggerHidden,
      })
    }

    update()
    // Re-measure once layout has settled (fonts, focus-scroll, the entrance
    // animation's first frame). Without this the first paint can land at a
    // stale position until a scroll nudges it.
    const raf = requestAnimationFrame(update)

    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)

    // Reposition when the floating element or trigger changes size — e.g.
    // content that grows after first paint (web-font reflow, async/dynamic
    // children). Without this a side-placed tooltip measured too narrow can
    // end up overlapping its trigger once the real width lands.
    let observer: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(update)
      if (floatingRef.current) observer.observe(floatingRef.current)
      if (triggerRef.current) observer.observe(triggerRef.current)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
      observer?.disconnect()
    }
    // arrowRef / triggerRef / floatingRef are stable refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open,
    placement,
    offset,
    padding,
    dir,
    arrowSize,
    arrowPadding,
    flip,
    shift,
    boundary?.width,
    boundary?.height,
  ])

  return state
}
