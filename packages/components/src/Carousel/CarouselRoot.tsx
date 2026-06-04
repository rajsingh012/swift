import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  CarouselContext,
  type CarouselContextValue,
} from './Carousel.context'
import { cx, rootClasses } from './Carousel.styles'
import type { CarouselProps } from './Carousel.types'
import {
  animateOffset,
  applyCoverflowTransforms,
  clearItemTransforms,
  mergeRefs,
  measurePositions,
  nearestIndexFromOffset,
  offsetForIndex,
  useControllableState,
  type ItemPosition,
} from './Carousel.utils'

/**
 * Carousel root — transform-based engine (Embla-style).
 *
 * The viewport is `overflow: hidden`; we never scroll it. Instead, the
 * track gets `transform: translate3d(Xpx, 0, 0)` updated each frame
 * imperatively. That keeps the animation on the compositor thread
 * (no per-frame layout reflow, no repaint of slide content), which is
 * the difference between "smooth-ish" and "buttery" — especially with
 * image-heavy slides.
 *
 * State this owns:
 *   - selectedIndex (controlled / uncontrolled, real-item space)
 *   - itemCount (live via MutationObserver, filters out [data-clone])
 *   - cloneCount (derived from loop + variant + slidesPerView)
 *   - offsetRef + positionsRef + viewportWidthRef (engine state — kept
 *     in refs so the rAF tick doesn't re-render)
 *   - isDragging, isHovered, isFocused, isVisible (autoplay pause sources)
 *
 * Index model. The PUBLIC API speaks in REAL indices [0..itemCount-1].
 * The engine works in DOM indices [0..track.children.length-1] which
 * includes clones at both ends. `toDom` / `toReal` bridge them.
 */
