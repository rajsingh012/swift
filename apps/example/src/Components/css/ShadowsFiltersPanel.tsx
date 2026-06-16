import { useMemo, useState, type CSSProperties } from 'react'
import { Slider } from '@swift/components/Slider'
import { Switch } from '@swift/components/Switch'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive box-shadow + filter lesson. The shadow builder and the
 * filter sliders both write real CSS onto the preview boxes, so every
 * offset, blur, and filter function renders exactly as the browser paints
 * it.
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
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} aria-label={label} />
    </div>
  )
}

const DESCRIPTION =
  'A `box-shadow` paints a coloured copy of the box offset by X / Y, softened by blur, and grown by spread (negative blur/spread or `inset` give inner shadows). A `filter` reprocesses the rendered pixels — blur, brightness, contrast, saturation, hue. Drive both below.'

export function ShadowsFiltersPanel() {
  const [x, setX] = useState(0)
  const [y, setY] = useState(10)
  const [blur, setBlur] = useState(24)
  const [spread, setSpread] = useState(-4)
  const [color, setColor] = useState('#1f2a44')
  const [inset, setInset] = useState(false)

  const shadow = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${color}66`
  const shadowCss = useMemo(() => `.box {\n  box-shadow: ${shadow};\n}`, [shadow])

  const [fBlur, setFBlur] = useState(0)
  const [bright, setBright] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturate, setSaturate] = useState(100)
  const [grayscale, setGrayscale] = useState(0)
  const [hue, setHue] = useState(0)
  const filter = `blur(${fBlur}px) brightness(${bright}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%) hue-rotate(${hue}deg)`
  const filterCss = useMemo(() => `.box {\n  filter:\n    ${filter.replace(/\) /g, ')\n    ')};\n}`, [filter])
  const resetFilters = () =>
    (setFBlur(0), setBright(100), setContrast(100), setSaturate(100), setGrayscale(0), setHue(0))

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Shadows &amp; filters
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* ── Box-shadow builder ──────────────────────────────────────── */}
      <section>
        <SectionHeader>box-shadow builder</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-64 items-center justify-center bg-surface-muted p-10" style={STAGE_STYLE}>
            <div
              style={{
                width: 130,
                height: 130,
                borderRadius: 16,
                background: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-stroke)',
                boxShadow: shadow,
              }}
            />
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <SliderRow label="offset-x" value={x} min={-40} max={40} suffix="px" onChange={setX} />
            <SliderRow label="offset-y" value={y} min={-40} max={40} suffix="px" onChange={setY} />
            <SliderRow label="blur" value={blur} min={0} max={60} suffix="px" onChange={setBlur} />
            <SliderRow label="spread" value={spread} min={-20} max={20} suffix="px" onChange={setSpread} />
            <label className="flex items-center justify-between gap-2">
              <Text variant="body-xs" fontFamily="mono" color="secondary">
                color
              </Text>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="size-8 cursor-pointer rounded-md border border-stroke bg-surface"
                aria-label="shadow color"
              />
            </label>
            <div className="flex items-center justify-between gap-3">
              <Text variant="body-xs" fontFamily="mono" color="secondary">
                inset
              </Text>
              <Switch size="sm" checked={inset} onCheckedChange={setInset} aria-label="inset" />
            </div>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={shadowCss} />
          </div>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Layer multiple comma-separated shadows for depth. The <code>66</code> suffix on the
          colour is hex alpha (~40% opacity) — soft shadows read better than solid ones.
        </Text>
      </section>

      {/* ── Filter playground ───────────────────────────────────────── */}
      <section>
        <SectionHeader>filter functions</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-64 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{
                width: 200,
                height: 150,
                borderRadius: 14,
                filter,
                background:
                  'linear-gradient(135deg, #f59e0b, #ef4444 45%, #8b5cf6 75%, #22c55e)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                fontWeight: 700,
                textShadow: '0 1px 4px rgba(0,0,0,.4)',
              }}
            >
              sample
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="flex items-center justify-between">
              <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
                filter
              </Text>
              <button
                type="button"
                onClick={resetFilters}
                className="cursor-pointer text-xs font-semibold text-content-brand hover:underline"
              >
                Reset
              </button>
            </div>
            <SliderRow label="blur" value={fBlur} min={0} max={12} suffix="px" onChange={setFBlur} />
            <SliderRow label="brightness" value={bright} min={0} max={200} suffix="%" onChange={setBright} />
            <SliderRow label="contrast" value={contrast} min={0} max={200} suffix="%" onChange={setContrast} />
            <SliderRow label="saturate" value={saturate} min={0} max={200} suffix="%" onChange={setSaturate} />
            <SliderRow label="grayscale" value={grayscale} min={0} max={100} suffix="%" onChange={setGrayscale} />
            <SliderRow label="hue-rotate" value={hue} min={0} max={360} suffix="°" onChange={setHue} />
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={filterCss} />
          </div>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>backdrop-filter</code> applies the same functions to whatever sits{' '}
          <em>behind</em> an element — the frosted-glass effect.
        </Text>
      </section>
    </div>
  )
}
