import { useMemo, useState, type CSSProperties } from 'react'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive CSS Grid lesson. The stage is a REAL grid container — the
 * column count, gap, and item count all map straight to CSS, and the
 * span / auto-fit demos render genuine `grid-column` and `repeat()`
 * behaviour.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const CELL: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 48,
  background: 'var(--color-brand-200)',
  border: '1px solid var(--color-brand-400)',
  borderRadius: 6,
  color: 'var(--color-neutral-800)',
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: 13,
  fontWeight: 600,
}

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = '',
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between">
        <Text variant="body-xs" fontFamily="mono" color="secondary">
          {label}
        </Text>
        <Text variant="body-xs" fontFamily="mono" color="primary">
          {value}
          {suffix}
        </Text>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        aria-label={label}
      />
    </div>
  )
}

const DESCRIPTION =
  'Grid lays out items in two dimensions at once. `grid-template-columns` defines the column tracks (often with the `fr` flex unit), `gap` spaces every track, and items can span multiple cells. With `repeat(auto-fit, minmax(…))` the grid even decides its own column count as it resizes.'

export function GridPanel() {
  const [columns, setColumns] = useState(3)
  const [gap, setGap] = useState(12)
  const [count, setCount] = useState(6)

  const css = useMemo(
    () =>
      `.grid {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  gap: ${gap}px;
}`,
    [columns, gap],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Grid
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* ── Playground ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          {/* Stage */}
          <div className="overflow-auto bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap,
                padding: 12,
                border: '1px dashed var(--color-stroke-strong)',
                borderRadius: 8,
                background: 'var(--color-surface)',
              }}
            >
              {Array.from({ length: count }, (_, i) => (
                <div key={i} style={CELL}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-5 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <Text
              variant="body-xs"
              fontWeight="semibold"
              color="muted"
              className="tracking-wide uppercase"
            >
              grid-template-columns
            </Text>
            <SliderRow label="columns" value={columns} min={1} max={6} onChange={setColumns} />
            <SliderRow label="gap" value={gap} min={0} max={40} step={2} suffix="px" onChange={setGap} />
            <SliderRow label="items" value={count} min={1} max={12} onChange={setCount} />
            <Text variant="body-xs" color="muted">
              Each column is <code>1fr</code> — one share of the free space, so the tracks stay
              equal as the grid resizes.
            </Text>
          </div>

          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
      </section>

      {/* ── Spanning ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Spanning cells · grid-column</SectionHeader>
        <SpanDemo />
      </section>

      {/* ── auto-fit ────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Responsive without media queries · auto-fit + minmax</SectionHeader>
        <AutoFitDemo />
      </section>
    </div>
  )
}

function SpanDemo() {
  const [span, setSpan] = useState(2)
  const code = `.featured {
  grid-column: span ${span};
}`
  return (
    <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_240px]">
      <div className="bg-surface-muted p-8" style={STAGE_STYLE}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 10,
            padding: 12,
            border: '1px dashed var(--color-stroke-strong)',
            borderRadius: 8,
            background: 'var(--color-surface)',
          }}
        >
          <div
            style={{
              ...CELL,
              gridColumn: `span ${span}`,
              background: 'var(--color-success-200)',
              borderColor: 'var(--color-success-400)',
            }}
          >
            span {span}
          </div>
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} style={CELL}>
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
        <SliderRow label="span" value={span} min={1} max={4} onChange={setSpan} />
        <CodeBlock code={code} />
        <Text variant="body-xs" color="secondary">
          <code>grid-column: span N</code> makes a cell occupy N column tracks; the rest reflow
          around it.
        </Text>
      </div>
    </div>
  )
}

function AutoFitDemo() {
  const [width, setWidth] = useState(420)
  const [minItem, setMinItem] = useState(90)
  const fit = Math.max(1, Math.floor((width + 10) / (minItem + 10)))
  const code = `.grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(${minItem}px, 1fr));
  gap: 10px;
}`
  return (
    <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_240px]">
      <div className="flex items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
        <div
          style={{
            width,
            maxWidth: '100%',
            padding: 12,
            border: '1px dashed var(--color-stroke-strong)',
            borderRadius: 8,
            background: 'var(--color-surface)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(${minItem}px, 1fr))`,
              gap: 10,
            }}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} style={CELL}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
        <SliderRow label="container" value={width} min={220} max={560} step={10} suffix="px" onChange={setWidth} />
        <SliderRow label="min item" value={minItem} min={60} max={160} step={5} suffix="px" onChange={setMinItem} />
        <div className="rounded-lg bg-surface-muted px-3 py-2">
          <Text variant="body-xs" fontFamily="mono" color="secondary">
            fits{' '}
            <span className="font-semibold text-content-brand">{fit}</span>{' '}
            column{fit === 1 ? '' : 's'}
          </Text>
        </div>
        <CodeBlock code={code} />
        <Text variant="body-xs" color="secondary">
          <code>auto-fit</code> packs as many <code>minmax</code> tracks as fit, then stretches
          them to fill — a responsive grid with zero breakpoints.
        </Text>
      </div>
    </div>
  )
}
