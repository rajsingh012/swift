import { useMemo, useState, type CSSProperties } from 'react'
import { Slider } from '@swift/components/Slider'
import { Switch } from '@swift/components/Switch'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive multi-column lesson. The text flows into a real multi-column
 * container, so column-count, column-gap, the column-rule, and a spanning
 * heading all render exactly as the fragmenter lays them out.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const BODY =
  'Multi-column layout flows a single run of content into newspaper-style columns. The browser balances the text across the tracks automatically, so you describe how many columns you want — not where each line breaks. It is ideal for long-form prose, glossaries, and tag lists where the order still reads top-to-bottom, then across.'

export function MultiColumnPanel() {
  const [count, setCount] = useState(2)
  const [gap, setGap] = useState(24)
  const [rule, setRule] = useState(true)
  const [span, setSpan] = useState(true)

  const css = useMemo(
    () =>
      `.prose {
  column-count: ${count};
  column-gap: ${gap}px;${rule ? '\n  column-rule: 1px solid #d4d4d8;' : ''}
}
.prose h3 {
  column-span: ${span ? 'all' : 'none'};
}`,
    [count, gap, rule, span],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Multi-column
        </Text>
        <Text variant="para-lg" color="secondary">
          The multi-column module flows one block of content into several columns and balances it
          for you. Set <code>column-count</code> (or <code>column-width</code> for a responsive
          count), space them with <code>column-gap</code>, divide them with{' '}
          <code>column-rule</code>, and let a heading break out with <code>column-span: all</code>.
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="overflow-auto bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{
                columnCount: count,
                columnGap: gap,
                columnRule: rule ? '1px solid var(--color-stroke)' : undefined,
                padding: 16,
                borderRadius: 10,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-stroke)',
              }}
            >
              <h3
                style={{
                  columnSpan: span ? 'all' : 'none',
                  margin: '0 0 8px',
                  fontWeight: 700,
                  color: 'var(--color-content-strong)',
                }}
              >
                Spanning heading
              </h3>
              <Text variant="body-sm" color="secondary">
                {BODY} {BODY}
              </Text>
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="grid gap-1.5">
              <div className="flex items-baseline justify-between">
                <Text variant="body-xs" fontFamily="mono" color="secondary">column-count</Text>
                <Text variant="body-xs" fontFamily="mono" color="primary">{count}</Text>
              </div>
              <Slider value={[count]} min={1} max={4} step={1} onValueChange={([v]) => setCount(v)} aria-label="column-count" />
            </div>
            <div className="grid gap-1.5">
              <div className="flex items-baseline justify-between">
                <Text variant="body-xs" fontFamily="mono" color="secondary">column-gap</Text>
                <Text variant="body-xs" fontFamily="mono" color="primary">{gap}px</Text>
              </div>
              <Slider value={[gap]} min={0} max={56} step={4} onValueChange={([v]) => setGap(v)} aria-label="column-gap" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Text variant="body-xs" fontFamily="mono" color="secondary">column-rule</Text>
              <Switch size="sm" checked={rule} onCheckedChange={setRule} aria-label="column-rule" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Text variant="body-xs" fontFamily="mono" color="secondary">heading column-span: all</Text>
              <Switch size="sm" checked={span} onCheckedChange={setSpan} aria-label="column-span" />
            </div>
            <Text variant="body-xs" color="muted">
              Prefer <code>column-width</code> when you want the count to adapt to the available
              space — the browser fits as many columns of that width as it can.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>Columns vs grid / flex</SectionHeader>
        <Text variant="body-sm" color="secondary">
          Reach for multi-column when the content is a single continuous flow that should read
          down-then-across (prose, long lists). Use Grid or Flexbox when each item is a distinct
          box you place deliberately — columns can&rsquo;t target an individual child.
        </Text>
      </section>
    </div>
  )
}
