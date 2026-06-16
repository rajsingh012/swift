import { useMemo, useState, type CSSProperties } from 'react'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive conic-gradient + color-mix() lesson. Both write real CSS:
 * the conic wheel and the mixed swatch update live from the sliders.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

function SliderRow({
  label, value, min, max, step = 1, suffix = '', onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number; suffix?: string; onChange: (v: number) => void
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between">
        <Text variant="body-xs" fontFamily="mono" color="secondary">{label}</Text>
        <Text variant="body-xs" fontFamily="mono" color="primary">{value}{suffix}</Text>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} aria-label={label} />
    </div>
  )
}

export function ConicColorMixPanel() {
  const [from, setFrom] = useState(0)
  const [split, setSplit] = useState(40)
  const pie = `conic-gradient(from ${from}deg, var(--color-brand-500) 0 ${split}%, var(--color-success-500) ${split}% ${Math.min(100, split + 30)}%, var(--color-warning-500) ${Math.min(100, split + 30)}% 100%)`
  const pieCss = useMemo(() => `.wheel {\n  background: ${pie.replace(/, /g, ',\n    ')};\n}`, [pie])

  const [c1, setC1] = useState('#5b8def')
  const [c2, setC2] = useState('#ef4444')
  const [ratio, setRatio] = useState(50)
  const mix = `color-mix(in srgb, ${c1} ${ratio}%, ${c2})`

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Conic &amp; color-mix
        </Text>
        <Text variant="para-lg" color="secondary">
          A <code>conic-gradient</code> sweeps colours <em>around</em> a centre point (not along a
          line) — perfect for pie charts and colour wheels. <code>color-mix()</code> blends two
          colours in a chosen colour space by percentage — great for tints, shades, and theming
          without a preprocessor.
        </Text>
      </header>

      <section>
        <SectionHeader>conic-gradient</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-64 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div style={{ width: 170, height: 170, borderRadius: '50%', background: pie }} className="border border-stroke shadow-level2" />
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <SliderRow label="from (start angle)" value={from} min={0} max={360} suffix="°" onChange={setFrom} />
            <SliderRow label="first slice" value={split} min={10} max={70} suffix="%" onChange={setSplit} />
            <Text variant="body-xs" color="muted">
              Hard colour stops (same position twice) make crisp pie slices; soft stops make a
              smooth wheel. Add <code>at 30% 30%</code> to move the centre.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={pieCss} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>color-mix()</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-56 items-center justify-center gap-3 bg-surface-muted p-8" style={STAGE_STYLE}>
            <div style={{ background: c1, width: 64, height: 96, borderRadius: 10 }} className="border border-stroke" />
            <div style={{ background: mix, width: 96, height: 110, borderRadius: 12 }} className="border border-stroke shadow-level2" />
            <div style={{ background: c2, width: 64, height: 96, borderRadius: 10 }} className="border border-stroke" />
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="flex items-center gap-4">
              {[{ l: 'color 1', v: c1, s: setC1 }, { l: 'color 2', v: c2, s: setC2 }].map(({ l, v, s }) => (
                <label key={l} className="flex items-center gap-2">
                  <input type="color" value={v} onChange={(e) => s(e.target.value)} className="size-8 cursor-pointer rounded-md border border-stroke bg-surface" aria-label={l} />
                  <Text variant="body-xs" fontFamily="mono" color="secondary">{l}</Text>
                </label>
              ))}
            </div>
            <SliderRow label="color 1 amount" value={ratio} min={0} max={100} suffix="%" onChange={setRatio} />
            <Text variant="body-xs" fontFamily="mono" color="secondary" className="break-all">
              {mix}
            </Text>
            <Text variant="body-xs" color="muted">
              Mix with <code>transparent</code> for instant opacity, or in <code>oklch</code> for
              perceptually even blends.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={`.swatch {\n  background: ${mix};\n}`} />
          </div>
        </div>
      </section>
    </div>
  )
}
