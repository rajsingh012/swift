import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { mergeRefs } from '../internal/refs'
import { useSegmentedControlRoot } from './SegmentedControl.context'
import { cx, indicatorClasses } from './SegmentedControl.styles'
import type { SegmentedControlIndicatorProps } from './SegmentedControl.types'

/**
 * The sliding pill that sits *behind* the checked item. Position + size are
 * written imperatively via inline `style.transform` + `style.width/height`
 * so React doesn't re-render on every measurement (and the browser can
 * composite the slide on the GPU).
 *
 * Unlike the Tabs underline, this is a full-size pill: it matches the active
 * item's whole box on both axes, so the same measurement works for horizontal
 * and vertical orientations. `offsetLeft/offsetTop` are read against the root
 * (the shared offset parent) and are already direction-correct, so RTL needs
 * no special-casing here.
 *
 * Measurement strategy:
 *   - re-measure when `root.value` changes (active item switched)
 *   - re-measure when `measureToken` bumps (item mounted/unmounted)
 *   - ResizeObserver on the root + active item for container/font reflows
 *
 * Opt-in: consumers place `<SegmentedControl.Indicator />` inside the root.
 * When absent, no extra DOM exists.
 */
export const SegmentedControlIndicator = forwardRef<
  HTMLSpanElement,
  SegmentedControlIndicatorProps
>(function SegmentedControlIndicator(props, ref) {
  const { className, ...rest } = props
  const root = useSegmentedControlRoot('SegmentedControl.Indicator')

  const indicatorRef = useRef<HTMLSpanElement | null>(null)
  // Suppress the transition on the very first placement so the pill snaps to
  // the initial selection instead of growing from a zero-size box at the
  // origin. Subsequent moves animate normally.
  const placedRef = useRef(false)

  const update = () => {
    const node = indicatorRef.current
    if (!node) return
    const activeValue = root.value
    if (!activeValue) {
      // Nothing selected yet — zero out so the pill is invisible.
      node.style.transform = ''
      node.style.width = '0'
      node.style.height = '0'
      node.style.opacity = '0'
      return
    }
    const item = root.itemsRef.current.get(activeValue)
    if (!item) return

    const apply = () => {
      node.style.transform = `translate(${item.offsetLeft}px, ${item.offsetTop}px)`
      node.style.width = `${item.offsetWidth}px`
      node.style.height = `${item.offsetHeight}px`
      node.style.opacity = '1'
    }

    if (!placedRef.current) {
      // First placement: kill the transition, apply, flush layout, restore.
      const prev = node.style.transition
      node.style.transition = 'none'
      apply()
      void node.offsetWidth // force reflow so the next change animates
      node.style.transition = prev
      placedRef.current = true
    } else {
      apply()
    }
  }

  // useLayoutEffect for the initial position so the pill doesn't flash at
  // (0, 0) for a frame before settling on the active item.
  useLayoutEffect(() => {
    update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root.value, root.measureToken, root.orientation])

  // ResizeObserver on the root — picks up viewport resizes, font-load shifts,
  // and CSS-token changes that resize the items.
  useEffect(() => {
    const rootEl = root.rootRef.current
    if (!rootEl || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => update())
    ro.observe(rootEl)
    const activeValue = root.value
    const item = activeValue ? root.itemsRef.current.get(activeValue) : null
    if (item) ro.observe(item)
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root.value, root.measureToken])

  const mergedRef = useMemo(() => mergeRefs(ref, indicatorRef), [ref])

  return (
    <span
      ref={mergedRef}
      aria-hidden
      data-orientation={root.orientation}
      className={cx(indicatorClasses, className, root.indicatorClass)}
      {...rest}
    />
  )
})

SegmentedControlIndicator.displayName = 'SegmentedControl.Indicator'
