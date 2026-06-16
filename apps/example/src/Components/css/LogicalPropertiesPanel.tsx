import { useState, type CSSProperties } from 'react'
import { SegmentedControl } from '@swift/components/SegmentedControl'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive logical-properties lesson. Two boxes — one styled with
 * physical sides (margin-left…), one with logical sides
 * (margin-inline-start…) — sit in a real `dir` container. Flip the
 * direction and watch only the logical box follow the writing direction.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const MAP: ReadonlyArray<{ physical: string; logical: string }> = [
  { physical: 'margin-left / -right', logical: 'margin-inline-start / -end' },
  { physical: 'padding-top / -bottom', logical: 'padding-block-start / -end' },
  { physical: 'left / right', logical: 'inset-inline-start / -end' },
  { physical: 'top / bottom', logical: 'inset-block-start / -end' },
  { physical: 'width / height', logical: 'inline-size / block-size' },
  { physical: 'border-left', logical: 'border-inline-start' },
  { physical: 'text-align: left', logical: 'text-align: start' },
]

export function LogicalPropertiesPanel() {
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr')

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Logical properties
        </Text>
        <Text variant="para-lg" color="secondary">
          Logical properties describe space by writing direction — <em>inline</em> (the text
          axis) and <em>block</em> (the stacking axis) with <em>start</em> / <em>end</em> edges —
          instead of fixed <em>left</em> / <em>right</em>. They automatically flip for RTL
          languages and vertical writing modes, so one rule works everywhere.
        </Text>
      </header>

      <section>
        <SectionHeader>Physical vs logical · flip the direction</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_260px]">
          <div className="bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              dir={dir}
              className="flex flex-col gap-4 rounded-lg border border-dashed border-stroke bg-surface p-4"
            >
              <Text variant="body-xs" color="muted" className="block">
                container · dir=&ldquo;{dir}&rdquo;
              </Text>
              {/* Logical: follows the writing direction. */}
              <div
                style={{
                  marginInlineStart: 32,
                  paddingInlineStart: 12,
                  borderInlineStart: '4px solid var(--color-brand-500)',
                  background: 'var(--color-brand-100)',
                  borderRadius: 6,
                  paddingBlock: 10,
                  textAlign: 'start',
                }}
              >
                <Text variant="body-sm" fontFamily="mono" color="primary">
                  logical · margin-inline-start
                </Text>
              </div>
              {/* Physical: pinned to the left regardless of direction. */}
              <div
                style={{
                  marginLeft: 32,
                  paddingLeft: 12,
                  borderLeft: '4px solid var(--color-content-muted)',
                  background: 'var(--color-surface-muted)',
                  borderRadius: 6,
                  paddingBlock: 10,
                  textAlign: 'left',
                }}
              >
                <Text variant="body-sm" fontFamily="mono" color="secondary">
                  physical · margin-left
                </Text>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
              direction
            </Text>
            <SegmentedControl size="sm" fullWidth value={dir} onValueChange={(v) => setDir(v as 'ltr' | 'rtl')} aria-label="direction">
              <SegmentedControl.Indicator />
              <SegmentedControl.Item value="ltr">ltr</SegmentedControl.Item>
              <SegmentedControl.Item value="rtl">rtl</SegmentedControl.Item>
            </SegmentedControl>
            <Text variant="body-xs" color="secondary">
              In <code>rtl</code> the <strong className="text-content-strong">logical</strong> box
              moves its indent and accent to the right — following the text. The{' '}
              <strong className="text-content-strong">physical</strong> box stays glued to the
              left.
            </Text>
            <Text variant="body-xs" color="muted">
              Same code, both directions — that&rsquo;s why design systems author in logical
              properties.
            </Text>
          </div>

          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock
              code={`/* adapts to ltr / rtl automatically */
.note {
  margin-inline-start: 32px;
  padding-inline-start: 12px;
  border-inline-start: 4px solid;
  text-align: start;
}`}
            />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>Physical → logical reference</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          <div className="grid min-w-[480px] grid-cols-2 gap-4 border-b border-stroke bg-surface-muted px-5 py-3">
            {['Physical', 'Logical'].map((h) => (
              <Text key={h} variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">
                {h}
              </Text>
            ))}
          </div>
          {MAP.map(({ physical, logical }) => (
            <div key={physical} className="grid min-w-[480px] grid-cols-2 gap-4 border-b border-stroke-muted px-5 py-3 last:border-0">
              <Text variant="body-sm" fontFamily="mono" color="muted">{physical}</Text>
              <Text variant="body-sm" fontFamily="mono" color="primary">{logical}</Text>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          The shorthands <code>margin-inline</code> / <code>padding-block</code> set both edges of
          an axis at once; <code>inset</code> is the logical replacement for{' '}
          <code>top/right/bottom/left</code>.
        </Text>
      </section>
    </div>
  )
}
