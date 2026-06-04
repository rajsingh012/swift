import { forwardRef } from 'react'
import { useCarousel } from './Carousel.context'
import { cx, progressClasses, progressFillClasses } from './Carousel.styles'
import type { CarouselProgressProps } from './Carousel.types'

/**
 * Linear progress bar — alternative to dot indicators for carousels
 * with many slides where a row of dots would feel like noise.
 *
 * Fill width is `(selectedIndex + 1) / snapCount` so the bar lands at
 * 100 % on the last snap (not the last item). Animated via CSS
 * `transition: width var(--carousel-duration)`, so the fill glides
 * smoothly when an autoplay tick or scrollTo lands.
 */
export const CarouselProgress = forwardRef<
  HTMLDivElement,
  CarouselProgressProps
>(function CarouselProgress(props, ref) {
  const { className, style, 'aria-label': ariaLabel, ...rest } = props
  const { selectedIndex, itemCount, slidesPerView, classes } =
    useCarousel('Carousel.Progress')

  const snapCount = Math.max(1, itemCount - slidesPerView + 1)
  const percent = Math.max(
    0,
    Math.min(100, ((selectedIndex + 1) / snapCount) * 100),
  )

  return (
    <div
      {...rest}
      ref={ref}
      role="progressbar"
      aria-label={ariaLabel ?? 'Carousel progress'}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
      className={cx(progressClasses, classes?.progress, className)}
      style={style}
    >
      <span
        className={progressFillClasses}
        style={{ width: `${percent}%` }}
        aria-hidden="true"
      />
    </div>
  )
})
CarouselProgress.displayName = 'Carousel.Progress'
