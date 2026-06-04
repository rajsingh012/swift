import { forwardRef } from 'react'
import { useCarousel } from './Carousel.context'
import { cx, viewportClasses } from './Carousel.styles'
import type { CarouselViewportProps } from './Carousel.types'
import { mergeRefs } from './Carousel.utils'

/**
 * The scrolling viewport. Owns the focus surface (tabIndex=0) so
 * keyboard navigation has a target, and binds the pointer drag /
 * keyboard handlers that the root provides via context.
 *
 * Sets `viewportRef` on the context so the root can read scroll
 * position and call scrollTo against it.
 */
export const CarouselViewport = forwardRef<HTMLDivElement, CarouselViewportProps>(
  function CarouselViewport(props, ref) {
    const { className, children, ...rest } = props
    const {
      viewportRef,
      isDragging,
      onViewportPointerDown,
      onViewportPointerMove,
      onViewportPointerUp,
      onViewportPointerCancel,
      onViewportKeyDown,
      classes,
    } = useCarousel('Carousel.Viewport')

    return (
      <div
        {...rest}
        ref={mergeRefs(viewportRef, ref)}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel viewport"
        data-dragging={isDragging ? 'true' : undefined}
        onPointerDown={onViewportPointerDown}
        onPointerMove={onViewportPointerMove}
        onPointerUp={onViewportPointerUp}
        onPointerCancel={onViewportPointerCancel}
        onKeyDown={onViewportKeyDown}
        className={cx(viewportClasses, classes?.viewport, className)}
      >
        {children}
      </div>
    )
  },
)
CarouselViewport.displayName = 'Carousel.Viewport'
