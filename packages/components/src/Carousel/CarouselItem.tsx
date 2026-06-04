import { forwardRef } from 'react'
import { useCarousel } from './Carousel.context'
import { cx, itemClasses } from './Carousel.styles'
import type { CarouselItemProps } from './Carousel.types'

/**
 * A single slide. Lightweight — the root computes index by reading
 * track.children, so items don't need to register or know their
 * position. They are pure presentational flex children.
 *
 * `role="group"` + `aria-roledescription="slide"` is the WAI-ARIA
 * recommendation for carousel slides. Consumers who need positional
 * labels ("3 of 7") can pass `aria-label` through.
 */
export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  function CarouselItem(props, ref) {
    const { className, children, ...rest } = props
    const { classes } = useCarousel('Carousel.Item')

    return (
      <div
        {...rest}
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={cx(itemClasses, classes?.item, className)}
      >
        {children}
      </div>
    )
  },
)
CarouselItem.displayName = 'Carousel.Item'
