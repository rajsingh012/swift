import { forwardRef } from 'react'
import { useCarousel } from './Carousel.context'
import { cx, indicatorClasses } from './Carousel.styles'
import type { CarouselIndicatorProps } from './Carousel.types'

/**
 * A single indicator dot. Reads `selectedIndex` from context to derive
 * its active state, calls `scrollTo(index)` on click. Use directly when
 * composing custom indicator layouts — the standard usage goes through
 * `<Carousel.Indicators>` which renders one dot per snap automatically.
 */
export const CarouselIndicator = forwardRef<
  HTMLButtonElement,
  CarouselIndicatorProps
>(function CarouselIndicator(props, ref) {
  const {
    index,
    label,
    className,
    children,
    onClick,
    'aria-label': ariaLabel,
    ...rest
  } = props
  const { selectedIndex, scrollTo, classes } = useCarousel('Carousel.Indicator')

  const active = index === selectedIndex
  const computedLabel = label ?? ariaLabel ?? `Go to slide ${index + 1}`

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      data-active={active ? 'true' : 'false'}
      aria-current={active ? 'true' : undefined}
      aria-label={computedLabel}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) scrollTo(index)
      }}
      className={cx(indicatorClasses, classes?.indicator, className)}
    >
      {children}
    </button>
  )
})
CarouselIndicator.displayName = 'Carousel.Indicator'
