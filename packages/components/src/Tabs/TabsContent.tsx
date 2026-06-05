import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { mergeRefs } from '../internal/refs'
import { useTabsRoot } from './Tabs.context'
import { contentClasses, cx } from './Tabs.styles'
import type { TabsContentProps } from './Tabs.types'

/** Pointer travel before a swipe activates (axis-lock threshold). Smaller
 *  than the commit threshold so we can decide "is this a horizontal
 *  gesture?" early and call preventDefault to suppress page scroll. */
const SWIPE_ACTIVATION_PX = 8

/** Minimum horizontal displacement (in px) at release that flips tabs.
 *  Effective threshold is `max(SWIPE_COMMIT_PX, contentWidth * 0.25)`
 *  so wide panels need a proportionally longer swipe. */
const SWIPE_COMMIT_PX = 60

/** Window (ms) over which we average pointer velocity for fling detection.
 *  Short enough to capture the *release* speed, not the whole gesture. */
const VELOCITY_WINDOW_MS = 80

/** Release velocity (px/ms) above which a swipe commits regardless of
 *  displacement — the "fling" path. 0.5 px/ms ≈ a brisk flick. */
const FLING_VELOCITY = 0.5

/**
 * `role="tabpanel"` panel. Three mounting strategies, in order of
 * precedence:
 *   1. `forceMount` on the content → always rendered, hidden when inactive
 *   2. `lazyMount` on the root → rendered only while active, but once
 *      mounted it stays mounted (so form state survives a tab switch)
 *   3. Default → always rendered, hidden when inactive
 *
 * The `hidden` attribute is the right primitive: it removes the panel
 * from the accessibility tree (so SRs skip it) AND collapses it
 * visually, in one native attribute.
 *
 * When `swipeable` is true on the root, the active content also handles
 * a horizontal pointer-swipe gesture to flip to neighboring tabs. The
 * gesture is axis-locked: pure vertical drags (Math.abs(dy) > dx) are
 * ignored so scroll inside panels keeps working.
 */
