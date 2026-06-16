import { useMemo, useState, type CSSProperties } from 'react'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive typography lesson. Every control feeds a real style on the
 * sample paragraph, so font-size, line-height, letter-spacing, weight,
 * and alignment all render exactly as the browser sets type.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const FAMILIES = {
  sans: 'ui-sans-serif, system-ui, sans-serif',
  serif: 'ui-serif, Georgia, serif',
  mono: 'var(--font-mono, ui-monospace, monospace)',
} as const
type Family = keyof typeof FAMILIES

const WEIGHTS = ['300', '400', '500', '600', '700'] as const
type Weight = (typeof WEIGHTS)[number]
const ALIGNS = ['left', 'center', 'right', 'justify'] as const
type Align = (typeof ALIGNS)[number]
const TRANSFORMS = ['none', 'uppercase', 'capitalize', 'lowercase'] as const
type Transform = (typeof TRANSFORMS)[number]

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

const SAMPLE =
  'The quick brown fox jumps over the lazy dog. Good typography is invisible — it carries the reading without calling attention to itself.'

export function TypographyPanel() {
  const [size, setSize] = useState(18)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [spacing, setSpacing] = useState(0)
  const [family, setFamily] = useState<Family>('sans')
  const [weight, setWeight] = useState<Weight>('400')
  const [align, setAlign] = useState<Align>('left')
  const [transform, setTransform] = useState<Transform>('none')

  const css = useMemo(
    () =>
      `p {
  font-size: ${size}px;
  line-height: ${lineHeight.toFixed(2)};
  letter-spacing: ${spacing}px;
  font-weight: ${weight};
  text-align: ${align};
  text-transform: ${transform};
}`,
    [size, lineHeight, spacing, weight, align, transform],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Typography
        </Text>
        <Text variant="para-lg" color="secondary">
          Type is tuned with a handful of properties: <code>font-size</code> and a unitless{' '}
          <code>line-height</code> for rhythm, <code>letter-spacing</code> for density,{' '}
          <code>font-weight</code> for emphasis, and <code>text-align</code> /{' '}
          <code>text-transform</code> for presentation. Adjust them and read the result.
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-72 items-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <p
              style={{
                fontFamily: FAMILIES[family],
                fontSize: size,
                lineHeight,
                letterSpacing: spacing,
                fontWeight: Number(weight),
                textAlign: align,
                textTransform: transform,
                color: 'var(--color-content)',
                margin: 0,
                maxWidth: 540,
              }}
            >
              {SAMPLE}
            </p>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="grid gap-1.5">
              <div className="flex items-baseline justify-between">
                <Text variant="body-xs" fontFamily="mono" color="secondary">font-size</Text>
                <Text variant="body-xs" fontFamily="mono" color="primary">{size}px</Text>
              </div>
              <Slider value={[size]} min={12} max={40} step={1} onValueChange={([v]) => setSize(v)} aria-label="font-size" />
            </div>
            <div className="grid gap-1.5">
              <div className="flex items-baseline justify-between">
                <Text variant="body-xs" fontFamily="mono" color="secondary">line-height</Text>
                <Text variant="body-xs" fontFamily="mono" color="primary">{lineHeight.toFixed(2)}</Text>
              </div>
              <Slider value={[lineHeight]} min={1} max={2.2} step={0.05} onValueChange={([v]) => setLineHeight(v)} aria-label="line-height" />
            </div>
            <div className="grid gap-1.5">
              <div className="flex items-baseline justify-between">
                <Text variant="body-xs" fontFamily="mono" color="secondary">letter-spacing</Text>
                <Text variant="body-xs" fontFamily="mono" color="primary">{spacing}px</Text>
              </div>
              <Slider value={[spacing]} min={-2} max={8} step={0.5} onValueChange={([v]) => setSpacing(v)} aria-label="letter-spacing" />
            </div>
            <Select label="font-family" value={family} options={Object.keys(FAMILIES) as Family[]} onChange={setFamily} />
            <Select label="font-weight" value={weight} options={WEIGHTS} onChange={setWeight} />
            <Select label="text-align" value={align} options={ALIGNS} onChange={setAlign} />
            <Select label="text-transform" value={transform} options={TRANSFORMS} onChange={setTransform} />
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>Worth knowing</SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['Unitless line-height', 'Use 1.5, not 24px — a unitless value scales with each element’s own font-size, so nested text stays readable.'],
            ['Measure (line length)', 'Aim for 45–75 characters per line. Cap it with max-width: 65ch for comfortable reading.'],
            ['font shorthand', 'font: 600 18px/1.5 system-ui sets weight, size, line-height, and family in one line.'],
            ['text-wrap', 'text-wrap: balance evens out headings; pretty avoids ugly orphans in paragraphs.'],
          ].map(([t, b]) => (
            <div key={t} className="flex flex-col gap-1 rounded-xl border border-stroke bg-surface-elevated p-5">
              <Text variant="body-sm" fontWeight="semibold" color="primary">{t}</Text>
              <Text variant="body-xs" color="secondary">{b}</Text>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
