import { forwardRef, Fragment } from 'react'
import { useCarousel } from './Carousel.context'
import { CarouselIndicator } from './CarouselIndicator'
import { cx, indicatorsClasses } from './Carousel.styles'
import { resolveRenderProp } from '../internal/props'
import type { CarouselIndicatorsProps } from './Carousel.types'

/**
 * Renders one `<Carousel.Indicator>` per snap by default. The snap
 * count is `itemCount - slidesPerView + 1` — i.e. the number of
 * distinct resting positions, not the raw item count. With
 * `slidesPerView=3` over 6 items, there are 4 indicators (each one
 * shows a different window of 3 slides).
 *
 * Two levels of customisation, both following library conventions:
 *   - `renderIndicator` (render-prop) restyles each dot from its state,
 *     keeping the default count + container:
 *       <Carousel.Indicators
 *         renderIndicator={({ index, selected, goTo }) => …}
 *       />
 *   - `children` (node or render function) replaces the whole content,
 *     for when you also want to change the layout:
 *       <Carousel.Indicators>
 *         {({ count, selected, goTo }) => …}
 *       </Carousel.Indicators>
 */
export const CarouselIndicators = forwardRef<
  HTMLDivElement,
  CarouselIndicatorsProps
>(function CarouselIndicators(props, ref) {
  const { className, children, renderIndicator, ...rest } = props
  const { selectedIndex, itemCount, slidesPerView, scrollTo, classes } =
    useCarousel('Carousel.Indicators')

  // Effective snap count — at least 1 even with no items, so we don't
  // briefly render nothing during the initial layout pass.
  const count = Math.max(1, itemCount - slidesPerView + 1)

  let content: React.ReactNode
  if (typeof children === 'function') {
    content = children({ count, selected: selectedIndex, goTo: scrollTo })
  } else if (children !== undefined) {
    content = children
  } else if (renderIndicator !== undefined) {
    content = Array.from({ length: count }, (_, i) => (
      <Fragment key={i}>
        {resolveRenderProp(renderIndicator, {
          index: i,
          selected: i === selectedIndex,
          goTo: () => scrollTo(i),
        })}
      </Fragment>
    ))
  } else {
    content = Array.from({ length: count }, (_, i) => (
      <CarouselIndicator key={i} index={i} />
    ))
  }

  return (
    <div
      {...rest}
      ref={ref}
      role="tablist"
      aria-label="Carousel pagination"
      className={cx(indicatorsClasses, classes?.indicators, className)}
    >
      {content}
    </div>
  )
})
CarouselIndicators.displayName = 'Carousel.Indicators'
