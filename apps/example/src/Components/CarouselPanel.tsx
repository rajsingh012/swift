import { useEffect, useState } from 'react'
import { Carousel } from '@swift/components/Carousel'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { BrowserCompat, CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Compound horizontal carousel built on native CSS scroll-snap with pointer drag, keyboard navigation (Arrow/Home/End), controlled & uncontrolled index, multi-slide layouts with snap alignment, loop wrap-around, RTL placement, full theme tokens, and SSR-safe rendering. No external library.'

type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

const CAROUSEL_PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'index',
    type: 'number',
    description:
      'Controlled selected snap index. Pair with `onIndexChange`. The carousel will smooth-scroll to this index whenever it changes from outside.',
  },
  {
    name: 'defaultIndex',
    type: 'number',
    defaultValue: '0',
    description:
      'Uncontrolled starting snap index. Ignored when `index` is provided.',
  },
  {
    name: 'onIndexChange',
    type: '(index: number) => void',
    description:
      'Fires after a snap settles — pointerup, programmatic scroll completion, or native scroll-snap landing.',
  },
  {
    name: 'loop',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Wrap-around mode. Next from last snap jumps to 0, Previous from 0 jumps to the last. v1 is non-infinite — the wrap-around scrolls visibly back through all slides rather than seamlessly cloning.',
  },
  {
    name: 'slidesPerView',
    type: 'number',
    defaultValue: '1',
    description:
      'How many slides fit in the viewport at once. Drives the item flex-basis via `calc((100% - gap*(N-1)) / N)` so spacing stays exact for any gap. Responsive object form is v2.',
  },
  {
    name: 'align',
    type: `'start' | 'center' | 'end'`,
    defaultValue: `'start'`,
    description:
      'Snap alignment within the viewport. Sets `scroll-snap-align` on every item via a CSS var, so changing it re-snaps without re-rendering.',
  },
  {
    name: 'gap',
    type: 'number | string',
    description:
      'Spacing between slides. Numbers become px; strings pass through (`"1rem"`, `"var(--space-3)"`). Sets `--carousel-gap` on the root.',
  },
  {
    name: 'dir',
    type: `'ltr' | 'rtl'`,
    defaultValue: `'ltr'`,
    description:
      'Reading direction. Flips visual flex order + Prev/Next button placement via logical CSS. Note: drag math is LTR-tuned in v1 — true RTL-flipped drag is v2.',
  },
  {
    name: 'duration',
    type: 'number',
    defaultValue: '500',
    description:
      'Smooth-scroll duration (ms) for Previous / Next / scrollTo / indicator clicks. Native snap-after-drag uses the browser default and is not affected.',
  },
  {
    name: 'draggable',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Enables pointer drag on the viewport. Set false for non-interactive showcases. Always disabled when `variant="fade"` (there is no scroll position to drag).',
  },
  {
    name: 'variant',
    type: `'slide' | 'fade'`,
    defaultValue: `'slide'`,
    description:
      '`slide` scrolls horizontally with CSS scroll-snap. `fade` stacks slides via CSS Grid and crossfades in place — Prev/Next/Indicators/Autoplay drive the index, scroll + drag are inert.',
  },
  {
    name: 'effect',
    type: `'none' | 'peek' | 'coverflow'`,
    defaultValue: `'none'`,
    description:
      'Layered visual treatment for the `slide` variant. `peek` is pure-CSS (active pops, neighbours fade + scale down). `coverflow` is iTunes-style 3D — driven per-frame by the engine so the rotation tracks the drag continuously. Pair `peek` with `slidesPerView` of 1–2 and `coverflow` with 3–5; both want `align="center"`.',
  },
  {
    name: 'autoplay',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Auto-advance on a timer. Pause sources: drag, focus, document.hidden (tab switch), and hover (when `pauseOnHover` is true). Pair with `loop` to keep advancing past the last slide.',
  },
  {
    name: 'autoplayDelay',
    type: 'number',
    defaultValue: '4000',
    description:
      'Time between auto-advances (ms). Clamped to a 500 ms minimum to keep the experience watchable.',
  },
  {
    name: 'pauseOnHover',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Pause autoplay while the pointer is over the carousel. Focus + drag + document visibility always pause regardless of this prop.',
  },
  {
    name: 'classes',
    type: '{ root?, viewport?, track?, item?, previous?, next?, indicators?, indicator?, progress? }',
    description:
      'Slot-level className overrides. Composes with the built-in classes — use for one-off chrome adjustments without editing the global tokens.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Appended to the root after the structural classes.',
  },
  {
    name: '...rest',
    type: 'HTMLAttributes<HTMLDivElement>',
    description:
      'Standard div attributes pass through. `aria-roledescription="carousel"` is set automatically — pass `aria-label` to give it a name.',
  },
]