export const CarouselRoot = forwardRef<HTMLDivElement, CarouselProps>(
  function Carousel(props, ref) {
    const {
      index: indexProp,
      defaultIndex = 0,
      onIndexChange,
      loop = false,
      slidesPerView = 1,
      align = 'start',
      gap,
      dir = 'ltr',
      duration = 500,
      draggable = true,
      variant = 'slide',
      effect = 'none',
      autoplay = false,
      autoplayDelay = 4000,
      pauseOnHover = true,
      classes,
      className,
      style,
      children,
      onPointerEnter,
      onPointerLeave,
      onFocus,
      onBlur,
      ...rest
    } = props

    const isFade = variant === 'fade'
    const dragEnabled = draggable && !isFade

    // ── DOM refs ──────────────────────────────────────────────────
    const rootRef = useRef<HTMLDivElement | null>(null)
    const viewportRef = useRef<HTMLDivElement | null>(null)
    const trackRef = useRef<HTMLDivElement | null>(null)

    // ── Controlled/uncontrolled index ─────────────────────────────
    const [selectedIndex, setSelectedIndex] = useControllableState<number>(
      indexProp,
      defaultIndex,
      onIndexChange,
    )

    const selectedIndexRef = useRef(selectedIndex)
    selectedIndexRef.current = selectedIndex

    // ── Real item count (filters out clones) ──────────────────────
    const [itemCount, setItemCount] = useState(0)

    // ── Engine state (refs — no re-render per frame) ──────────────
    // Current transform value applied to the track. Negative as we
    // pan content "leftwards" to reveal later slides.
    const offsetRef = useRef<number>(0)
    // Cached layout snapshot of every track child. Re-measured on
    // mount, mutation (item add/remove), and resize.
    const positionsRef = useRef<ItemPosition[]>([])
    // Cached viewport width — folded into snap math without a per-tick
    // getBoundingClientRect.
    const viewportWidthRef = useRef<number>(0)

    // Active scroll animation cancel handle.
    const cancelAnimRef = useRef<(() => void) | null>(null)
    // True between "wrap animation starts" and "snap-back completes" —
    // gates the controlled-sync effect so it doesn't fight the wrap.
    const loopWrapInProgressRef = useRef(false)
    // Set true once we've placed the track at the initial real-item
    // offset (relevant when clones shift the "real index 0" position
    // away from offset 0).
    const initializedRef = useRef(false)

    // ── Clone count ──────────────────────────────────────────────
    const cloneCount = useMemo(() => {
      if (!loop || isFade) return 0
      return Math.max(1, Math.ceil(slidesPerView))
    }, [loop, isFade, slidesPerView])

    // ── Effective last snap (real index) ──────────────────────────
    const lastIndex = useMemo(() => {
      if (itemCount === 0) return 0
      if (isFade) return Math.max(0, itemCount - 1)
      if (align === 'start') return Math.max(0, itemCount - slidesPerView)
      return Math.max(0, itemCount - 1)
    }, [itemCount, slidesPerView, align, isFade])

    const canScrollPrev = loop ? itemCount > 1 : selectedIndex > 0
    const canScrollNext = loop ? itemCount > 1 : selectedIndex < lastIndex

    // ── Pause sources for autoplay ────────────────────────────────
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [isVisible, setIsVisible] = useState(true)

    // ── Drag bookkeeping ──────────────────────────────────────────
    const dragRef = useRef<{
      pointerId: number
      startX: number
      startOffset: number
      moved: boolean
    } | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const cancelAnim = useCallback(() => {
      cancelAnimRef.current?.()
      cancelAnimRef.current = null
      loopWrapInProgressRef.current = false
    }, [])

    // ── DOM-index ↔ real-index conversion ─────────────────────────
    const toDom = useCallback(
      (realIndex: number) => cloneCount + realIndex,
      [cloneCount],
    )
    const toReal = useCallback(
      (domIndex: number) => {
        if (cloneCount === 0 || itemCount === 0) return domIndex
        if (domIndex < cloneCount) {
          return itemCount - cloneCount + domIndex
        }
        if (domIndex >= cloneCount + itemCount) {
          return domIndex - cloneCount - itemCount
        }
        return domIndex - cloneCount
      },
      [cloneCount, itemCount],
    )

    // ── Apply transform (imperative — bypass React) ───────────────
    // Called from the rAF tick and from drag move handlers. Stays
    // imperative so we never trigger a render per frame.
    //
    // In `effect="coverflow"` we ALSO write a per-item 3D transform
    // each frame — the side slides need to track the drag continuously
    // (rotation flips would pop at snap boundaries if we only updated
    // on selectedIndex change).
    const applyOffset = useCallback(
      (x: number) => {
        offsetRef.current = x
        const track = trackRef.current
        if (!track) return
        // translate3d (not translateX) so the browser composites this
        // on its own GPU layer — the difference of one keyword is the
        // difference between main-thread paints and pure compositor.
        track.style.transform = `translate3d(${x}px, 0, 0)`
        if (effect === 'coverflow') {
          applyCoverflowTransforms(
            track,
            positionsRef.current,
            viewportWidthRef.current,
            x,
            align,
          )
        }
      },
      [align, effect],
    )

    // ── Measurement + reapply ────────────────────────────────────
    // Snapshots layout and re-pins the track to the alignment for the
    // current selectedIndex. Called on mount, mutation (items added/
    // removed), and resize.
    const remeasure = useCallback(() => {
      const track = trackRef.current
      const viewport = viewportRef.current
      if (!track || !viewport) return
      positionsRef.current = measurePositions(track)
      viewportWidthRef.current = viewport.clientWidth
      // Re-pin the track. Without this, a resize would leave the
      // current slide misaligned by however much the geometry changed.
      const target = offsetForIndex(
        positionsRef.current,
        viewportWidthRef.current,
        toDom(selectedIndexRef.current),
        align,
      )
      if (target !== null) {
        cancelAnim()
        applyOffset(target)
      }
    }, [align, applyOffset, cancelAnim, toDom])

    // ── Mount + observers ────────────────────────────────────────
    useEffect(() => {
      const track = trackRef.current
      const viewport = viewportRef.current
      if (!track || !viewport) return

      // Track real-vs-clone children whenever the children set
      // changes (consumer adds/removes a slide, loop toggles, etc.).
      const recountAndMeasure = () => {
        let real = 0
        for (let i = 0; i < track.children.length; i++) {
          if (!(track.children[i] as HTMLElement).hasAttribute('data-clone')) {
            real++
          }
        }
        setItemCount(real)
        remeasure()
      }
      recountAndMeasure()

      const mo = new MutationObserver(recountAndMeasure)
      mo.observe(track, { childList: true })

      const ro = new ResizeObserver(() => {
        if (isDragging) return
        remeasure()
      })
      ro.observe(viewport)
      ro.observe(track)

      return () => {
        mo.disconnect()
        ro.disconnect()
      }
    }, [remeasure, isDragging])

    // ── scrollTo (public — speaks in real indices) ────────────────
    const scrollTo = useCallback<CarouselContextValue['scrollTo']>(
      (realIndex, opts) => {
        const clamped = Math.max(
          0,
          Math.min(realIndex, Math.max(0, itemCount - 1)),
        )

        if (!isFade) {
          const target = offsetForIndex(
            positionsRef.current,
            viewportWidthRef.current,
            toDom(clamped),
            align,
          )
          if (target !== null) {
            cancelAnim()
            if (opts?.smooth === false) {
              applyOffset(target)
            } else {
              cancelAnimRef.current = animateOffset(
                applyOffset,
                offsetRef.current,
                target,
                duration,
              )
            }
          }
        }

        if (clamped !== selectedIndexRef.current) {
          setSelectedIndex(clamped)
        }
      },
      [
        align,
        applyOffset,
        cancelAnim,
        duration,
        isFade,
        itemCount,
        setSelectedIndex,
        toDom,
      ],
    )

    // ── scrollPrev / scrollNext (with cloned-loop wrap) ───────────
    //
    // Wrap strategy: PRE-SNAP, not post-snap. Instead of animating
    // forward and then jumping back at the end (which leaves a visible
    // hitch on slower compositors), we teleport the track to the
    // CLONE EQUIVALENT of the current slide first — visually invisible
    // because clones share content with their reals — and then run a
    // single, ordinary one-slide animation that lands directly on the
    // real target. No `onComplete` jump, no perceptible seam.
    //
    // The clone-equivalent math, for cloneCount=K:
    //   leading clones (DOM 0..K-1) mirror real[realCount-K..realCount-1]
    //   trailing clones (DOM K+realCount..end) mirror real[0..K-1]
    // so clone-of-real[i] is at DOM (i - realCount + K) on the leading
    // side, or DOM (K + realCount + i) on the trailing side.
    const scrollPrev = useCallback(() => {
      const curr = selectedIndexRef.current
      if (curr > 0) {
        scrollTo(curr - 1)
        return
      }
      if (!loop) return
      if (isFade || cloneCount === 0) {
        scrollTo(lastIndex)
        return
      }

      // Pre-snap to the TRAILING-clone equivalent of curr (=0), then
      // animate one slide BACK to real[lastIndex].
      const cloneEquivalentDom = cloneCount + itemCount + curr
      const preSnapOffset = offsetForIndex(
        positionsRef.current,
        viewportWidthRef.current,
        cloneEquivalentDom,
        align,
      )
      const animateTo = offsetForIndex(
        positionsRef.current,
        viewportWidthRef.current,
        cloneEquivalentDom - 1,
        align,
      )
      if (preSnapOffset === null || animateTo === null) return

      cancelAnim()
      applyOffset(preSnapOffset)
      // Guard the controlled-sync effect — when setSelectedIndex
      // fires below, the effect's `expected` could differ from our
      // animation target (e.g. align=start + slidesPerView>1) and
      // it would otherwise cancel our wrap with a long sweep.
      loopWrapInProgressRef.current = true
      cancelAnimRef.current = animateOffset(
        applyOffset,
        preSnapOffset,
        animateTo,
        duration,
        () => {
          loopWrapInProgressRef.current = false
          cancelAnimRef.current = null
        },
      )
      setSelectedIndex(lastIndex)
    }, [
      align,
      applyOffset,
      cancelAnim,
      cloneCount,
      duration,
      isFade,
      itemCount,
      lastIndex,
      loop,
      scrollTo,
      setSelectedIndex,
    ])

    const scrollNext = useCallback(() => {
      const curr = selectedIndexRef.current
      if (curr < lastIndex) {
        scrollTo(curr + 1)
        return
      }
      if (!loop) return
      if (isFade || cloneCount === 0) {
        scrollTo(0)
        return
      }

      // Pre-snap to the LEADING-clone equivalent of curr (=lastIndex),
      // then animate one slide FORWARD to real[0]. For align=center
      // (and align=end), `lastIndex = realCount - 1` so the animation
      // lands cleanly at toDom(0). For align=start with slidesPerView>1
      // it lands on a clone of an intermediate slide; the controlled-
      // sync effect will then converge to toDom(0) — not optimal but
      // not janky.
      const cloneEquivalentDom = curr - itemCount + cloneCount
      const preSnapOffset = offsetForIndex(
        positionsRef.current,
        viewportWidthRef.current,
        cloneEquivalentDom,
        align,
      )
      const animateTo = offsetForIndex(
        positionsRef.current,
        viewportWidthRef.current,
        cloneEquivalentDom + 1,
        align,
      )
      if (preSnapOffset === null || animateTo === null) return

      cancelAnim()
      applyOffset(preSnapOffset)
      loopWrapInProgressRef.current = true
      cancelAnimRef.current = animateOffset(
        applyOffset,
        preSnapOffset,
        animateTo,
        duration,
        () => {
          loopWrapInProgressRef.current = false
          cancelAnimRef.current = null
        },
      )
      setSelectedIndex(0)
    }, [
      align,
      applyOffset,
      cancelAnim,
      cloneCount,
      duration,
      isFade,
      itemCount,
      lastIndex,
      loop,
      scrollTo,
      setSelectedIndex,
    ])

    // ── data-active sync (clones included) ────────────────────────
    // Both the real selected item AND any clone of it get
    // data-active=true. Important for peek/fade: the clone visible
    // during a wrap animation needs the same active styling so the
    // visual stays consistent across the transition.
    useEffect(() => {
      const track = trackRef.current
      if (!track) return
      for (let i = 0; i < track.children.length; i++) {
        const child = track.children[i] as HTMLElement
        const realOfChild = toReal(i)
        child.setAttribute(
          'data-active',
          realOfChild === selectedIndex ? 'true' : 'false',
        )
      }
    }, [selectedIndex, itemCount, cloneCount, toReal])

    // ── Effect switch: apply / clear coverflow transforms ─────────
    // When `effect` flips to coverflow, re-run applyOffset against the
    // current position so the 3D transforms get written. When it flips
    // away, clear the inline transforms so items return to flat layout
    // rendering.
    useEffect(() => {
      const track = trackRef.current
      if (!track) return
      if (effect === 'coverflow') {
        applyOffset(offsetRef.current)
      } else {
        clearItemTransforms(track)
      }
    }, [effect, applyOffset])

    // ── Initial pin: place track at real[selectedIndex] when clones exist ─
    useEffect(() => {
      if (initializedRef.current) return
      if (cloneCount === 0) {
        initializedRef.current = true
        return
      }
      if (itemCount === 0) return
      if (positionsRef.current.length < cloneCount + itemCount) return
      const target = offsetForIndex(
        positionsRef.current,
        viewportWidthRef.current,
        toDom(selectedIndex),
        align,
      )
      if (target !== null) {
        applyOffset(target)
        initializedRef.current = true
      }
    }, [align, applyOffset, cloneCount, itemCount, selectedIndex, toDom])

    // ── Controlled-mode sync: index prop → track offset ──────────
    useEffect(() => {
      if (isFade) return
      if (loopWrapInProgressRef.current) return
      if (isDragging) return
      if (itemCount === 0) return
      if (positionsRef.current.length === 0) return

      const target = offsetForIndex(
        positionsRef.current,
        viewportWidthRef.current,
        toDom(selectedIndex),
        align,
      )
      if (target === null) return
      if (Math.abs(offsetRef.current - target) > 0.5) {
        cancelAnim()
        cancelAnimRef.current = animateOffset(
          applyOffset,
          offsetRef.current,
          target,
          duration,
        )
      }
    }, [
      selectedIndex,
      align,
      applyOffset,
      cancelAnim,
      duration,
      isDragging,
      itemCount,
      isFade,
      toDom,
    ])

    // ── Document visibility (pauses autoplay across tab switches) ──
    useEffect(() => {
      if (!autoplay) return
      const onVisibility = () => setIsVisible(!document.hidden)
      setIsVisible(!document.hidden)
      document.addEventListener('visibilitychange', onVisibility)
      return () => document.removeEventListener('visibilitychange', onVisibility)
    }, [autoplay])

    // ── Autoplay loop ─────────────────────────────────────────────
    const isPaused =
      isDragging ||
      isFocused ||
      !isVisible ||
      (pauseOnHover && isHovered) ||
      itemCount < 2
    useEffect(() => {
      if (!autoplay) return
      if (isPaused) return
      const id = window.setInterval(() => {
        scrollNext()
      }, Math.max(500, autoplayDelay))
      return () => window.clearInterval(id)
    }, [autoplay, autoplayDelay, isPaused, scrollNext])

    // ── Pointer drag (slide variant only) ─────────────────────────
    const onViewportPointerDown = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
        if (!dragEnabled) return
        if (e.button !== 0 && e.pointerType === 'mouse') return
        const viewport = viewportRef.current
        if (!viewport) return

        cancelAnim()

        try {
          viewport.setPointerCapture(e.pointerId)
        } catch {
          /* some browsers throw if capture is already held */
        }

        dragRef.current = {
          pointerId: e.pointerId,
          startX: e.clientX,
          startOffset: offsetRef.current,
          moved: false,
        }
        setIsDragging(true)
      },
      [cancelAnim, dragEnabled],
    )

    const onViewportPointerMove = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current
        if (!drag || e.pointerId !== drag.pointerId) return

        const dx = e.clientX - drag.startX
        if (Math.abs(dx) > 5) drag.moved = true

        // Dragging right pans content right → translate-X increases.
        // (Note this is the opposite sign of the old scrollLeft approach.)
        applyOffset(drag.startOffset + dx)

        // Live indicator update: report which slide is currently
        // snapped-nearest to the alignment point.
        const domNearest = nearestIndexFromOffset(
          positionsRef.current,
          viewportWidthRef.current,
          offsetRef.current,
          align,
        )
        const realNearest = toReal(domNearest)
        if (realNearest !== selectedIndexRef.current) {
          setSelectedIndex(realNearest)
        }

        e.preventDefault()
      },
      [align, applyOffset, setSelectedIndex, toReal],
    )

    const endDrag = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current
        if (!drag || e.pointerId !== drag.pointerId) return

        const viewport = viewportRef.current
        try {
          viewport?.releasePointerCapture(e.pointerId)
        } catch {
          /* already released */
        }

        const moved = drag.moved
        dragRef.current = null
        setIsDragging(false)

        // Snap-to-nearest. The nearest DOM child may be a CLONE (user
        // dragged past the loop boundary into the clone region). In
        // that case we animate to the clone's offset — a SHORT smooth
        // step from the user's release point, never a long sweep —
        // and then instant-jump to the matching real position on
        // animation complete. Visual content at clone === real, so
        // the jump is invisible. This is the same pre-snap / post-snap
        // pattern as scrollNext/scrollPrev wrap, applied to drag.
        //
        // Without this, `scrollTo(toReal(nearest))` would animate from
        // the user's release point in the trailing-clone region back
        // to the real-slide region — sweeping across every intermediate
        // real slide. That's the "long sweep" the user notices.
        const domNearest = nearestIndexFromOffset(
          positionsRef.current,
          viewportWidthRef.current,
          offsetRef.current,
          align,
        )
        const realIndex = toReal(domNearest)
        const isClone =
          cloneCount > 0 &&
          (domNearest < cloneCount ||
            domNearest >= cloneCount + itemCount)
        const target = offsetForIndex(
          positionsRef.current,
          viewportWidthRef.current,
          domNearest,
          align,
        )

        if (target !== null) {
          cancelAnim()
          // Velocity-matched snap duration. A Prev/Next click moves a
          // full slide in `duration` ms; a drag release of e.g. 30 %
          // of a slide should land in 30 % of `duration` to keep the
          // perceived speed the same. Without this, short-distance
          // snaps feel slow and floaty because the same `duration` is
          // spread over a much smaller distance.
          //
          // Floored at 150 ms so micro-drags don't snap so fast they
          // read as a pop, and clamped to `duration` so a full-slide
          // snap never out-runs the click animation.
          const slideWidth = positionsRef.current[0]?.width || 1
          const dragDistance = Math.abs(target - offsetRef.current)
          const snapDuration = Math.max(
            150,
            Math.min(duration, (dragDistance / slideWidth) * duration),
          )

          if (isClone) {
            const realLanding = offsetForIndex(
              positionsRef.current,
              viewportWidthRef.current,
              toDom(realIndex),
              align,
            )
            loopWrapInProgressRef.current = true
            cancelAnimRef.current = animateOffset(
              applyOffset,
              offsetRef.current,
              target,
              snapDuration,
              () => {
                if (realLanding !== null) applyOffset(realLanding)
                loopWrapInProgressRef.current = false
                cancelAnimRef.current = null
              },
            )
          } else {
            cancelAnimRef.current = animateOffset(
              applyOffset,
              offsetRef.current,
              target,
              snapDuration,
            )
          }
        }

        if (realIndex !== selectedIndexRef.current) {
          setSelectedIndex(realIndex)
        }

        // Swallow next click if drag moved.
        if (moved && viewport) {
          const swallow = (ev: Event) => {
            ev.stopPropagation()
            ev.preventDefault()
          }
          viewport.addEventListener('click', swallow, {
            capture: true,
            once: true,
          })
          window.setTimeout(() => {
            viewport.removeEventListener('click', swallow, {
              capture: true,
            } as EventListenerOptions)
          }, 50)
        }
      },
      [align, scrollTo, toReal],
    )

    // ── Keyboard navigation ───────────────────────────────────────
    const onViewportKeyDown = useCallback(
      (e: ReactKeyboardEvent<HTMLDivElement>) => {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault()
            if (dir === 'rtl') scrollNext()
            else scrollPrev()
            break
          case 'ArrowRight':
            e.preventDefault()
            if (dir === 'rtl') scrollPrev()
            else scrollNext()
            break
          case 'Home':
            e.preventDefault()
            scrollTo(0)
            break
          case 'End':
            e.preventDefault()
            scrollTo(lastIndex)
            break
        }
      },
      [dir, lastIndex, scrollPrev, scrollNext, scrollTo],
    )

    // ── Root-level pointer / focus handlers for autoplay pause ────
    const handleRootPointerEnter = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
        setIsHovered(true)
        onPointerEnter?.(e)
      },
      [onPointerEnter],
    )
    const handleRootPointerLeave = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
        setIsHovered(false)
        onPointerLeave?.(e)
      },
      [onPointerLeave],
    )
    const handleRootFocus = useCallback(
      (e: ReactFocusEvent<HTMLDivElement>) => {
        setIsFocused(true)
        onFocus?.(e)
      },
      [onFocus],
    )
    const handleRootBlur = useCallback(
      (e: ReactFocusEvent<HTMLDivElement>) => {
        if (
          rootRef.current &&
          e.relatedTarget instanceof Node &&
          rootRef.current.contains(e.relatedTarget)
        ) {
          return
        }
        setIsFocused(false)
        onBlur?.(e)
      },
      [onBlur],
    )

    // ── Context value ─────────────────────────────────────────────
    const ctx = useMemo<CarouselContextValue>(
      () => ({
        viewportRef,
        trackRef,
        selectedIndex,
        itemCount,
        cloneCount,
        canScrollPrev,
        canScrollNext,
        isDragging,
        loop,
        slidesPerView,
        align,
        dir,
        draggable: dragEnabled,
        variant,
        effect,
        scrollPrev,
        scrollNext,
        scrollTo,
        onViewportPointerDown,
        onViewportPointerMove,
        onViewportPointerUp: endDrag,
        onViewportPointerCancel: endDrag,
        onViewportKeyDown,
        classes,
      }),
      [
        selectedIndex,
        itemCount,
        cloneCount,
        canScrollPrev,
        canScrollNext,
        isDragging,
        loop,
        slidesPerView,
        align,
        dir,
        dragEnabled,
        variant,
        effect,
        scrollPrev,
        scrollNext,
        scrollTo,
        onViewportPointerDown,
        onViewportPointerMove,
        endDrag,
        onViewportKeyDown,
        classes,
      ],
    )

    // ── Inline CSS vars (driven by props) ─────────────────────────
    const cssVars: CSSProperties = {
      ...((style ?? {}) as CSSProperties),
      ['--carousel-gap' as string]:
        gap === undefined
          ? undefined
          : typeof gap === 'number'
            ? `${gap}px`
            : gap,
      ['--carousel-slides-per-view' as string]: slidesPerView,
      ['--carousel-slide-basis' as string]: `calc((100% - var(--carousel-gap, 0px) * (${slidesPerView} - 1)) / ${slidesPerView})`,
      ['--carousel-duration' as string]: `${duration}ms`,
    }

    return (
      <CarouselContext.Provider value={ctx}>
        <div
          {...rest}
          ref={mergeRefs(rootRef, ref)}
          dir={dir}
          data-orientation="horizontal"
          data-variant={variant}
          data-effect={effect}
          data-autoplay={autoplay ? 'true' : undefined}
          data-paused={autoplay && isPaused ? 'true' : undefined}
          aria-roledescription="carousel"
          className={cx(rootClasses, classes?.root, className)}
          style={cssVars}
          onPointerEnter={handleRootPointerEnter}
          onPointerLeave={handleRootPointerLeave}
          onFocus={handleRootFocus}
          onBlur={handleRootBlur}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  },
)
CarouselRoot.displayName = 'Carousel'
