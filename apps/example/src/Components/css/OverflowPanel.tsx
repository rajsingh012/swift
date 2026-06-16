import { useMemo, useState, type CSSProperties } from 'react'
import { SegmentedControl } from '@swift/components/SegmentedControl'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive CSS overflow lesson. The stage box is a fixed size with
 * content larger than it; the chosen `overflow` value is applied for
 * real, so clipping and scrollbars behave exactly as the browser renders
 * them.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

type Overflow = 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip'
const OVERFLOWS: ReadonlyArray<Overflow> = ['visible', 'hidden', 'scroll', 'auto', 'clip']

const NOTES: Record<Overflow, string> = {
  visible: 'Default. Content spills outside the box and stays visible — it can overlap neighbours.',
  hidden: 'Overflowing content is clipped. Still scrollable programmatically (scrollTop / scrollIntoView).',
  scroll: 'Always shows scrollbars, even when content fits — layout never shifts when content grows.',
  auto: 'Scrollbars appear only when needed. The everyday choice for scroll containers.',
  clip: 'Like hidden but forbids all scrolling — and clips at the padding edge. Cheapest clip.',
}

const REFERENCE: ReadonlyArray<{ prop: string; note: string }> = [
  { prop: 'overflow', note: 'Shorthand for both axes.' },
  { prop: 'overflow-x / overflow-y', note: 'Control each axis independently (e.g. scroll x, hidden y).' },
  { prop: 'overscroll-behavior', note: 'Stop scroll chaining to the page — `contain` keeps it local.' },
  { prop: 'text-overflow: ellipsis', note: 'Adds … to clipped single-line text (needs overflow + nowrap).' },
  { prop: 'scrollbar-gutter', note: 'Reserve room for the scrollbar so content never reflows.' },
]

const DESCRIPTION =
  'When content is larger than its box, `overflow` decides what happens: let it spill (`visible`), clip it (`hidden` / `clip`), or make the box scroll (`scroll` / `auto`). Note that any value other than `visible` also establishes a Block Formatting Context.'

export function OverflowPanel() {
  const [overflow, setOverflow] = useState<Overflow>('auto')

  const css = useMemo(
    () =>
      `.box {
  width: 240px;
  height: 150px;
  overflow: ${overflow};
}`,
    [overflow],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Overflow
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          {/* Stage */}
          <div className="flex min-h-72 items-center justify-center overflow-hidden bg-surface-muted p-10" style={STAGE_STYLE}>
            <div
              style={{
                width: 240,
                height: 150,
                overflow,
                border: '2px solid var(--color-stroke-strong)',
                borderRadius: 8,
                background: 'var(--color-surface)',
                padding: 12,
              }}
            >
              <div
                style={{
                  width: 360,
                  background: 'var(--color-brand-100)',
                  border: '1px solid var(--color-brand-300)',
                  borderRadius: 6,
                  padding: 10,
                }}
              >
                <Text variant="body-sm" color="secondary">
                  This content is deliberately wider and taller than its 240×150 box. With{' '}
                  <code>visible</code> it spills past the border; with <code>hidden</code> or{' '}
                  <code>clip</code> it&rsquo;s cut off; with <code>scroll</code> / <code>auto</code>{' '}
                  you get scrollbars. Try scrolling this box. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit sed do eiusmod tempor.
                </Text>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
              overflow
            </Text>
            <div className="grid grid-cols-2 gap-1.5">
              {OVERFLOWS.map((o) => {
                const isActive = o === overflow
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setOverflow(o)}
                    className={`cursor-pointer rounded-md px-2 py-1.5 font-mono text-xs transition-colors ${
                      isActive
                        ? 'bg-surface-brand-muted font-semibold text-content-brand'
                        : 'bg-surface-muted text-content-secondary hover:bg-surface-subtle'
                    }`}
                  >
                    {o}
                  </button>
                )
              })}
            </div>
            <Text variant="body-xs" color="secondary">
              {NOTES[overflow]}
            </Text>
          </div>

          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
      </section>

      {/* ── Text ellipsis ───────────────────────────────────────────── */}
      <section>
        <SectionHeader>Truncating text · text-overflow: ellipsis</SectionHeader>
        <EllipsisDemo />
      </section>

      {/* ── Reference ───────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Related properties</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {REFERENCE.map(({ prop, note }) => (
            <div
              key={prop}
              className="grid gap-1 border-b border-stroke-muted px-5 py-3 last:border-0 md:grid-cols-[240px_1fr] md:items-center md:gap-4"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {prop}
              </Text>
              <Text variant="body-sm" color="secondary">
                {note}
              </Text>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function EllipsisDemo() {
  const [lines, setLines] = useState<'single' | 'clamp'>('single')
  const text =
    'Window seat on the 06:20 Delhi to Goa non-stop — refundable fare with free cabin baggage and priority boarding included.'
  const code =
    lines === 'single'
      ? `.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`
      : `.clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}`
  return (
    <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_240px]">
      <div className="flex items-center bg-surface-muted p-8" style={STAGE_STYLE}>
        <div
          style={{ width: 260 }}
          className="rounded-lg border border-stroke bg-surface p-3"
        >
          {lines === 'single' ? (
            <p className="overflow-hidden text-sm text-content text-ellipsis whitespace-nowrap">
              {text}
            </p>
          ) : (
            <p
              className="overflow-hidden text-sm text-content"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {text}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
        <SegmentedControl
          size="sm"
          fullWidth
          value={lines}
          onValueChange={(v) => setLines(v as 'single' | 'clamp')}
          aria-label="truncation mode"
        >
          <SegmentedControl.Indicator />
          <SegmentedControl.Item value="single">1 line</SegmentedControl.Item>
          <SegmentedControl.Item value="clamp">2 lines</SegmentedControl.Item>
        </SegmentedControl>
        <CodeBlock code={code} />
        <Text variant="body-xs" color="secondary">
          Single-line ellipsis needs <code>nowrap</code> + <code>overflow: hidden</code>.
          Multi-line uses the <code>-webkit-line-clamp</code> trick.
        </Text>
      </div>
    </div>
  )
}
