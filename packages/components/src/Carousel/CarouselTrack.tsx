import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { useCarousel } from './Carousel.context'
import { cx, trackClasses } from './Carousel.styles'
import type { CarouselTrackProps } from './Carousel.types'
import { mergeRefs } from './Carousel.utils'

/**
 * Tag a cloned slide so the Root can identify it (real-vs-clone
 * mapping in scroll math) and so screen readers + page tab order skip
 * the duplicates. The visible content stays identical to the original
 * — only the structural metadata changes.
 */
function tagClone(
  node: ReactNode,
  key: string,
): ReactNode {
  if (!isValidElement(node)) return node
  const el = node as ReactElement<Record<string, unknown>>
  return cloneElement(el, {
    key,
    'data-clone': 'true',
    'aria-hidden': 'true',
    // Remove from focus order — without this, Tab would land on every
    // clone too, surfacing duplicate slides to keyboard users.
    tabIndex: -1,
  })
}

/**
 * Flex container that holds the items. The root reads this node to
 * measure item offsets, so it must contain *exactly* the slides — no
 * other DOM children, or the index ↔ child mapping will desync.
 *
 * When `loop` is on in the slide variant the Root sets `cloneCount > 0`
 * via context; we render the last K real items as clones at the start
 * AND the first K as clones at the end. The Root then knows that
 * DOM-index 0 is a clone of real-item (count - K), DOM-index K is the
 * first real item, etc. This makes the wrap-around feel seamless — a
 * single smooth slide-and-snap instead of a long sweep across all
 * intermediate slides.
 */
export const CarouselTrack = forwardRef<HTMLDivElement, CarouselTrackProps>(
  function CarouselTrack(props, ref) {
    const { className, children, ...rest } = props
    const { trackRef, cloneCount, classes } = useCarousel('Carousel.Track')

    const items = Children.toArray(children)
    const realCount = items.length

    let allItems: ReactNode[]
    if (cloneCount > 0 && realCount > 0) {
      const k = Math.min(cloneCount, realCount)
      const leading = items
        .slice(realCount - k)
        .map((c, i) => tagClone(c, `swift-carousel-clone-pre-${i}`))
      const trailing = items
        .slice(0, k)
        .map((c, i) => tagClone(c, `swift-carousel-clone-post-${i}`))
      allItems = [...leading, ...items, ...trailing]
    } else {
      allItems = items
    }

    return (
      <div
        {...rest}
        ref={mergeRefs(trackRef, ref)}
        className={cx(trackClasses, classes?.track, className)}
      >
        {allItems}
      </div>
    )
  },
)
CarouselTrack.displayName = 'Carousel.Track'
