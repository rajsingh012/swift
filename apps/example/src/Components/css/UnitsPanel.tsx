import { useState, type CSSProperties } from 'react'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive CSS units lesson. Rather than mutate the page's real root
 * font-size (which would reflow everything), this resolves each unit to
 * pixels from the sliders and renders the bars at the computed width —
 * a live "what does this unit actually become" calculator.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = '',
  onChange,
  hint,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  suffix?: string
  onChange: (v: number) => void
  hint?: string
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
      {hint ? (
        <Text variant="body-xs" color="muted">
          {hint}
        </Text>
      ) : null}
    </div>
  )
}

type UnitRow = {
  css: string
  /** Resolve to pixels from the current slider state. */
  px: (s: State) => number
  /** Human formula shown live. */
  formula: (s: State) => string
  note: string
}

type State = {
  root: number
  font: number
  container: number
}

const UNITS: ReadonlyArray<UnitRow> = [
  {
    css: 'width: 160px',
    px: () => 160,
    formula: () => 'always 160px',
    note: 'Absolute — fixed regardless of context.',
  },
  {
    css: 'width: 10rem',
    px: (s) => 10 * s.root,
    formula: (s) => `10 × ${s.root}px (root) = ${10 * s.root}px`,
    note: 'Relative to the ROOT font-size. Stable, predictable scaling.',
  },
  {
    css: 'width: 10em',
    px: (s) => 10 * s.font,
    formula: (s) => `10 × ${s.font}px (this element) = ${10 * s.font}px`,
    note: 'Relative to THIS element’s font-size — compounds when nested.',
  },
  {
    css: 'width: 50%',
    px: (s) => Math.round(0.5 * s.container),
    formula: (s) => `50% × ${s.container}px (container) = ${Math.round(0.5 * s.container)}px`,
    note: 'Relative to the containing block’s size.',
  },
  {
    css: 'width: 20ch',
    px: (s) => Math.round(20 * s.font * 0.5),
    formula: (s) => `20 × ~${(s.font * 0.5).toFixed(1)}px (≈0.5em) = ${Math.round(20 * s.font * 0.5)}px`,
    note: 'Width of “0” at the current font — great for text measure.',
  },
]

const REFERENCE: ReadonlyArray<{ unit: string; kind: string; rel: string }> = [
  { unit: 'px', kind: 'absolute', rel: 'one device pixel — never scales' },
  { unit: 'rem', kind: 'relative', rel: 'root (html) font-size' },
  { unit: 'em', kind: 'relative', rel: 'current element font-size' },
  { unit: '%', kind: 'relative', rel: 'parent / containing block' },
  { unit: 'vw / vh', kind: 'relative', rel: '1% of viewport width / height' },
  { unit: 'ch', kind: 'relative', rel: 'width of the “0” glyph' },
  { unit: 'vmin / vmax', kind: 'relative', rel: '1% of the smaller / larger viewport side' },
]

const DESCRIPTION =
  'CSS lengths are either absolute (px never changes) or relative — resolved against something else: the root font-size (rem), the local font-size (em), the container (%), or the viewport (vw/vh). Move the sliders to watch the same numeric value resolve to wildly different pixel widths.'

export function UnitsPanel() {
  const [root, setRoot] = useState(16)
  const [font, setFont] = useState(16)
  const [container, setContainer] = useState(360)
  const state: State = { root, font, container }
  const maxPx = Math.max(...UNITS.map((u) => u.px(state)), 1)

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Units &amp; sizing
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* ── Playground ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Playground · the same value, five units</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          {/* Stage */}
          <div className="flex flex-col justify-center gap-3 bg-surface-muted p-8" style={STAGE_STYLE}>
            {UNITS.map((u) => {
              const px = u.px(state)
              return (
                <div key={u.css} className="grid gap-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="primary">
                      {u.css}
                    </Text>
                    <Text variant="body-xs" fontFamily="mono" color="muted">
                      {u.formula(state)}
                    </Text>
                  </div>
                  <div
                    style={{
                      width: `${(px / maxPx) * 100}%`,
                      height: 22,
                      background: 'var(--color-brand-200)',
                      border: '1px solid var(--color-brand-400)',
                      borderRadius: 5,
                    }}
                    className="flex items-center justify-end pr-2"
                  >
                    <span
                      style={{ color: 'var(--color-neutral-800)', fontSize: 11, fontWeight: 700 }}
                      className="font-mono"
                    >
                      {px}px
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-5 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <Text
              variant="body-xs"
              fontWeight="semibold"
              color="muted"
              className="tracking-wide uppercase"
            >
              context
            </Text>
            <SliderRow
              label="root font-size"
              value={root}
              min={8}
              max={28}
              suffix="px"
              onChange={setRoot}
              hint="drives rem"
            />
            <SliderRow
              label="element font-size"
              value={font}
              min={8}
              max={40}
              suffix="px"
              onChange={setFont}
              hint="drives em & ch"
            />
            <SliderRow
              label="container width"
              value={container}
              min={160}
              max={560}
              step={10}
              suffix="px"
              onChange={setContainer}
              hint="drives %"
            />
          </div>

          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock
              code={`html { font-size: ${root}px; }      /* rem base */
.box {
  font-size: ${font}px;            /* em / ch base */
  width: 10rem;  /* ${10 * root}px */
  width: 10em;   /* ${10 * font}px */
  width: 50%;    /* ${Math.round(0.5 * container)}px of ${container}px */
}`}
            />
          </div>
        </div>
      </section>

      {/* ── Reference ───────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Unit reference</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          <div className="grid min-w-[480px] grid-cols-[120px_120px_1fr] gap-4 border-b border-stroke bg-surface-muted px-5 py-3">
            {['Unit', 'Kind', 'Relative to'].map((h) => (
              <Text key={h} variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">
                {h}
              </Text>
            ))}
          </div>
          {REFERENCE.map(({ unit, kind, rel }) => (
            <div
              key={unit}
              className="grid min-w-[480px] grid-cols-[120px_120px_1fr] items-center gap-4 border-b border-stroke-muted px-5 py-3 last:border-0"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {unit}
              </Text>
              <Text variant="body-xs" color={kind === 'absolute' ? 'warning' : 'secondary'}>
                {kind}
              </Text>
              <Text variant="body-sm" color="secondary">
                {rel}
              </Text>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Rule of thumb: <code>rem</code> for type &amp; spacing (scales with user preference),{' '}
          <code>%</code> / <code>fr</code> for layout, <code>px</code> for hairline borders,{' '}
          <code>ch</code> for readable line lengths.
        </Text>
      </section>
    </div>
  )
}
