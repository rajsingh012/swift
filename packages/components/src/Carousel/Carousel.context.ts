import {
  createContext,
  useContext,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import type {
  CarouselAlign,
  CarouselClasses,
  CarouselDirection,
  CarouselEffect,
  CarouselVariant,
} from './Carousel.types'

export interface CarouselContextValue {
  // ── DOM refs ──
  viewportRef: RefObject<HTMLDivElement | null>
  trackRef: RefObject<HTMLDivElement | null>

  // ── State ──
  selectedIndex: number
  itemCount: number
  /**
   * Number of items cloned at EACH end for seamless looping. 0 when
   * loop is off or in fade variant. Track reads this to render the
   * extra slides; Root uses it to map between real indices (the API
   * surface) and DOM indices (track.children positions).
   */
  cloneCount: number
  canScrollPrev: boolean
  canScrollNext: boolean
  isDragging: boolean

  // ── Options ──
  loop: boolean
  slidesPerView: number
  align: CarouselAlign
  dir: CarouselDirection
  draggable: boolean
  variant: CarouselVariant
  effect: CarouselEffect

  // ── Actions ──
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number, opts?: { smooth?: boolean }) => void

  // ── Viewport handlers ──
  // Bound by <Carousel.Viewport> on its root DOM node.
  onViewportPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void
  onViewportPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void
  onViewportPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void
  onViewportPointerCancel: (e: ReactPointerEvent<HTMLDivElement>) => void
  onViewportKeyDown: (e: ReactKeyboardEvent<HTMLDivElement>) => void

  // ── Slot classes ──
  classes?: CarouselClasses
}

export const CarouselContext = createContext<CarouselContextValue | null>(null)

export function useCarousel(componentName: string): CarouselContextValue {
  const ctx = useContext(CarouselContext)
  if (!ctx) {
    throw new Error(`<${componentName}> must be used inside <Carousel>.`)
  }
  return ctx
}