const COMPOUND_PARTS: ReadonlyArray<{ name: string; desc: string }> = [
  {
    name: 'Carousel.Viewport',
    desc: 'The scrolling surface (`overflow-x-auto` + `scroll-snap-type: x mandatory`). Owns focus (tabIndex=0) so keyboard navigation has a target, and binds the pointer-drag handlers the root provides.',
  },
  {
    name: 'Carousel.Track',
    desc: 'Flex container that holds the items. Must contain exactly the slides — the root reads `track.children` to measure offsets, so any extra DOM nodes here will desync the index ↔ child mapping.',
  },
  {
    name: 'Carousel.Item',
    desc: 'A single slide. Lightweight — items don\'t register or know their index; the root reads position from `track.children`. Sets `role="group"` + `aria-roledescription="slide"`. Pass `aria-label` for positional labelling ("3 of 7").',
  },
  {
    name: 'Carousel.Previous',
    desc: 'Default circular button anchored to the viewport\'s left (right in RTL). Auto-disables at the first snap when `loop=false`. Override the icon by passing children, or replace placement via `classes.previous`.',
  },
  {
    name: 'Carousel.Next',
    desc: 'Mirror of Previous, anchored to the viewport\'s right (left in RTL). Auto-disables at the last snap when `loop=false`.',
  },
  {
    name: 'Carousel.Indicators',
    desc: 'Renders one `<Carousel.Indicator>` per snap by default (`itemCount - slidesPerView + 1`). Pass a render-prop child `{({ count, selected, goTo }) => …}` for full layout control (numbers, progress bars, thumbnails).',
  },
  {
    name: 'Carousel.Indicator',
    desc: 'A single indicator. Reads `selectedIndex` from context to derive its active state, calls `scrollTo(index)` on click. Use directly when building custom indicator layouts.',
  },
  {
    name: 'Carousel.Progress',
    desc: 'Linear progress bar — alternative to dot indicators for carousels with many slides. Fill width is `(selectedIndex + 1) / snapCount`, transitions are animated via `--carousel-duration` so the fill glides on autoplay ticks.',
  },
]

const KEYBOARD_KEYS: ReadonlyArray<{ keys: string; action: string }> = [
  { keys: 'Arrow ←', action: 'Previous snap (Next in RTL)' },
  { keys: 'Arrow →', action: 'Next snap (Previous in RTL)' },
  { keys: 'Home', action: 'Jump to first snap' },
  { keys: 'End', action: 'Jump to last snap' },
  { keys: 'Tab', action: 'Move focus into / out of the viewport' },
]

function PropsTable({ rows }: { rows: ReadonlyArray<PropRow> }) {
  return (
    <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
      <div className="hidden grid-cols-[200px_1fr_120px] gap-6 border-b border-stroke bg-surface-muted px-6 py-3 md:grid">
        <Text
          variant="body-xs"
          fontWeight="bold"
          color="secondary"
          className="tracking-wider uppercase"
        >
          Prop
        </Text>
        <Text
          variant="body-xs"
          fontWeight="bold"
          color="secondary"
          className="tracking-wider uppercase"
        >
          Type
        </Text>
        <Text
          variant="body-xs"
          fontWeight="bold"
          color="secondary"
          className="tracking-wider uppercase"
        >
          Default
        </Text>
      </div>
      {rows.map(({ name, type, defaultValue, description }) => (
        <div
          key={name}
          className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_120px] md:items-start md:gap-6"
        >
          <Text
            variant="body-sm"
            fontFamily="mono"
            fontWeight="semibold"
            color="primary"
          >
            {name}
          </Text>
          <div className="flex min-w-0 flex-col gap-1.5">
            <Text
              variant="body-xs"
              fontFamily="mono"
              color="secondary"
              className="wrap-break-word"
            >
              {type}
            </Text>
            <Text variant="body-sm" color="secondary">
              {description}
            </Text>
          </div>
          <Text
            variant="body-xs"
            fontFamily="mono"
            color={defaultValue ? 'inherit' : 'muted'}
          >
            {defaultValue ?? '—'}
          </Text>
        </div>
      ))}
    </div>
  )
}

