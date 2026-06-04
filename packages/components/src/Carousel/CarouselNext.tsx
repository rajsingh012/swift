import { forwardRef } from 'react'
import { useCarousel } from './Carousel.context'
import { cx, nextClasses } from './Carousel.styles'
import type { CarouselNextProps } from './Carousel.types'

function DefaultNextIcon() {
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
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export const CarouselNext = forwardRef<HTMLButtonElement, CarouselNextProps>(
  function CarouselNext(props, ref) {
    const {
      className,
      children,
      disabled: disabledProp,
      onClick,
      'aria-label': ariaLabel,
      ...rest
    } = props
    const { scrollNext, canScrollNext, classes } = useCarousel('Carousel.Next')

    const disabled = disabledProp ?? !canScrollNext

    return (
      <button
        {...rest}
        ref={ref}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel ?? 'Next slide'}
        onClick={(e) => {
          onClick?.(e)
          if (!e.defaultPrevented) scrollNext()
        }}
        className={cx(nextClasses, classes?.next, className)}
      >
        {children ?? <DefaultNextIcon />}
      </button>
    )
  },
)
CarouselNext.displayName = 'Carousel.Next'
