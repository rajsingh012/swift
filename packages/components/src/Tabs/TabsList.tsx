import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { mergeRefs } from '../internal/refs'
import { useTabsRoot } from './Tabs.context'
import { cx, listClasses } from './Tabs.styles'
import type { TabsListProps } from './Tabs.types'

/** Duration (ms) of the FLIP slide on dynamic add/remove. Matches the
 *  default `--tabs-transition-duration` token so visual rhythm is
 *  consistent with the indicator's own movement. */
const FLIP_DURATION_MS = 180

/**
 * `role="tablist"` container. Maintains the visual baseline (border on
 * the cross axis) and is the offset parent for both the indicator and
 * any scroll-into-view operations.
 *
 * When `scrollable` is true, the list overflows with native momentum
 * scrolling; the active trigger is scrolled into view on every value
 * change.
 *
 * **FLIP animation:** when triggers are added or removed, neighboring
 * triggers' layout positions shift. We remember each trigger's previous
 * box and, on layout commit, animate any that moved from
 * `translate(oldDelta)` back to `translate(0)` using the Web Animations
 * API. Pure transform — no reflow — so it composites cheaply on the
 * GPU. Same idea as the FLIP technique (First Last Invert Play).
 */
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList(props, ref) {
    const {
      scrollable = false,
      className,
      children,
      ...rest
    } = props
    const root = useTabsRoot('Tabs.List')

    // Scroll the active trigger into view whenever the value changes.
    useEffect(() => {
      if (!scrollable) return
      if (!root.value) return
      const node = root.triggersRef.current.get(root.value)
      if (!node) return
      node.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }, [scrollable, root.value, root.measureToken, root.triggersRef])

    // ── FLIP for dynamic add/remove ──────────────────────────────────
    // Snapshot each trigger's offset position. After each render that
    // bumps measureToken (registration / value change), compare the new
    // positions against the previous snapshot; any trigger whose box
    // moved gets a slide-from-old-position animation. New triggers
    // (no entry in `previous`) are skipped — they appear in place.
    const previousPositionsRef = useRef<
      Map<string, { left: number; top: number }>
    >(new Map())

    useLayoutEffect(() => {
      const previous = previousPositionsRef.current
      const next = new Map<string, { left: number; top: number }>()
      const isHorizontal = root.orientation === 'horizontal'

      for (const [value, node] of root.triggersRef.current.entries()) {
        const newPos = { left: node.offsetLeft, top: node.offsetTop }
        next.set(value, newPos)

        const oldPos = previous.get(value)
        if (!oldPos) continue                  // newly added — no FROM frame
        const dx = oldPos.left - newPos.left
        const dy = oldPos.top - newPos.top

        // Only animate the axis that matters for this orientation; the
        // cross axis usually doesn't change but if it does we ignore
        // the change rather than fight the natural layout.
        const delta = isHorizontal ? dx : dy
        if (delta === 0) continue

        const transform = isHorizontal
          ? `translateX(${delta}px)`
          : `translateY(${delta}px)`

        node.animate(
          [{ transform }, { transform: 'translate(0, 0)' }],
          {
            duration: FLIP_DURATION_MS,
            easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
            fill: 'none',
          },
        )
      }

      previousPositionsRef.current = next
      // measureToken bumps on every registry change, so it's the right
      // cue for "did the layout possibly shift".
    }, [root.measureToken, root.orientation, root.triggersRef])

    const localRef = useRef<HTMLDivElement | null>(null)
    const setRefs = useMemo(
      () => mergeRefs(ref, localRef, root.listRef),
      [ref, root.listRef],
    )

    return (
      <div
        ref={setRefs}
        role="tablist"
        aria-orientation={root.orientation}
        data-orientation={root.orientation}
        data-scrollable={scrollable ? 'true' : 'false'}
        className={cx(listClasses, className)}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

TabsList.displayName = 'Tabs.List'
