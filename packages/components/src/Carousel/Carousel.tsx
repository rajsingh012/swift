import { CarouselIndicator } from './CarouselIndicator'
import { CarouselIndicators } from './CarouselIndicators'
import { CarouselItem } from './CarouselItem'
import { CarouselNext } from './CarouselNext'
import { CarouselPrevious } from './CarouselPrevious'
import { CarouselProgress } from './CarouselProgress'
import { CarouselRoot } from './CarouselRoot'
import { CarouselTrack } from './CarouselTrack'
import { CarouselViewport } from './CarouselViewport'

export const Carousel = Object.assign(CarouselRoot, {
  Viewport: CarouselViewport,
  Track: CarouselTrack,
  Item: CarouselItem,
  Previous: CarouselPrevious,
  Next: CarouselNext,
  Indicators: CarouselIndicators,
  Indicator: CarouselIndicator,
  Progress: CarouselProgress,
})
