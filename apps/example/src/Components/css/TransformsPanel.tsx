import { useMemo, useState, type CSSProperties } from 'react'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive CSS transforms lesson. The stage applies a REAL `transform`
 * built from the sliders; a dashed ghost marks the element's original,
 * untransformed box so you can see that transforms never affect layout.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const ORIGINS = ['center', 'top left', 'top right', 'bottom left', 'bottom right'] as const
type Origin = (typeof ORIGINS)[number]

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

const FUNCTIONS: ReadonlyArray<{ fn: string; note: string }> = [
  { fn: 'translate(x, y)', note: 'Move along X / Y without touching layout.' },
  { fn: 'rotate(angle)', note: 'Spin around the transform-origin.' },
  { fn: 'scale(n)', note: 'Grow / shrink; 1 = unchanged, <1 smaller.' },
  { fn: 'skew(ax, ay)', note: 'Slant the box along an axis.' },
  { fn: 'matrix(…)', note: 'The low-level form all of the above compile to.' },
]

const DESCRIPTION =
  'The `transform` property repaints an element — moving, rotating, scaling, or skewing it — without disturbing the surrounding layout (its original box still reserves space). Transforms are GPU-composited, so they animate cheaply. `transform-origin` sets the pivot point.'

export function TransformsPanel() {
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)
  const [rotate, setRotate] = useState(0)
  const [scale, setScale] = useState(100)
  const [skew, setSkew] = useState(0)
  const [origin, setOrigin] = useState<Origin>('center')

  const transform = `translate(${tx}px, ${ty}px) rotate(${rotate}deg) scale(${(scale / 100).toFixed(2)}) skewX(${skew}deg)`
  const css = useMemo(
    () =>
      `.box {
  transform: ${transform};
  transform-origin: ${origin};
}`,
    [transform, origin],
  )

  const reset = () =>
    (setTx(0), setTy(0), setRotate(0), setScale(100), setSkew(0), setOrigin('center'))
  const isDirty = tx || ty || rotate || scale !== 100 || skew || origin !== 'center'

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Transforms
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          {/* Stage */}
          <div className="flex min-h-72 items-center justify-center overflow-hidden bg-surface-muted p-8" style={STAGE_STYLE}>
            <div style={{ position: 'relative', width: 120, height: 120 }}>
              {/* Ghost: original, untransformed footprint. */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  border: '1px dashed var(--color-stroke-strong)',
                  borderRadius: 10,
                }}
              />
              {/* Real, transformed box. */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-brand-200)',
                  border: '1px solid var(--color-brand-400)',
                  borderRadius: 10,
                  color: 'var(--color-neutral-800)',
                  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                  fontSize: 12,
                  fontWeight: 700,
                  transform,
                  transformOrigin: origin,
                }}
              >
                box
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="flex items-center justify-between">
              <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
                transform
              </Text>
              {isDirty ? (
                <button
                  type="button"
                  onClick={reset}
                  className="anim-fade-in cursor-pointer text-xs font-semibold text-content-brand hover:underline"
                >
                  Reset
                </button>
              ) : null}
            </div>
            <SliderRow label="translateX" value={tx} min={-80} max={80} suffix="px" onChange={setTx} />
            <SliderRow label="translateY" value={ty} min={-80} max={80} suffix="px" onChange={setTy} />
            <SliderRow label="rotate" value={rotate} min={-180} max={180} suffix="°" onChange={setRotate} />
            <SliderRow label="scale" value={scale} min={50} max={150} suffix="%" onChange={setScale} />
            <SliderRow label="skewX" value={skew} min={-45} max={45} suffix="°" onChange={setSkew} />
            <label className="grid gap-1.5">
              <Text variant="body-xs" fontFamily="mono" color="secondary">
                transform-origin
              </Text>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value as Origin)}
                className="h-8 w-full cursor-pointer rounded-md border border-stroke bg-surface px-2 text-sm text-content-strong outline-none transition-colors focus:border-stroke-brand focus:ring-2 focus:ring-stroke-brand/20"
              >
                {ORIGINS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          The dashed outline is the original box — note it never moves, so neighbouring content
          stays put no matter how far the box is transformed.
        </Text>
      </section>

      <section>
        <SectionHeader>Transform functions</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {FUNCTIONS.map(({ fn, note }) => (
            <div
              key={fn}
              className="grid gap-1 border-b border-stroke-muted px-5 py-3 last:border-0 md:grid-cols-[200px_1fr] md:items-center md:gap-4"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {fn}
              </Text>
              <Text variant="body-sm" color="secondary">
                {note}
              </Text>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Order matters — <code>rotate</code> then <code>translate</code> moves along the
          rotated axes. Animate <code>transform</code> (and <code>opacity</code>) for the
          smoothest, compositor-only motion.
        </Text>
      </section>
    </div>
  )
}
