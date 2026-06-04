import { forwardRef } from 'react'
import { useCarousel } from './Carousel.context'
import { cx, previousClasses } from './Carousel.styles'
import type { CarouselPreviousProps } from './Carousel.types'

/**
 * Default arrow glyph. Inlined SVG rather than pulling from
 * `@swift/icons` so the carousel stays self-contained — and so it can
 * point left without a separate `ArrowLeft` import.
 */
function DefaultPrevIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

export const CarouselPrevious = forwardRef<
  HTMLButtonElement,
  CarouselPreviousProps
>(function CarouselPrevious(props, ref) {
  const {
    className,
    children,
    disabled: disabledProp,
    onClick,
    'aria-label': ariaLabel,
    ...rest
  } = props
  const { scrollPrev, canScrollPrev, classes } = useCarousel('Carousel.Previous')

  const disabled = disabledProp ?? !canScrollPrev

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      disabled={disabled}
      aria-label={ariaLabel ?? 'Previous slide'}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) scrollPrev()
      }}
      className={cx(previousClasses, classes?.previous, className)}
    >
      {children ?? <DefaultPrevIcon />}
    </button>
  )
})
CarouselPrevious.displayName = 'Carousel.Previous'