// Placeholder photo via picsum.photos — the `seed` keeps each slide on
// the same image across reloads so the demo doesn't reshuffle on every
// hot reload, and so the gradient-overlaid label always sits above the
// expected scene.
//
// Sizing is via aspect-ratio rather than fixed pixel height so each
// slide scales fluidly with whatever width the carousel ends up at —
// full-viewport hero, 1/3-viewport product card, 1.4-slide peek, etc.
// We request a high-res image (1200×750) so the picture stays sharp
// when the carousel is wide on desktop.
function SlideTile({
  label,
  seed,
  aspect = 'aspect-[16/9]',
  className,
}: {
  label: string
  seed: string
  /** Tailwind aspect-ratio class. Default `aspect-[16/9]` (cinematic). */
  aspect?: string
  className?: string
}) {
  return (
    <div
      className={
        'relative overflow-hidden rounded-lg bg-surface-muted ' +
        aspect +
        ' ' +
        (className ?? '')
      }
    >
      <img
        src={`https://picsum.photos/seed/${seed}/1200/750`}
        alt={label}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 via-black/20 to-transparent px-3 py-2">
        <span className="text-sm font-semibold text-white drop-shadow">
          {label}
        </span>
      </div>
    </div>
  )
}

const HERO_SLIDES = [
  { label: 'Tropical escape', seed: 'tropical-escape' },
  { label: 'Mountain trail', seed: 'mountain-trail' },
  { label: 'Desert sunrise', seed: 'desert-sunrise' },
  { label: 'City lights', seed: 'city-lights' },
  { label: 'Ocean horizon', seed: 'ocean-horizon' },
]

const PRODUCT_SLIDES = Array.from({ length: 8 }, (_, i) => ({
  label: `Product ${i + 1}`,
  seed: `swift-product-${i + 1}`,
}))

