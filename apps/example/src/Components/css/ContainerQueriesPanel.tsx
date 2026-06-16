import { useState, type CSSProperties } from 'react'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive container-queries lesson. The card restyles itself based on
 * the width of its CONTAINER (not the viewport) via real `@container`
 * rules injected below — drag the width slider and watch the same card
 * adapt without a single media query.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

/* Scoped to unique class / container names so the rules can't leak. */
const CONTAINER_CSS = `
.swiftcq { container-type: inline-size; container-name: swiftcard; }
.swiftcq-card {
  display: flex; flex-direction: column; gap: 12px;
  padding: 14px; border-radius: 12px;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-stroke);
}
.swiftcq-thumb {
  width: 100%; height: 84px; border-radius: 8px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--color-brand-300), var(--color-brand-500));
}
.swiftcq-title { font-weight: 700; color: var(--color-content-strong); }
.swiftcq-meta { color: var(--color-content-secondary); font-size: 13px; }
.swiftcq-badge {
  display: none; align-self: flex-start; margin-top: 4px;
  padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700;
  background: var(--color-surface-success-muted); color: var(--color-content-success);
}
@container swiftcard (min-width: 340px) {
  .swiftcq-card { flex-direction: row; align-items: center; }
  .swiftcq-thumb { width: 120px; height: 84px; }
}
@container swiftcard (min-width: 460px) {
  .swiftcq-thumb { width: 168px; height: 100px; }
  .swiftcq-title { font-size: 18px; }
  .swiftcq-badge { display: inline-block; }
}
`

function activeBreakpoint(w: number): string {
  if (w >= 460) return '≥ 460px · wide (row + larger thumb + badge)'
  if (w >= 340) return '≥ 340px · medium (row layout)'
  return '< 340px · narrow (stacked)'
}

export function ContainerQueriesPanel() {
  const [width, setWidth] = useState(300)

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <style>{CONTAINER_CSS}</style>

      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Container queries
        </Text>
        <Text variant="para-lg" color="secondary">
          Container queries style an element by the size of its container instead of the whole
          viewport — so a component adapts wherever it&rsquo;s placed: full-width, in a sidebar,
          in a grid cell. Mark an ancestor as a query container with <code>container-type</code>,
          then write <code>@container</code> rules. Drag the width and watch the card relayout.
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-72 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div style={{ width, maxWidth: '100%' }}>
              {/* The query container. */}
              <div className="swiftcq">
                <div className="swiftcq-card">
                  <div className="swiftcq-thumb" />
                  <div className="swiftcq-body">
                    <span className="swiftcq-title">Delhi → Goa</span>
                    <span className="swiftcq-meta">Sat, 14 Jun · Non-stop · 2h 30m</span>
                    <span className="swiftcq-badge">Best value</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-center">
                <Text variant="body-xs" fontFamily="mono" color="muted">
                  container: {width}px
                </Text>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
              container width
            </Text>
            <div className="grid gap-1.5">
              <div className="flex items-baseline justify-between">
                <Text variant="body-xs" fontFamily="mono" color="secondary">
                  width
                </Text>
                <Text variant="body-xs" fontFamily="mono" color="primary">
                  {width}px
                </Text>
              </div>
              <Slider value={[width]} min={220} max={540} step={4} onValueChange={([v]) => setWidth(v)} aria-label="container width" />
            </div>
            <div className="rounded-lg bg-surface-muted px-3 py-2">
              <Text variant="body-xs" fontFamily="mono" color="secondary">
                active: <span className="font-semibold text-content-brand">{activeBreakpoint(width)}</span>
              </Text>
            </div>
            <Text variant="body-xs" color="muted">
              The card never reads the page width — only its own container&rsquo;s. Resize the
              browser and it won&rsquo;t change; resize the container and it does.
            </Text>
          </div>

          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock
              code={`.wrapper { container-type: inline-size; container-name: card; }

.card { display: flex; flex-direction: column; }

@container card (min-width: 340px) {
  .card { flex-direction: row; }
}
@container card (min-width: 460px) {
  .card .badge { display: inline-block; }
}`}
            />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>Container vs media queries</SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['@media (min-width: …)', 'Responds to the viewport. One source of truth for the whole page — but a component can’t know how much room it actually got.'],
            ['@container (min-width: …)', 'Responds to the nearest query container. The same component lays out correctly in a sidebar, a card, or full-bleed — truly reusable.'],
          ].map(([t, b]) => (
            <div key={t} className="flex flex-col gap-1 rounded-xl border border-stroke bg-surface-elevated p-5">
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {t}
              </Text>
              <Text variant="body-xs" color="secondary">
                {b}
              </Text>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Container query units resolve against the container too: <code>cqw</code> (1% of its
          width), <code>cqh</code>, <code>cqi</code> / <code>cqb</code> (inline / block).
        </Text>
      </section>
    </div>
  )
}
