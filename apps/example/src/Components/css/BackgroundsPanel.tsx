import { useMemo, useState, type CSSProperties } from 'react'
import { SegmentedControl } from '@swift/components/SegmentedControl'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive backgrounds lesson. A self-contained SVG tile is painted as
 * a real background; the repeat / size / position controls all write
 * actual `background-*` values, so tiling and placement render live.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

// A 40×40 dot tile, inline so the panel needs no network image.
const TILE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23eef2ff'/%3E%3Ccircle cx='20' cy='20' r='8' fill='%235b8def'/%3E%3C/svg%3E\")"

const REPEATS = ['repeat', 'no-repeat', 'repeat-x', 'repeat-y'] as const
type Repeat = (typeof REPEATS)[number]

const SIZES = ['auto', '80px', 'cover', 'contain'] as const
type Size = (typeof SIZES)[number]

const POSITIONS = [
  'left top', 'center top', 'right top',
  'left center', 'center', 'right center',
  'left bottom', 'center bottom', 'right bottom',
] as const
type Position = (typeof POSITIONS)[number]

export function BackgroundsPanel() {
  const [repeat, setRepeat] = useState<Repeat>('repeat')
  const [size, setSize] = useState<Size>('auto')
  const [position, setPosition] = useState<Position>('left top')

  const css = useMemo(
    () =>
      `.box {
  background-image: url("dots.svg");
  background-repeat: ${repeat};
  background-size: ${size};
  background-position: ${position};
}`,
    [repeat, size, position],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Backgrounds
        </Text>
        <Text variant="para-lg" color="secondary">
          A background image is painted behind an element&rsquo;s content. <code>background-repeat</code>{' '}
          controls tiling, <code>background-size</code> scales it (<code>cover</code> /{' '}
          <code>contain</code> or an explicit size), and <code>background-position</code> anchors
          it. Multiple layers stack, comma-separated, front to back.
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-72 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{
                width: '100%',
                maxWidth: 360,
                height: 200,
                borderRadius: 12,
                border: '1px solid var(--color-stroke-strong)',
                backgroundColor: 'var(--color-surface)',
                backgroundImage: TILE,
                backgroundRepeat: repeat,
                backgroundSize: size,
                backgroundPosition: position,
              }}
            />
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="grid gap-1.5">
              <Text variant="body-xs" fontFamily="mono" color="secondary">background-repeat</Text>
              <div className="grid grid-cols-2 gap-1.5">
                {REPEATS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRepeat(r)}
                    className={`cursor-pointer rounded-md px-2 py-1.5 font-mono text-xs transition-colors ${
                      r === repeat ? 'bg-surface-brand-muted font-semibold text-content-brand' : 'bg-surface-muted text-content-secondary hover:bg-surface-subtle'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-1.5">
              <Text variant="body-xs" fontFamily="mono" color="secondary">background-size</Text>
              <SegmentedControl size="sm" fullWidth value={size} onValueChange={(v) => setSize(v as Size)} aria-label="background-size">
                <SegmentedControl.Indicator />
                {SIZES.map((s) => (
                  <SegmentedControl.Item key={s} value={s}>{s}</SegmentedControl.Item>
                ))}
              </SegmentedControl>
            </div>
            <label className="grid gap-1.5">
              <Text variant="body-xs" fontFamily="mono" color="secondary">background-position</Text>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
                className="h-8 w-full cursor-pointer rounded-md border border-stroke bg-surface px-2 text-sm text-content-strong outline-none transition-colors focus:border-stroke-brand focus:ring-2 focus:ring-stroke-brand/20"
              >
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
            <Text variant="body-xs" color="muted">
              <code>cover</code> / <code>contain</code> ignore repeat (one scaled copy);{' '}
              <code>auto</code> / a fixed size tile when repeat is on.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>Layering backgrounds</SectionHeader>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <CodeBlock
            code={`.hero {
  background:
    linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), /* tint on top */
    url("photo.jpg") center / cover;                    /* image below */
}`}
          />
          <div
            style={{
              width: 180,
              height: 110,
              borderRadius: 12,
              backgroundImage: `linear-gradient(135deg, rgba(91,141,239,.55), rgba(34,197,94,.55)), ${TILE}`,
              backgroundSize: 'cover, 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              textShadow: '0 1px 4px rgba(0,0,0,.4)',
            }}
          >
            tint + tile
          </div>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Earlier layers paint <em>in front</em>. A semi-transparent gradient over a photo is the
          classic readable-hero pattern.
        </Text>
      </section>
    </div>
  )
}
