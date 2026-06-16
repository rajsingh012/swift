import { useMemo, useRef, useState, type CSSProperties } from 'react'
import { Text } from '@swift/components/Text'
import { ChevronLeft } from '@swift/icons/ChevronLeft'
import { ChevronRight } from '@swift/icons/ChevronRight'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive scroll-snap lesson. The slides live in a real
 * overflow-x scroller; the snap-type and per-slide snap-align are applied
 * for real, so flicking the track snaps exactly as the browser does.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const TYPES = ['none', 'x mandatory', 'x proximity'] as const
type SnapType = (typeof TYPES)[number]
const ALIGNS = ['start', 'center', 'end'] as const
type Align = (typeof ALIGNS)[number]

const HUES = [210, 150, 30, 280, 0, 180]

function Pills<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: ReadonlyArray<T>
  onChange: (v: T) => void
}) {
  return (
    <div className="grid gap-1.5">
      <Text variant="body-xs" fontFamily="mono" color="secondary">
        {label}
      </Text>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`cursor-pointer rounded-md px-2 py-1 font-mono text-xs transition-colors ${
              o === value
                ? 'bg-surface-brand-muted font-semibold text-content-brand'
                : 'bg-surface-muted text-content-secondary hover:bg-surface-subtle'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ScrollSnapPanel() {
  const [type, setType] = useState<SnapType>('x mandatory')
  const [align, setAlign] = useState<Align>('center')
  const scroller = useRef<HTMLDivElement>(null)

  // Programmatic scroll so the snap is observable on any device — a
  // horizontal track is awkward to move with a mouse wheel. The browser
  // still snaps to the nearest point after the smooth scroll settles.
  const nudge = (dir: 1 | -1) => {
    const el = scroller.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.62, behavior: 'smooth' })
  }

  const css = useMemo(
    () =>
      `.scroller {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: ${type};
}
.slide {
  flex: 0 0 60%;
  scroll-snap-align: ${align};
}`,
    [type, align],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Scroll snap
        </Text>
        <Text variant="para-lg" color="secondary">
          Scroll snapping makes a scroll container settle on defined points — the backbone of
          carousels and paged galleries with zero JavaScript. The container declares{' '}
          <code>scroll-snap-type</code>; each child declares where it snaps with{' '}
          <code>scroll-snap-align</code>. Scroll the track below — or use the arrows.
        </Text>
      </header>

      <section>
        <SectionHeader>Playground · scroll the track or use the arrows</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-64 flex-col justify-center gap-3 bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              ref={scroller}
              style={{
                display: 'flex',
                gap: 16,
                overflowX: 'auto',
                scrollSnapType: type === 'none' ? 'none' : type,
                padding: 8,
                width: '100%',
                borderRadius: 10,
                border: '1px dashed var(--color-stroke-strong)',
                background: 'var(--color-surface)',
                scrollPadding: 8,
              }}
            >
              {HUES.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: '0 0 60%',
                    height: 120,
                    scrollSnapAlign: align,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `hsl(${h} 70% 88%)`,
                    border: `1px solid hsl(${h} 60% 60%)`,
                    color: `hsl(${h} 50% 30%)`,
                    fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                    fontWeight: 700,
                  }}
                >
                  slide {i + 1}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => nudge(-1)}
                aria-label="Scroll left"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-stroke bg-surface text-content shadow-level1 transition-colors hover:bg-surface-muted"
              >
                <ChevronLeft size={18} />
              </button>
              <Text variant="body-xs" color="muted">
                {type === 'none' ? 'free scroll' : `snapping · ${align}`}
              </Text>
              <button
                type="button"
                onClick={() => nudge(1)}
                aria-label="Scroll right"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-stroke bg-surface text-content shadow-level1 transition-colors hover:bg-surface-muted"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <Pills label="scroll-snap-type" value={type} options={TYPES} onChange={setType} />
            <Pills label="scroll-snap-align" value={align} options={ALIGNS} onChange={setAlign} />
            <Text variant="body-xs" color="secondary">
              {type === 'none'
                ? 'No snapping — the track scrolls freely.'
                : type.includes('mandatory')
                  ? 'mandatory always rests on a snap point — you can’t stop between slides.'
                  : 'proximity only snaps when you release near a point — gentler.'}
            </Text>
            <Text variant="body-xs" color="muted">
              <code>scroll-snap-align</code> picks which edge of each slide lines up:{' '}
              <code>start</code>, <code>center</code>, or <code>end</code>.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Pair with <code>scroll-padding</code> (offset the snap line, e.g. under a sticky
          header) and <code>scroll-snap-stop: always</code> (force one slide per swipe).
        </Text>
      </section>
    </div>
  )
}
