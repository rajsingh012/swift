import { useMemo, useState, type CSSProperties } from 'react'
import { SegmentedControl } from '@swift/components/SegmentedControl'
import { Slider } from '@swift/components/Slider'
import { Switch } from '@swift/components/Switch'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive Flexbox lesson. The stage is a REAL flex container — every
 * control maps straight to a CSS property on it, so the items rearrange
 * exactly as the browser lays them out.
 */

type Direction = 'row' | 'row-reverse' | 'column' | 'column-reverse'
type Justify =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
type Align = 'stretch' | 'flex-start' | 'center' | 'flex-end'

const DIRECTIONS: ReadonlyArray<Direction> = ['row', 'row-reverse', 'column', 'column-reverse']
const JUSTIFY: ReadonlyArray<Justify> = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
]
const ALIGN: ReadonlyArray<Align> = ['stretch', 'flex-start', 'center', 'flex-end']

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const ITEM_STYLE: CSSProperties = {
  width: 64,
  padding: '12px 0',
  background: 'var(--color-brand-200)',
  border: '1px solid var(--color-brand-400)',
  borderRadius: 6,
  color: 'var(--color-neutral-800)',
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: 13,
  fontWeight: 600,
  textAlign: 'center',
}

function Select<T extends string>({
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
    <label className="grid gap-1.5">
      <Text variant="body-xs" fontFamily="mono" color="secondary">
        {label}
      </Text>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-8 w-full cursor-pointer rounded-md border border-stroke bg-surface px-2 text-sm text-content-strong outline-none transition-colors focus:border-stroke-brand focus:ring-2 focus:ring-stroke-brand/20"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
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
  'Flexbox lays out items along a single axis. The container sets the main axis with `flex-direction`, distributes free space along it with `justify-content`, and aligns items across it with `align-items`. `gap` spaces them and `flex-wrap` lets them flow onto new lines. Drive every property and watch the items respond.'

export function FlexboxPanel() {
  const [direction, setDirection] = useState<Direction>('row')
  const [justify, setJustify] = useState<Justify>('flex-start')
  const [align, setAlign] = useState<Align>('stretch')
  const [wrap, setWrap] = useState(false)
  const [gap, setGap] = useState(12)
  const [count, setCount] = useState(4)

  const css = useMemo(
    () =>
      `.container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justify};
  align-items: ${align};
  flex-wrap: ${wrap ? 'wrap' : 'nowrap'};
  gap: ${gap}px;
}`,
    [direction, justify, align, wrap, gap],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Flexbox
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
                display: 'flex',
                flexDirection: direction,
                justifyContent: justify,
                alignItems: align,
                flexWrap: wrap ? 'wrap' : 'nowrap',
                gap,
                minHeight: 220,
                padding: 12,
                border: '1px dashed var(--color-stroke-strong)',
                borderRadius: 8,
                background: 'var(--color-surface)',
              }}
            >
              {Array.from({ length: count }, (_, i) => (
                <div key={i} style={ITEM_STYLE}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="flex items-center justify-between">
              <Text
                variant="body-xs"
                fontWeight="semibold"
                color="muted"
                className="tracking-wide uppercase"
              >
                flex-direction
              </Text>
            </div>
            <SegmentedControl
              size="sm"
              value={direction.startsWith('row') ? 'row' : 'column'}
              onValueChange={(v) =>
                setDirection(v === 'row' ? 'row' : 'column')
              }
              aria-label="axis"
            >
              <SegmentedControl.Indicator />
              <SegmentedControl.Item value="row">row</SegmentedControl.Item>
              <SegmentedControl.Item value="column">column</SegmentedControl.Item>
            </SegmentedControl>
            <Select
              label="flex-direction"
              value={direction}
              options={DIRECTIONS}
              onChange={setDirection}
            />
            <Select label="justify-content" value={justify} options={JUSTIFY} onChange={setJustify} />
            <Select label="align-items" value={align} options={ALIGN} onChange={setAlign} />
            <SliderRow label="gap" value={gap} min={0} max={40} step={2} suffix="px" onChange={setGap} />
            <SliderRow label="items" value={count} min={1} max={6} onChange={setCount} />
            <div className="flex items-center justify-between gap-3">
              <Text variant="body-xs" fontFamily="mono" color="secondary">
                flex-wrap
              </Text>
              <Switch size="sm" checked={wrap} onCheckedChange={setWrap} aria-label="flex-wrap" />
            </div>
          </div>

          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
      </section>

      {/* ── flex item growth ────────────────────────────────────────── */}
      <section>
        <SectionHeader>On the items · flex-grow</SectionHeader>
        <FlexGrowDemo />
      </section>

      {/* ── Axis cheatsheet ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Main axis vs cross axis</SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              title: 'Main axis',
              body: 'Set by flex-direction. justify-content distributes free space along it (start / center / between / around / evenly).',
            },
            {
              title: 'Cross axis',
              body: 'Perpendicular to the main axis. align-items positions items across it; align-self overrides a single item.',
            },
          ].map(({ title, body }) => (
            <div key={title} className="flex flex-col gap-1 rounded-xl border border-stroke bg-surface-elevated p-5">
              <Text variant="body-sm" fontWeight="semibold" color="primary">
                {title}
              </Text>
              <Text variant="body-xs" color="secondary">
                {body}
              </Text>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Flip <code>flex-direction</code> to <code>column</code> and the two axes swap —{' '}
          <code>justify-content</code> now works vertically.
        </Text>
      </section>
    </div>
  )
}

function FlexGrowDemo() {
  const [grow, setGrow] = useState<[number, number, number]>([1, 1, 1])
  const set = (i: number, v: number) =>
    setGrow((prev) => prev.map((g, j) => (j === i ? v : g)) as [number, number, number])
  return (
    <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_240px]">
      <div className="flex items-center bg-surface-muted p-8" style={STAGE_STYLE}>
        <div
          style={{
            display: 'flex',
            gap: 10,
            width: '100%',
            padding: 12,
            border: '1px dashed var(--color-stroke-strong)',
            borderRadius: 8,
            background: 'var(--color-surface)',
          }}
        >
          {grow.map((g, i) => (
            <div key={i} style={{ ...ITEM_STYLE, width: 'auto', flexGrow: g, flexBasis: 0 }}>
              {g}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
        {grow.map((g, i) => (
          <SliderRow
            key={i}
            label={`item ${i + 1} grow`}
            value={g}
            min={0}
            max={4}
            onChange={(v) => set(i, v)}
          />
        ))}
        <Text variant="body-xs" color="secondary">
          <code>flex-grow</code> shares leftover space in proportion to each item&rsquo;s value.
          A <code>2</code> takes twice the slack of a <code>1</code>; <code>0</code> never grows.
        </Text>
      </div>
    </div>
  )
}