export function CarouselPanel() {
  const [controlled, setControlled] = useState(0)
  // Responsive slidesPerView for the coverflow demo. Fewer slides on
  // narrow viewports so each slide stays large enough to read; at
  // very small widths the fade-cap also keeps the tilted side slides
  // from becoming a wall of tiny strips.
  const [coverflowSlidesPerView, setCoverflowSlidesPerView] = useState(5)
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 640) setCoverflowSlidesPerView(2.2)
      else if (w < 1024) setCoverflowSlidesPerView(3.4)
      else setCoverflowSlidesPerView(3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Carousel
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* ── Basic ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Basic · uncontrolled</SectionHeader>
        <PreviewRow
          code={`<Carousel aria-label="Featured destinations">
  <Carousel.Viewport>
    <Carousel.Track>
      {slides.map((s) => (
        <Carousel.Item key={s.label}>
          <Tile label={s.label} />
        </Carousel.Item>
      ))}
    </Carousel.Track>
  </Carousel.Viewport>
  <Carousel.Previous />
  <Carousel.Next />
  <Carousel.Indicators />
</Carousel>`}
        >
          <div className="w-full">
            <Carousel aria-label="Featured destinations">
              <Carousel.Viewport>
                <Carousel.Track>
                  {HERO_SLIDES.map((s) => (
                    <Carousel.Item key={s.label}>
                      <SlideTile label={s.label} seed={s.seed} />
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel.Viewport>
              <Carousel.Previous />
              <Carousel.Next />
              <Carousel.Indicators />
            </Carousel>
          </div>
        </PreviewRow>
      </section>

      {/* ── Controlled ───────────────────────────────────────── */}
      <section>
        <SectionHeader>Controlled · index + onIndexChange</SectionHeader>
        <PreviewRow
          code={`const [index, setIndex] = useState(0)

<Carousel
  index={index}
  onIndexChange={setIndex}
  aria-label="Controlled gallery"
>
  <Carousel.Viewport>
    <Carousel.Track>{…}</Carousel.Track>
  </Carousel.Viewport>
  <Carousel.Previous />
  <Carousel.Next />
  <Carousel.Indicators />
</Carousel>

<p>Showing slide {index + 1} of {HERO_SLIDES.length}</p>`}
        >
          <div className="flex w-full flex-col gap-3">
            <Carousel
              index={controlled}
              onIndexChange={setControlled}
              aria-label="Controlled gallery"
            >
              <Carousel.Viewport>
                <Carousel.Track>
                  {HERO_SLIDES.map((s) => (
                    <Carousel.Item key={s.label}>
                      <SlideTile label={s.label} seed={s.seed} />
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel.Viewport>
              <Carousel.Previous />
              <Carousel.Next />
              <Carousel.Indicators />
            </Carousel>
            <Text variant="body-sm" color="secondary" className="font-mono">
              Showing slide {controlled + 1} of {HERO_SLIDES.length}
            </Text>
          </div>
        </PreviewRow>
      </section>

      {/* ── slidesPerView + gap ──────────────────────────────── */}
      <section>
        <SectionHeader>
          slidesPerView · 3 visible at once, 16 px gap
        </SectionHeader>
        <PreviewRow
          code={`<Carousel slidesPerView={3} gap={16} aria-label="Product rail">
  <Carousel.Viewport>
    <Carousel.Track>
      {products.map((p) => (
        <Carousel.Item key={p.id}>
          <ProductCard product={p} />
        </Carousel.Item>
      ))}
    </Carousel.Track>
  </Carousel.Viewport>
  <Carousel.Previous />
  <Carousel.Next />
  <Carousel.Indicators />
</Carousel>`}
        >
          <div className="w-full">
            <Carousel slidesPerView={3} gap={16} aria-label="Product rail">
              <Carousel.Viewport>
                <Carousel.Track>
                  {PRODUCT_SLIDES.map((s) => (
                    <Carousel.Item key={s.label}>
                      <SlideTile
                        label={s.label}
                        seed={s.seed}
                        aspect="aspect-[4/5]"
                      />
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel.Viewport>
              <Carousel.Previous />
              <Carousel.Next />
              <Carousel.Indicators />
            </Carousel>
          </div>
        </PreviewRow>
      </section>

      {/* ── Center alignment ─────────────────────────────────── */}
      <section>
        <SectionHeader>
          Center align · current slide sits in the middle (hero feel)
        </SectionHeader>
        <PreviewRow
          code={`<Carousel slidesPerView={1.5} gap={24} align="center">
  <Carousel.Viewport>
    <Carousel.Track>{…}</Carousel.Track>
  </Carousel.Viewport>
  <Carousel.Indicators />
</Carousel>`}
        >
          <div className="w-full">
            <Carousel
              slidesPerView={1.5}
              gap={24}
              align="center"
              aria-label="Hero showcase"
            >
              <Carousel.Viewport>
                <Carousel.Track>
                  {HERO_SLIDES.map((s) => (
                    <Carousel.Item key={s.label}>
                      <SlideTile label={s.label} seed={s.seed} />
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel.Viewport>
              <Carousel.Indicators />
            </Carousel>
          </div>
        </PreviewRow>
      </section>

      {/* ── Loop ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>
          Loop · wrap-around · Prev/Next stay enabled at the extremes
        </SectionHeader>
        <PreviewRow
          code={`<Carousel loop aria-label="Looping carousel">
  <Carousel.Viewport>
    <Carousel.Track>{…}</Carousel.Track>
  </Carousel.Viewport>
  <Carousel.Previous />
  <Carousel.Next />
  <Carousel.Indicators />
</Carousel>`}
        >
          <div className="w-full">
            <Carousel loop aria-label="Looping carousel">
              <Carousel.Viewport>
                <Carousel.Track>
                  {HERO_SLIDES.map((s) => (
                    <Carousel.Item key={s.label}>
                      <SlideTile label={s.label} seed={s.seed} />
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel.Viewport>
              <Carousel.Previous />
              <Carousel.Next />
              <Carousel.Indicators />
            </Carousel>
          </div>
        </PreviewRow>
      </section>

      {/* ── Autoplay ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>
          Autoplay · auto-advance with pause on hover / focus / drag
        </SectionHeader>
        <PreviewRow
          code={`<Carousel
  autoplay
  autoplayDelay={3000}
  pauseOnHover
  loop
  aria-label="Featured destinations"
>
  <Carousel.Viewport>
    <Carousel.Track>{…}</Carousel.Track>
  </Carousel.Viewport>
  <Carousel.Previous />
  <Carousel.Next />
  <Carousel.Indicators />
</Carousel>`}
        >
          <div className="w-full">
            <Carousel
              autoplay
              autoplayDelay={3000}
              pauseOnHover
              loop
              aria-label="Autoplaying featured destinations"
            >
              <Carousel.Viewport>
                <Carousel.Track>
                  {HERO_SLIDES.map((s) => (
                    <Carousel.Item key={s.label}>
                      <SlideTile label={s.label} seed={s.seed} />
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel.Viewport>
              <Carousel.Previous />
              <Carousel.Next />
              <Carousel.Indicators />
            </Carousel>
            <Text
              variant="body-xs"
              color="muted"
              className="mt-2 italic"
            >
              Hover, focus, or drag to pause. Switching tabs also pauses (document visibility).
            </Text>
          </div>
        </PreviewRow>
      </section>

      {/* ── Fade variant ─────────────────────────────────────── */}
      <section>
        <SectionHeader>
          Fade variant · slides crossfade in place (no scroll, no drag)
        </SectionHeader>
        <PreviewRow
          code={`<Carousel
  variant="fade"
  autoplay
  autoplayDelay={3000}
  loop
  aria-label="Fading hero"
>
  <Carousel.Viewport>
    <Carousel.Track>{…}</Carousel.Track>
  </Carousel.Viewport>
  <Carousel.Previous />
  <Carousel.Next />
  <Carousel.Indicators />
</Carousel>`}
        >
          <div className="w-full">
            <Carousel
              variant="fade"
              autoplay
              autoplayDelay={3000}
              loop
              aria-label="Fading hero"
            >
              <Carousel.Viewport>
                <Carousel.Track>
                  {HERO_SLIDES.map((s) => (
                    <Carousel.Item key={s.label}>
                      <SlideTile label={s.label} seed={s.seed} />
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel.Viewport>
              <Carousel.Previous />
              <Carousel.Next />
              <Carousel.Indicators />
            </Carousel>
          </div>
        </PreviewRow>
      </section>

      {/* ── Peek effect ──────────────────────────────────────── */}
      <section>
        <SectionHeader>
          Peek effect · inactive slides scale + fade so the active one pops
        </SectionHeader>
        <PreviewRow
          code={`<Carousel
  effect="peek"
  align="center"
  slidesPerView={1.4}
  gap={24}
  loop
  aria-label="Peek hero"
>
  <Carousel.Viewport>
    <Carousel.Track>{…}</Carousel.Track>
  </Carousel.Viewport>
  <Carousel.Previous />
  <Carousel.Next />
  <Carousel.Indicators />
</Carousel>`}
        >
          <div className="w-full">
            <Carousel
              effect="peek"
              align="center"
              slidesPerView={1.4}
              gap={24}
              loop
              aria-label="Peek hero"
            >
              <Carousel.Viewport>
                <Carousel.Track>
                  {HERO_SLIDES.map((s) => (
                    <Carousel.Item key={s.label}>
                      <SlideTile label={s.label} seed={s.seed} />
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel.Viewport>
              <Carousel.Previous />
              <Carousel.Next />
              <Carousel.Indicators />
            </Carousel>
          </div>
        </PreviewRow>
      </section>

      {/* ── Coverflow effect ─────────────────────────────────── */}
      <section>
        <SectionHeader>
          Coverflow · iTunes-style 3D rotation, engine-driven per frame
        </SectionHeader>
        <PreviewRow
          code={`<Carousel
  effect="coverflow"
  align="center"
  slidesPerView={5}
  gap={0}
  loop
  aria-label="Coverflow gallery"
>
  <Carousel.Viewport>
    <Carousel.Track>{…}</Carousel.Track>
  </Carousel.Viewport>
  <Carousel.Previous />
  <Carousel.Next />
  <Carousel.Indicators />
</Carousel>`}
        >
          <div className="w-full">
            <Carousel
              effect="coverflow"
              align="center"
              slidesPerView={coverflowSlidesPerView}
              gap={0}
              loop
              aria-label="Coverflow gallery"
            >
              <Carousel.Viewport>
                <Carousel.Track>
                  {PRODUCT_SLIDES.map((s) => (
                    <Carousel.Item key={s.label}>
                      <SlideTile
                        label={s.label}
                        seed={s.seed}
                        aspect="aspect-square"
                      />
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel.Viewport>
              <Carousel.Previous />
              <Carousel.Next />
              <Carousel.Indicators />
            </Carousel>
            <Text
              variant="body-xs"
              color="muted"
              className="mt-2 italic"
            >
              Drag the gallery — the side slides rotate continuously as you
              pan, not just on snap. That continuous tracking is what
              separates a real coverflow from a CSS-only fake.
            </Text>
          </div>
        </PreviewRow>
      </section>

      {/* ── Progress bar indicator ───────────────────────────── */}
      <section>
        <SectionHeader>
          Progress bar · alternative to dot indicators for many slides
        </SectionHeader>
        <PreviewRow
          code={`<Carousel
  autoplay
  autoplayDelay={2500}
  loop
  slidesPerView={3}
  gap={16}
  aria-label="Product rail with progress"
>
  <Carousel.Viewport>
    <Carousel.Track>{…}</Carousel.Track>
  </Carousel.Viewport>
  <Carousel.Previous />
  <Carousel.Next />
  <Carousel.Progress />
</Carousel>`}
        >
          <div className="w-full">
            <Carousel
              autoplay
              autoplayDelay={2500}
              loop
              slidesPerView={3}
              gap={16}
              aria-label="Product rail with progress"
            >
              <Carousel.Viewport>
                <Carousel.Track>
                  {PRODUCT_SLIDES.map((s) => (
                    <Carousel.Item key={s.label}>
                      <SlideTile
                        label={s.label}
                        seed={s.seed}
                        aspect="aspect-[4/5]"
                      />
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel.Viewport>
              <Carousel.Previous />
              <Carousel.Next />
              <Carousel.Progress />
            </Carousel>
          </div>
        </PreviewRow>
      </section>

      {/* ── Custom indicators (render prop) ──────────────────── */}
      <section>
        <SectionHeader>
          Custom indicators · render-prop child for full layout control
        </SectionHeader>
        <PreviewRow
          code={`<Carousel.Indicators>
  {({ count, selected, goTo }) => (
    <span className="font-mono text-sm">
      {selected + 1} / {count}
    </span>
  )}
</Carousel.Indicators>`}
        >
          <div className="w-full">
            <Carousel aria-label="Numbered carousel">
              <Carousel.Viewport>
                <Carousel.Track>
                  {HERO_SLIDES.map((s) => (
                    <Carousel.Item key={s.label}>
                      <SlideTile label={s.label} seed={s.seed} />
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel.Viewport>
              <Carousel.Previous />
              <Carousel.Next />
              <Carousel.Indicators>
                {({ count, selected }) => (
                  <Text
                    variant="body-sm"
                    color="secondary"
                    className="font-mono tabular-nums"
                  >
                    {selected + 1} / {count}
                  </Text>
                )}
              </Carousel.Indicators>
            </Carousel>
          </div>
        </PreviewRow>
      </section>

      {/* ── Custom Prev/Next children ────────────────────────── */}
      <section>
        <SectionHeader>Custom Prev/Next · pass children to override the default icon</SectionHeader>
        <PreviewRow
          code={`<Carousel.Previous>Prev</Carousel.Previous>
<Carousel.Next>Next</Carousel.Next>`}
        >
          <div className="w-full">
            <Carousel
              aria-label="Carousel with text controls"
              classes={{
                previous:
                  'h-auto w-auto rounded-md px-3 py-1.5 text-xs font-semibold',
                next: 'h-auto w-auto rounded-md px-3 py-1.5 text-xs font-semibold',
              }}
            >
              <Carousel.Viewport>
                <Carousel.Track>
                  {HERO_SLIDES.map((s) => (
                    <Carousel.Item key={s.label}>
                      <SlideTile label={s.label} seed={s.seed} />
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel.Viewport>
              <Carousel.Previous>Prev</Carousel.Previous>
              <Carousel.Next>Next</Carousel.Next>
              <Carousel.Indicators />
            </Carousel>
          </div>
        </PreviewRow>
      </section>

      {/* ── RTL ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader>RTL · slides flow right-to-left; Prev/Next flip placement</SectionHeader>
        <PreviewRow
          code={`<Carousel dir="rtl" aria-label="RTL carousel">…</Carousel>`}
        >
          <div className="w-full">
            <Carousel dir="rtl" aria-label="RTL carousel">
              <Carousel.Viewport>
                <Carousel.Track>
                  {HERO_SLIDES.map((s) => (
                    <Carousel.Item key={s.label}>
                      <SlideTile label={s.label} seed={s.seed} />
                    </Carousel.Item>
                  ))}
                </Carousel.Track>
              </Carousel.Viewport>
              <Carousel.Previous />
              <Carousel.Next />
              <Carousel.Indicators />
            </Carousel>
          </div>
        </PreviewRow>
      </section>

      {/* ── Keyboard reference ───────────────────────────────── */}
      <section>
        <SectionHeader>Keyboard reference · viewport is the focus target</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          {KEYBOARD_KEYS.map(({ keys, action }) => (
            <div
              key={keys}
              className="grid grid-cols-[180px_1fr] items-center gap-6 border-b border-stroke-muted px-6 py-3 last:border-0"
            >
              <Text
                variant="body-sm"
                fontFamily="mono"
                fontWeight="semibold"
                color="primary"
              >
                {keys}
              </Text>
              <Text variant="body-sm" color="secondary">
                {action}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* ── Theme tokens ─────────────────────────────────────── */}
      <section>
        <SectionHeader>Theme tokens · overrideable per carousel or globally</SectionHeader>
        <CodeBlock
          code={`/* On the root, or per carousel via style={{ '--carousel-control-size': '32px' }} */
.swift-carousel {
  --carousel-gap:                    0px;     /* driven by \`gap\` prop */
  --carousel-slides-per-view:        1;       /* driven by \`slidesPerView\` */
  --carousel-slide-basis:            100%;    /* computed: (100% - gap*(N-1))/N */
  --carousel-duration:               500ms;   /* driven by \`duration\` prop */

  --carousel-control-size:           40px;
  --carousel-control-bg:             var(--color-surface);
  --carousel-control-color:          var(--color-content-strong);
  --carousel-control-border:         var(--color-stroke);

  --carousel-indicator-size:         8px;
  --carousel-indicator-bg:           var(--color-stroke-strong);
  --carousel-indicator-active-bg:    var(--color-surface-brand);

  --carousel-focus-ring:             color-mix(in srgb, var(--color-stroke-brand) 30%, transparent);
}`}
        />
      </section>

      {/* ── Compound parts ───────────────────────────────────── */}
      <section>
        <SectionHeader>Compound parts</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          {COMPOUND_PARTS.map(({ name, desc }) => (
            <div
              key={name}
              className="grid gap-1 border-b border-stroke-muted px-6 py-4 last:border-0 md:grid-cols-[200px_1fr] md:items-start md:gap-6"
            >
              <Text
                variant="body-sm"
                fontFamily="mono"
                fontWeight="semibold"
                color="primary"
              >
                {name}
              </Text>
              <Text variant="body-sm" color="secondary">
                {desc}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* ── Props ───────────────────────────────────────────── */}
      <section>
        <SectionHeader>Carousel · props</SectionHeader>
        <PropsTable rows={CAROUSEL_PROPS} />
      </section>

      {/* ── Accessibility ────────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">Root.</strong>{' '}
            Sets <code>aria-roledescription="carousel"</code>. Pass{' '}
            <code>aria-label</code> to name the carousel (e.g. "Featured
            destinations") — without one, screen readers will just announce
            "carousel".
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Slides.</strong>{' '}
            Each <code>Carousel.Item</code> sets{' '}
            <code>role="group"</code> +{' '}
            <code>aria-roledescription="slide"</code>. For positional
            labels ("Slide 3 of 7"), pass{' '}
            <code>aria-label</code> per item.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Buttons.</strong>{' '}
            <code>Carousel.Previous</code> and <code>Carousel.Next</code>{' '}
            default to <code>aria-label="Previous slide"</code> /{' '}
            <code>"Next slide"</code> and auto-disable at the extremes
            when <code>loop=false</code>.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Indicators.</strong>{' '}
            Each dot is a <code>button</code> with{' '}
            <code>aria-current="true"</code> on the active one and{' '}
            <code>aria-label="Go to slide N"</code>. The wrapper exposes{' '}
            <code>role="tablist"</code>.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Keyboard.</strong>{' '}
            The viewport is focusable (<code>tabIndex=0</code>) so Arrow
            keys / Home / End work once the user tabs into it. Buttons
            and indicators retain their native button keyboard support.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">SSR.</strong>{' '}
            No window reads or <code>getBoundingClientRect</code> during
            render — initial layout comes from CSS. All measurements
            happen in effects, hydration matches.
          </Text>
        </div>
      </section>

      {/* ── Browser compatibility ────────────────────────────── */}
      <section>
        <SectionHeader>Browser compatibility</SectionHeader>
        <BrowserCompat
          features={[
            {
              name: 'PointerEvents + setPointerCapture',
              notes: 'Unified mouse/touch/pen drag with capture so fast drags don\'t drop tracking when the cursor leaves the slide.',
              support: 'Chrome 55+ · Firefox 59+ · Safari 13+ · Edge 79+',
            },
            {
              name: 'transform: translate3d',
              notes: 'GPU-accelerated track translation. Animation runs on the compositor — no main-thread reflow per frame.',
              support: 'Universal (all modern browsers)',
            },
            {
              name: 'MutationObserver',
              notes: 'Watches the track\'s children to keep `itemCount` live when slides are added or removed at runtime.',
              support: 'Universal (all modern browsers)',
            },
            {
              name: 'ResizeObserver',
              notes: 'Re-pins the track to the alignment for the current selectedIndex when the viewport or content resizes.',
              support: 'Chrome 64+ · Firefox 69+ · Safari 13.1+ · Edge 79+',
            },
            {
              name: 'CSS perspective + transform-style: preserve-3d',
              notes: 'Required only for `effect="coverflow"`. Side slides rotate around Y against the viewport\'s perspective.',
              support: 'Universal (all modern browsers)',
            },
            {
              name: 'overscroll-behavior: contain',
              notes: 'Applied where this panel renders code blocks — prevents scroll-chain from the carousel viewport to the parent page.',
              support: 'Chrome 63+ · Firefox 59+ · Safari 16+ · Edge 18+',
            },
          ]}
          caveats={[
            <>
              <code>variant="fade"</code> uses CSS Grid stacking; widely supported but
              falls back to layout overlap on browsers that don\'t implement
              <code> grid-template-rows: 1fr</code> identically. v1 doesn\'t ship a polyfill.
            </>,
            <>
              RTL drag math is LTR-tuned in v1 — passing <code>dir="rtl"</code> flips
              visual ordering + Prev/Next placement, but a pointer drag still scrolls in
              the LTR-natural direction. True RTL-flipped drag is v2.
            </>,
            <>
              Coverflow per-slide transforms are written imperatively each rAF tick; on
              Safari &lt; 14 the compositor may briefly flatten a slide that crosses 90°.
              The <code>backface-visibility: hidden</code> rule covers the common case.
            </>,
          ]}
        />
      </section>

      {/* ── Import ───────────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Carousel } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { Carousel } from '@swift/components/Carousel'`}
          />
          <CopyableImport
            label="With types"
            code={`import { Carousel, type CarouselProps, type CarouselAlign } from '@swift/components'`}
          />
        </div>
      </section>

      {/* ── Usage ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`// Simple — uncontrolled, default shape
<Carousel aria-label="Featured">
  <Carousel.Viewport>
    <Carousel.Track>
      <Carousel.Item><img src="…" alt="…" /></Carousel.Item>
      <Carousel.Item><img src="…" alt="…" /></Carousel.Item>
      <Carousel.Item><img src="…" alt="…" /></Carousel.Item>
    </Carousel.Track>
  </Carousel.Viewport>
  <Carousel.Previous />
  <Carousel.Next />
  <Carousel.Indicators />
</Carousel>

// Controlled
const [i, setI] = useState(0)
<Carousel index={i} onIndexChange={setI}>…</Carousel>

// Multiple slides + spacing
<Carousel slidesPerView={3} gap={16}>…</Carousel>

// Loop + center align (hero feel)
<Carousel loop align="center" slidesPerView={1.5} gap={24}>…</Carousel>

// Custom indicators
<Carousel.Indicators>
  {({ count, selected, goTo }) => (
    <>
      {Array.from({ length: count }, (_, idx) => (
        <button key={idx} onClick={() => goTo(idx)}>
          {idx === selected ? '●' : '○'}
        </button>
      ))}
    </>
  )}
</Carousel.Indicators>`}
        />
      </section>
    </div>
  )
}
