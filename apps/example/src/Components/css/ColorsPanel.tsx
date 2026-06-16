import { useState, type CSSProperties } from 'react'
import { SegmentedControl } from '@swift/components/SegmentedControl'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive colour & gradient lesson. The HSL sliders resolve to live
 * hex / rgb / hsl strings, and the gradient builder writes a real
 * `linear-gradient` / `radial-gradient` onto the preview.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

function hslParts(h: number, s: number, l: number): [number, number, number] {
  const sn = s / 100
  const ln = l / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sn * Math.min(ln, 1 - ln)
  const f = (n: number) => ln - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
  return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))]
}

function toHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslParts(h, s, l)
  const hex = (x: number) => x.toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

function SliderRow({
  label,
  value,
  min,
  max,
  suffix = '',
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
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
      <Slider value={[value]} min={min} max={max} step={1} onValueChange={([v]) => onChange(v)} aria-label={label} />
    </div>
  )
}

const DESCRIPTION =
  'A colour can be written many ways — hex, rgb(), or hsl() (hue / saturation / lightness, the most human-friendly). Gradients interpolate between colour stops along a line or out from a point. Drive the HSL channels and the gradient stops below and watch the values resolve.'

export function ColorsPanel() {
  const [h, setH] = useState(210)
  const [s, setS] = useState(80)
  const [l, setL] = useState(55)
  const [r, g, b] = hslParts(h, s, l)
  const hex = toHex(h, s, l)

  const [type, setType] = useState<'linear' | 'radial'>('linear')
  const [angle, setAngle] = useState(90)
  const [c1, setC1] = useState('#5b8def')
  const [c2, setC2] = useState('#22c55e')
  const gradient =
    type === 'linear'
      ? `linear-gradient(${angle}deg, ${c1}, ${c2})`
      : `radial-gradient(circle, ${c1}, ${c2})`

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Colors &amp; gradients
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* ── HSL explorer ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Colour models · the same colour, three notations</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-60 flex-col items-center justify-center gap-4 bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{ background: hex, width: 140, height: 140, borderRadius: 16 }}
              className="border border-stroke shadow-level2"
            />
            <div className="flex flex-col items-center gap-1">
              {[
                `hsl(${h} ${s}% ${l}%)`,
                `rgb(${r} ${g} ${b})`,
                hex,
              ].map((v) => (
                <Text key={v} variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                  {v}
                </Text>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
              hsl channels
            </Text>
            <SliderRow label="hue" value={h} min={0} max={360} suffix="°" onChange={setH} />
            <SliderRow label="saturation" value={s} min={0} max={100} suffix="%" onChange={setS} />
            <SliderRow label="lightness" value={l} min={0} max={100} suffix="%" onChange={setL} />
            <Text variant="body-xs" color="muted">
              <code>hsl</code> is intuitive: spin <em>hue</em> for the colour, drop{' '}
              <em>saturation</em> toward grey, raise <em>lightness</em> toward white.
            </Text>
          </div>
        </div>
      </section>

      {/* ── Gradient builder ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Gradient builder</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-60 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{ background: gradient, width: '100%', maxWidth: 380, height: 160, borderRadius: 16 }}
              className="border border-stroke shadow-level2"
            />
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <SegmentedControl
              size="sm"
              fullWidth
              value={type}
              onValueChange={(v) => setType(v as 'linear' | 'radial')}
              aria-label="gradient type"
            >
              <SegmentedControl.Indicator />
              <SegmentedControl.Item value="linear">linear</SegmentedControl.Item>
              <SegmentedControl.Item value="radial">radial</SegmentedControl.Item>
            </SegmentedControl>
            {type === 'linear' ? (
              <SliderRow label="angle" value={angle} min={0} max={360} suffix="°" onChange={setAngle} />
            ) : null}
            <div className="flex items-center gap-4">
              {[
                { label: 'stop 1', value: c1, set: setC1 },
                { label: 'stop 2', value: c2, set: setC2 },
              ].map(({ label, value, set }) => (
                <label key={label} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="size-8 cursor-pointer rounded-md border border-stroke bg-surface"
                    aria-label={label}
                  />
                  <Text variant="body-xs" fontFamily="mono" color="secondary">
                    {value}
                  </Text>
                </label>
              ))}
            </div>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={`.box {\n  background: ${gradient};\n}`} />
          </div>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Add more comma-separated stops for multi-colour gradients, and give a stop a position
          (<code>{c1} 30%</code>) to control where it lands.
        </Text>
      </section>
    </div>
  )
}
