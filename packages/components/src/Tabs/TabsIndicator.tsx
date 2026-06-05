import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { mergeRefs } from '../internal/refs'
import { useTabsRoot } from './Tabs.context'
import { cx, indicatorClasses } from './Tabs.styles'
import type { TabsIndicatorProps } from './Tabs.types'

/**
 * Animated bar that tracks the active trigger. Position + size are
 * written imperatively via inline `style.transform` + `style.width/height`
 * so React doesn't re-render on every measurement (and so the browser
 * can composite the move on the GPU).
 *
 * Measurement strategy:
 *   - re-measure when `root.value` changes (active trigger switched)
 *   - re-measure when `measureToken` bumps (trigger mounted/unmounted)
 *   - ResizeObserver on the list to re-measure on container resize
 *
 * The indicator is opt-in: consumers must place `<Tabs.Indicator />`
 * somewhere inside `<Tabs.List>`. When absent, no extra DOM exists.
 */
export const TabsIndicator = forwardRef<HTMLSpanElement, TabsIndicatorProps>(
  function TabsIndicator(props, ref) {
    const { className, ...rest } = props
    const root = useTabsRoot('Tabs.Indicator')

    const indicatorRef = useRef<HTMLSpanElement | null>(null)

    // Imperative position update. Reads the active trigger's offset
    // geometry (always relative to its offset parent — the list, since
    // the indicator and the triggers share it as parent), translates,
    // then sets width/height for the cross axis. Vertical orientation
    // swaps which dimensions matter.
    const update = () => {
      const node = indicatorRef.current
      if (!node) return
      const activeValue = root.value
      if (!activeValue) {
        // No active tab yet — zero out so the indicator is invisible.
        node.style.transform = ''
        node.style.width = '0'
        node.style.height = '0'
        return
      }
      const trigger = root.triggersRef.current.get(activeValue)
      if (!trigger) return

      if (root.orientation === 'horizontal') {
        node.style.transform = `translateX(${trigger.offsetLeft}px)`
        node.style.width = `${trigger.offsetWidth}px`
        // Height comes from the CSS token; don't touch it.
        node.style.height = ''
      } else {
        node.style.transform = `translateY(${trigger.offsetTop}px)`
        node.style.height = `${trigger.offsetHeight}px`
        node.style.width = ''
      }
    }

    // useLayoutEffect for the initial position so the indicator doesn't
    // flash at (0, 0) for one frame before settling on the active tab.
    useLayoutEffect(() => {
      update()
      // root.value + measureToken are the right dependencies — anything
      // that changes the active trigger's identity OR its geometry
      // (mount/unmount, value swap) bumps one of them.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [root.value, root.measureToken, root.orientation])

    // ResizeObserver on the list — picks up viewport resizes, font load
    // shifts, and CSS-token changes that resize the triggers.
    useEffect(() => {
      const list = root.listRef.current
      if (!list || typeof ResizeObserver === 'undefined') return
      const ro = new ResizeObserver(() => update())
      ro.observe(list)
      // Also observe the active trigger so a re-flow (icon load, font
      // metrics) updates the indicator. Cheap: we observe one element.
      const activeValue = root.value
      const trigger = activeValue
        ? root.triggersRef.current.get(activeValue)
        : null
      if (trigger) ro.observe(trigger)
      return () => ro.disconnect()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [root.value, root.measureToken])

    const mergedRef = useMemo(
      () => mergeRefs(ref, indicatorRef),
      [ref],
    )

    return (
      <span
        ref={mergedRef}
        aria-hidden
        data-orientation={root.orientation}
        className={cx(indicatorClasses, className)}
        {...rest}
      />
    )
  },
)

TabsIndicator.displayName = 'Tabs.Indicator'
