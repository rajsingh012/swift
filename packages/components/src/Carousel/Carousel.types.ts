import type { HTMLAttributes, ReactNode } from 'react'

export type CarouselOrientation = 'horizontal' // vertical deferred to v2
export type CarouselDirection = 'ltr' | 'rtl'
export type CarouselAlign = 'start' | 'center' | 'end'

/**
 * Transition style.
 *
 *   - `slide` (default): native scroll + CSS scroll-snap. Slides
 *     translate horizontally.
 *   - `fade`: slides stack via CSS Grid in the same cell; transitions
 *     are opacity crossfades. Drag/scroll are disabled (there is no
 *     scroll position to manipulate) — Prev/Next/Indicators/Autoplay
 *     drive the selected index, CSS handles the visual.
 */
export type CarouselVariant = 'slide' | 'fade'

/**
 * Layered visual treatment for the `slide` variant.
 *
 *   - `none` (default): no extra treatment.
 *   - `peek`: pure-CSS — inactive slides fade + scale down, the
 *     active slide reads as the focal point. Pairs well with
 *     `align="center"` and `slidesPerView` between 1 and 2.
 *   - `coverflow`: 3D iTunes-style — side slides rotate, scale down
 *     and recede in Z while pulling toward centre. Driven per-frame
 *     by the engine (not data-active), so the rotation tracks the
 *     drag continuously. Pairs best with `align="center"` and a
 *     `slidesPerView` of 3–5 so multiple slides are visible at once.
 */
export type CarouselEffect = 'none' | 'peek' | 'coverflow'

export interface CarouselClasses {
  root?: string
  viewport?: string
  track?: string
  item?: string
  previous?: string
  next?: string
  indicators?: string
  indicator?: string
  progress?: string
}

export interface CarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** Controlled selected snap index. Pair with `onIndexChange`. */
  index?: number
  /** Uncontrolled initial snap index. */
  defaultIndex?: number
  /** Fires after a snap settles or a programmatic scrollTo lands. */
  onIndexChange?: (index: number) => void
  /** Wrap-around: `next` from last → 0, `prev` from 0 → last. */
  loop?: boolean
  /** How many slides fit in the viewport at once. */
  slidesPerView?: number
  /** Snap alignment within the viewport. */
  align?: CarouselAlign
  /** Gap between slides. Number = px. Strings are passed through. */
  gap?: number | string
  /** Reading direction. Currently used for visual ordering + Prev/Next placement. */
  dir?: CarouselDirection
  /** Hint for programmatic smooth-scroll duration in ms — applies to Prev/Next/scrollTo. */
  duration?: number
  /** Allow pointer drag on the viewport. Default `true`. Ignored in `variant="fade"` (always disabled). */
  draggable?: boolean
  /**
   * Transition style. `slide` (default) scrolls horizontally,
   * `fade` crossfades stacked slides in place.
   */
  variant?: CarouselVariant
  /**
   * Layered visual effect for the `slide` variant — pure-CSS treatment
   * keyed on each item's `data-active` attribute. See `CarouselEffect`.
   */
  effect?: CarouselEffect
  /**
   * Auto-advance the carousel on a timer. Pair with `loop` to keep
   * advancing past the last slide — without loop, autoplay stops at
   * the end.
   */
  autoplay?: boolean
  /** Time between auto-advances (ms). Default `4000`. */
  autoplayDelay?: number
  /**
   * Pause autoplay while the pointer is over the carousel. Default
   * `true`. Focus (keyboard) and active drag always pause regardless,
   * plus document visibility (tab switches).
   */
  pauseOnHover?: boolean
  /** Slot-level className overrides. */
  classes?: CarouselClasses
  children?: ReactNode
}

export interface CarouselViewportProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export interface CarouselTrackProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export interface CarouselPreviousProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'type'> {
  children?: ReactNode
  disabled?: boolean
}

export interface CarouselNextProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'type'> {
  children?: ReactNode
  disabled?: boolean
}

export type CarouselIndicatorsRenderProps = {
  count: number
  selected: number
  goTo: (index: number) => void
}

export interface CarouselIndicatorsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Children override — pass a render function to fully customise the dots. */
  children?: ReactNode | ((info: CarouselIndicatorsRenderProps) => ReactNode)
}

export interface CarouselIndicatorProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Zero-based snap index this indicator targets. */
  index: number
  /** Optional accessible label override. Defaults to `Go to slide N`. */
  label?: string
  children?: ReactNode
}

export interface CarouselProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional accessible label override. */
  'aria-label'?: string
}