export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent(props, ref) {
    const {
      value,
      forceMount = false,
      className,
      children,
      onPointerDown,
      ...rest
    } = props
    const root = useTabsRoot('Tabs.Content')

    // CRITICAL: destructure stable callbacks (see project_tabs.md trap #1)
    const { setValue, triggersRef, orderRef, contentId, triggerId } = root

    const isActive = root.value === value

    // Track whether this panel has ever been activated. Used by the
    // lazyMount path to keep content mounted after first activation so
    // form/editor state isn't lost on tab switch.
    const [hasBeenActive, setHasBeenActive] = useState(isActive)
    if (isActive && !hasBeenActive) {
      // Update during render — safe because the new value depends only
      // on the current value (idempotent) and we don't observe the prev
      // state elsewhere in this render.
      setHasBeenActive(true)
    }

    const shouldRender = forceMount || !root.lazyMount || hasBeenActive

    // ── Swipe gesture ──────────────────────────────────────────────
    // Live refs so window listeners don't capture stale state across
    // re-renders. (Same pattern Switch uses for drag-to-toggle.)
    const valueRef = useRef(value)
    valueRef.current = value
    const swipeableRef = useRef(root.swipeable)
    swipeableRef.current = root.swipeable
    const isActiveRef = useRef(isActive)
    isActiveRef.current = isActive
    const isRtlRef = useRef(root.dir === 'rtl')
    isRtlRef.current = root.dir === 'rtl'
    const loopRef = useRef(root.loop ?? true)
    loopRef.current = root.loop ?? true

    /** Active gesture cleanup. Null when no gesture is in flight. */
    const cleanupRef = useRef<(() => void) | null>(null)

    /** In-flight snap-back animation. Survives gesture cleanup so a
     *  follow-up pointerdown can cancel it before starting a new drag —
     *  otherwise the new drag's inline transform is masked by the
     *  ongoing animation's interpolated value. */
    const snapAnimationRef = useRef<Animation | null>(null)

    const contentRef = useRef<HTMLDivElement | null>(null)

    const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
      onPointerDown?.(event)
      if (event.defaultPrevented) return
      if (!swipeableRef.current) return
      if (!isActiveRef.current) return                       // only the visible panel responds
      if (event.button !== 0 && event.pointerType === 'mouse') return

      const target = event.target as HTMLElement | null
      // Don't hijack swipes that start on interactive content (buttons,
      // links, inputs). The consumer probably wants the inner element's
      // own pointer behaviour, not a tab change.
      if (
        target?.closest(
          'button, a, input, textarea, select, [role="button"], [contenteditable="true"]',
        )
      ) {
        return
      }

      const container = contentRef.current
      if (!container) return
      const width = container.offsetWidth || 1
      const commitThreshold = Math.max(SWIPE_COMMIT_PX, width * 0.25)

      cleanupRef.current?.()
      // Cancel any in-flight snap-back so the new drag's transform
      // isn't masked by the dying animation's interpolated value.
      if (snapAnimationRef.current) {
        snapAnimationRef.current.cancel()
        snapAnimationRef.current = null
      }

      const pointerId = event.pointerId
      const startX = event.clientX
      const startY = event.clientY
      const startValue = valueRef.current
      const startIsRtl = isRtlRef.current
      const startLoop = loopRef.current

      const state = {
        activated: false,
        aborted: false,
        lastDx: 0,
        /** Ring buffer of recent pointer samples for velocity calculation.
         *  Pruned to VELOCITY_WINDOW_MS on each push so we only consider
         *  the *release* gesture, not the whole swipe. */
        samples: [] as Array<{ x: number; t: number }>,
      }

      const onMove = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return
        if (state.aborted) return
        const dx = e.clientX - startX
        const dy = e.clientY - startY
        const absDx = Math.abs(dx)
        const absDy = Math.abs(dy)

        if (!state.activated) {
          // Axis lock: if vertical movement dominates BEFORE we hit the
          // horizontal activation threshold, abort the gesture so the
          // page scroll continues normally.
          if (absDy > absDx && absDy > SWIPE_ACTIVATION_PX) {
            state.aborted = true
            cleanup()
            return
          }
          if (absDx < SWIPE_ACTIVATION_PX) return
          state.activated = true
        }
        if (state.activated) {
          e.preventDefault()
          state.lastDx = dx
          // Append + prune the velocity sample window. event.timeStamp
          // is monotonic and high-resolution on modern browsers.
          const now = e.timeStamp
          state.samples.push({ x: e.clientX, t: now })
          const cutoff = now - VELOCITY_WINDOW_MS
          while (state.samples.length > 1 && state.samples[0].t < cutoff) {
            state.samples.shift()
          }
          // ── Visual follow-the-finger ────────────────────────────
          // Translate the panel inline (no transition) so it tracks
          // the pointer 1:1. We clear this either at commit
          // (setValue → panel becomes hidden, no visible jump) or via
          // an animated snap-back on cancel (below in onUp).
          container.style.transform = `translateX(${dx}px)`
        }
      }

      const cleanup = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onCancel)
        if (cleanupRef.current === cleanup) cleanupRef.current = null
      }

      /** Animate the panel back to translateX(0) using Web Animations
       *  API. Inline transform is cleared on finish so the natural
       *  CSS state takes over without a visual jump. */
      const snapBack = () => {
        const startTransform = container.style.transform || 'translateX(0)'
        container.style.transform = ''
        // Read offsetWidth to force the browser to flush the just-cleared
        // transform, otherwise the animation's `from` keyframe and the
        // resolved state may coincide and the animation does nothing.
        void container.offsetWidth
        const anim = container.animate(
          [{ transform: startTransform }, { transform: 'translateX(0)' }],
          {
            duration: 180,
            easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
            fill: 'none',
          },
        )
        snapAnimationRef.current = anim
        anim.onfinish = () => {
          if (snapAnimationRef.current === anim) snapAnimationRef.current = null
        }
      }

      const onUp = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return
        cleanup()
        if (!state.activated) return

        // Velocity-aware commit: a brisk flick crosses the threshold
        // even if the displacement is small. Computed across the most
        // recent VELOCITY_WINDOW_MS of samples — captures release
        // speed, not whole-gesture average.
        let velocity = 0
        if (state.samples.length >= 2) {
          const first = state.samples[0]
          const last = state.samples[state.samples.length - 1]
          const dt = last.t - first.t
          if (dt > 0) velocity = (last.x - first.x) / dt
        }
        const absVelocity = Math.abs(velocity)

        const passesDisplacement = Math.abs(state.lastDx) >= commitThreshold
        const passesFling = absVelocity >= FLING_VELOCITY
        if (!passesDisplacement && !passesFling) {
          // Didn't reach threshold — snap the panel back to its rest
          // position with a quick animation.
          snapBack()
          return
        }

        // Direction: if the user is flinging, velocity sign wins (you
        // can flick *against* a small drag). Otherwise use displacement.
        const sign = passesFling
          ? Math.sign(velocity)
          : Math.sign(state.lastDx)
        const goingNext = startIsRtl ? sign > 0 : sign < 0

        const order = orderRef.current
        const enabled = order.filter((v) => {
          const node = triggersRef.current.get(v)
          return node && !node.hasAttribute('data-disabled')
        })
        if (enabled.length === 0) return
        const idx = enabled.indexOf(startValue)
        if (idx === -1) return

        let nextIdx: number
        if (goingNext) {
          nextIdx = idx + 1
          if (nextIdx >= enabled.length) {
            if (!startLoop) {
              // Bounce off the end — no commit, but still animate the
              // panel back since it's translated by lastDx.
              snapBack()
              return
            }
            nextIdx = 0
          }
        } else {
          nextIdx = idx - 1
          if (nextIdx < 0) {
            if (!startLoop) {
              snapBack()
              return
            }
            nextIdx = enabled.length - 1
          }
        }
        const nextValue = enabled[nextIdx]
        if (nextValue) {
          // Commit: clear the inline transform synchronously. On the
          // next render this panel becomes `hidden` and the new active
          // panel takes its place at translateX(0). The user perceives
          // a clean swap rather than the old panel snapping back.
          container.style.transform = ''
          setValue(nextValue)
        }
      }

      const onCancel = (e: PointerEvent) => {
        if (e.pointerId !== pointerId) return
        cleanup()
        // Pointer was cancelled mid-gesture (e.g. system gesture took
        // over). Snap back to the rest position if we'd moved.
        if (state.activated && state.lastDx !== 0) snapBack()
      }

      cleanupRef.current = cleanup
      window.addEventListener('pointermove', onMove, { passive: false })
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onCancel)
    }

    useEffect(() => {
      return () => {
        cleanupRef.current?.()
        snapAnimationRef.current?.cancel()
      }
    }, [])

    // Memoize so React doesn't swap the ref every render. contentRef is
    // stable, `ref` is the forwarded ref (stable per consumer). Same
    // pattern used in TabsTrigger / TabsList.
    const mergedRef = useMemo(
      () => mergeRefs(contentRef, ref),
      [ref],
    )

    if (!shouldRender) return null

    return (
      <div
        ref={mergedRef}
        role="tabpanel"
        id={contentId(value)}
        aria-labelledby={triggerId(value)}
        // hidden collapses both layout and a11y tree — equivalent to
        // display:none for visuals and aria-hidden:true for SRs.
        hidden={!isActive}
        // Panels are part of the focus order so users can Tab from the
        // active trigger into the panel content. Inactive panels (hidden)
        // are skipped automatically.
        tabIndex={isActive ? 0 : undefined}
        data-state={isActive ? 'active' : 'inactive'}
        data-orientation={root.orientation}
        // touch-action: pan-y lets vertical scrolling happen natively
        // while we intercept horizontal gestures. Only set when swipeable
        // is on — otherwise leave native gesture handling fully intact.
        style={
          root.swipeable
            ? { touchAction: 'pan-y', ...rest.style }
            : rest.style
        }
        onPointerDown={handlePointerDown}
        className={cx(contentClasses, className)}
        {...rest}
      >
        {children}
      </div>
    )
  },
)

TabsContent.displayName = 'Tabs.Content'
