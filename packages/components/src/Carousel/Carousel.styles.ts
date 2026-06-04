export function cx(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ')
}

/* ── Root ───────────────────────────────────────────────────────── */

/**
 * Positioning context for the overlay-style Prev/Next buttons. The
 * default chrome stacks viewport → indicators with a small gap; consumers
 * can rearrange children freely without losing the absolute-anchor for
 * the buttons.
 */
export const rootClasses =
  'swift-carousel relative flex w-full flex-col gap-3 select-none'

/* ── Viewport ───────────────────────────────────────────────────── */

/**
 * Visible window onto the track. `overflow-hidden` because we DON'T
 * scroll — the engine transforms the track instead (see
 * `Carousel.utils.ts → animateOffset`). Native scroll would compete
 * with our transform and force a layout reflow every frame.
 *
 * `touch-pan-y` keeps vertical page scrolling alive on mobile — without
 * it, swiping horizontally inside the viewport would steal the gesture
 * from the surrounding page.
 */
export const viewportClasses =
  'swift-carousel-viewport relative w-full overflow-hidden touch-pan-y ' +
  'cursor-grab data-[dragging=true]:cursor-grabbing ' +
  'rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carousel-focus-ring)]'

/* ── Track ──────────────────────────────────────────────────────── */

/**
 * Flex container holding the items, translated horizontally each
 * frame by the engine. `w-full` so item `flex-basis: %` resolves
 * against the viewport width — items overflow horizontally (the
 * viewport clips), the transform reveals different windows.
 *
 * `will-change: transform` parks the track on its own compositor
 * layer so per-frame transform updates stay GPU-only. Without this
 * hint, the first transform of each gesture pays a layer-promotion
 * cost mid-animation, causing a visible jank frame.
 *
 * `transform: translate3d(0, 0, 0)` initial value (set inline by Root
 * once measurements land) is also the SSR hint that the layer should
 * exist from the first paint.
 */
export const trackClasses =
  'swift-carousel-track flex w-full gap-[var(--carousel-gap,0px)] ' +
  '[will-change:transform] [backface-visibility:hidden]'

/* ── Item ───────────────────────────────────────────────────────── */

/**
 * `flex: 0 0 var(--carousel-slide-basis)` — the basis is computed from
 * the root's `slidesPerView` + `gap` so N items fit perfectly in the
 * viewport. `min-w-0` is the standard escape hatch for flex children
 * that want to actually honour their basis (otherwise long text would
 * blow them past it).
 *
 * No `scroll-snap-*` here — we drive snap explicitly via the engine,
 * not the browser, so the consumer-tunable `duration` applies to drag-
 * release just like Prev/Next.
 *
 * The `transition` is the smoothness baseline for `effect="peek"` and
 * `variant="fade"` — both keyed on the `data-active` attribute the
 * root writes. Inactive items use `transform` / `opacity`, both
 * GPU-compositable so the transition stays at 60 fps even on big
 * slide content (`will-change: transform, opacity` hints the compositor).
 */
export const itemClasses =
  'swift-carousel-item shrink-0 grow-0 min-w-0 ' +
  '[flex-basis:var(--carousel-slide-basis,100%)] ' +
  'transition-[transform,opacity] duration-[var(--carousel-effect-duration,400ms)] ease-out ' +
  '[will-change:transform,opacity]'

/* ── Prev / Next buttons ────────────────────────────────────────── */

/**
 * Default chrome — circular floating control, anchored to the
 * viewport's vertical centre. Uses logical `start-3` / `end-3` so RTL
 * flips the placement automatically.
 *
 * Consumers wanting buttons below / outside the viewport can override
 * positioning via `classes.previous` / `classes.next` (className is
 * appended; positioning Tailwind utilities later in the cascade win).
 */
const controlBase =
  'absolute top-1/2 -translate-y-1/2 z-10 inline-flex shrink-0 items-center justify-center rounded-full border ' +
  'h-[var(--carousel-control-size)] w-[var(--carousel-control-size)] ' +
  'bg-[var(--carousel-control-bg)] text-[var(--carousel-control-color)] border-[var(--carousel-control-border)] ' +
  'cursor-pointer transition-all hover:not-disabled:shadow-md hover:not-disabled:scale-105 ' +
  'disabled:cursor-not-allowed disabled:opacity-40 ' +
  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--carousel-focus-ring)]'

export const previousClasses =
  'swift-carousel-prev start-3 ' + controlBase

export const nextClasses =
  'swift-carousel-next end-3 ' + controlBase

/* ── Indicators ─────────────────────────────────────────────────── */

export const indicatorsClasses =
  'swift-carousel-indicators flex items-center justify-center gap-2'

/**
 * Pill-style indicator — neutral dot grows into a coloured pill when
 * active. The width transition is animated, so the highlight feels
 * deliberate rather than abrupt.
 */
export const indicatorClasses =
  'swift-carousel-indicator block rounded-full cursor-pointer transition-all duration-200 ' +
  'h-[var(--carousel-indicator-size)] w-[var(--carousel-indicator-size)] ' +
  'bg-[var(--carousel-indicator-bg)] ' +
  'data-[active=true]:bg-[var(--carousel-indicator-active-bg)] data-[active=true]:w-6 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--carousel-focus-ring)]'

/* ── Progress bar ───────────────────────────────────────────────── */

/**
 * Horizontal track + fill. The fill width is set inline by
 * <Carousel.Progress> from the selected snap index, and the CSS
 * transition (driven by --carousel-duration so it matches the
 * scrollTo animation) makes the fill glide rather than jump.
 */
export const progressClasses =
  'swift-carousel-progress relative h-1 w-full overflow-hidden rounded-full ' +
  'bg-[var(--carousel-progress-track-bg)]'

export const progressFillClasses =
  'swift-carousel-progress-fill block h-full rounded-full ' +
  'bg-[var(--carousel-progress-fill-bg)] ' +
  'transition-[width] duration-[var(--carousel-duration,500ms)] ease-out'
