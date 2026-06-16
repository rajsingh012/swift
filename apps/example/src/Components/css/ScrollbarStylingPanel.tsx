import { useMemo, useState, type CSSProperties } from 'react'
import { SegmentedControl } from '@swift/components/SegmentedControl'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive scrollbar-styling lesson. The standard `scrollbar-width` and
 * `scrollbar-color` properties are applied for real to the scroll box, so
 * the thumb/track recolour and thin/none modes render live (modern
 * Chrome / Firefox / Edge).
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const WIDTHS = ['auto', 'thin', 'none'] as const
type Width = (typeof WIDTHS)[number]

export function ScrollbarStylingPanel() {
  const [width, setWidth] = useState<Width>('thin')
  const [thumb, setThumb] = useState('#5b8def')
  const [track, setTrack] = useState('#e6ebf5')
  const colored = width !== 'none'

  const css = useMemo(
    () =>
      `.box {
  overflow: auto;
  scrollbar-width: ${width};${colored ? `\n  scrollbar-color: ${thumb} ${track};` : ''}
}

/* WebKit fallback (Safari / older Chrome) */
.box::-webkit-scrollbar { width: 10px; }
.box::-webkit-scrollbar-track { background: ${track}; }
.box::-webkit-scrollbar-thumb {
  background: ${thumb}; border-radius: 6px;
}`,
    [width, thumb, track, colored],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Scrollbar styling
        </Text>
        <Text variant="para-lg" color="secondary">
          The standard properties <code>scrollbar-width</code> (<code>auto</code> /{' '}
          <code>thin</code> / <code>none</code>) and <code>scrollbar-color</code> (thumb then
          track) restyle a scroll container&rsquo;s bar. For deeper control on WebKit, the
          <code> ::-webkit-scrollbar</code> pseudo-elements still apply.
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-72 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{
                width: 280,
                height: 200,
                overflow: 'auto',
                scrollbarWidth: width,
                scrollbarColor: colored ? `${thumb} ${track}` : undefined,
                borderRadius: 10,
                border: '1px solid var(--color-stroke-strong)',
                background: 'var(--color-surface)',
                padding: 14,
              }}
            >
              <div className="flex flex-col gap-3">
                {Array.from({ length: 14 }, (_, i) => (
                  <div
                    key={i}
                    className="rounded-md border border-stroke-muted bg-surface-muted px-3 py-2 text-sm text-content-secondary"
                  >
                    Row {i + 1} — scroll to see the bar
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="grid gap-1.5">
              <Text variant="body-xs" fontFamily="mono" color="secondary">
                scrollbar-width
              </Text>
              <SegmentedControl size="sm" fullWidth value={width} onValueChange={(v) => setWidth(v as Width)} aria-label="scrollbar-width">
                <SegmentedControl.Indicator />
                {WIDTHS.map((w) => (
                  <SegmentedControl.Item key={w} value={w}>{w}</SegmentedControl.Item>
                ))}
              </SegmentedControl>
            </div>
            <div className="flex items-center gap-4">
              {[
                { label: 'thumb', value: thumb, set: setThumb },
                { label: 'track', value: track, set: setTrack },
              ].map(({ label, value, set }) => (
                <label key={label} className={`flex items-center gap-2 ${colored ? '' : 'opacity-50'}`}>
                  <input
                    type="color"
                    value={value}
                    disabled={!colored}
                    onChange={(e) => set(e.target.value)}
                    className="size-8 cursor-pointer rounded-md border border-stroke bg-surface disabled:cursor-not-allowed"
                    aria-label={`${label} color`}
                  />
                  <Text variant="body-xs" fontFamily="mono" color="secondary">{label}</Text>
                </label>
              ))}
            </div>
            <Text variant="body-xs" color="muted">
              <code>none</code> hides the bar entirely (content still scrolls) — use sparingly, a
              hidden scrollbar can hurt discoverability.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Reserve space for the bar with <code>scrollbar-gutter: stable</code> so content
          doesn&rsquo;t shift when a scrollbar appears.
        </Text>
      </section>
    </div>
  )
}
