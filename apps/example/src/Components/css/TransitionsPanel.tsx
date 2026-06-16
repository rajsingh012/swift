import { useMemo, useState, type CSSProperties } from 'react'
import { Button } from '@swift/components/Button'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive CSS transitions lesson. The box animates between two real
 * states (position + colour); every control feeds a real `transition`
 * shorthand, so duration, easing, the animated property, and delay all
 * behave exactly as the browser runs them. Hit Play to replay.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

type Property = 'all' | 'transform' | 'background-color'
const PROPERTIES: ReadonlyArray<Property> = ['all', 'transform', 'background-color']

const TIMINGS = [
  'ease',
  'linear',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'cubic-bezier(.34, 1.56, .64, 1)',
] as const
type Timing = (typeof TIMINGS)[number]

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix: string
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
  'A `transition` interpolates a property between its old and new value over time whenever that value changes. You pick which property animates, how long it takes, the easing curve, and an optional delay. Everything here is one `transition` shorthand on a real element — toggle the state and watch it move.'

export function TransitionsPanel() {
  const [active, setActive] = useState(false)
  const [property, setProperty] = useState<Property>('all')
  const [duration, setDuration] = useState(500)
  const [timing, setTiming] = useState<Timing>('ease')
  const [delay, setDelay] = useState(0)

  const transition = `${property} ${duration}ms ${timing} ${delay}ms`
  const css = useMemo(
    () =>
      `.box {
  transition: ${transition};
}
.box.is-active {
  transform: translateX(220px);
  background: var(--color-success-300);
}`,
    [transition],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Transitions
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          {/* Stage */}
          <div className="flex min-h-72 flex-col justify-center gap-5 overflow-hidden bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{
                position: 'relative',
                height: 64,
                borderRadius: 8,
                border: '1px dashed var(--color-stroke-strong)',
                background: 'var(--color-surface)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  width: 64,
                  height: 48,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-neutral-800)',
                  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                  fontSize: 12,
                  fontWeight: 700,
                  transition,
                  transform: active ? 'translateX(220px)' : 'translateX(0)',
                  background: active ? 'var(--color-success-300)' : 'var(--color-brand-300)',
                }}
              >
                box
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setActive((a) => !a)}>
                {active ? 'Reverse' : 'Play'}
              </Button>
              <Text variant="body-xs" color="muted">
                state: <code>{active ? 'is-active' : 'idle'}</code>
              </Text>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <label className="grid gap-1.5">
              <Text variant="body-xs" fontFamily="mono" color="secondary">
                transition-property
              </Text>
              <select
                value={property}
                onChange={(e) => setProperty(e.target.value as Property)}
                className="h-8 w-full cursor-pointer rounded-md border border-stroke bg-surface px-2 text-sm text-content-strong outline-none transition-colors focus:border-stroke-brand focus:ring-2 focus:ring-stroke-brand/20"
              >
                {PROPERTIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <SliderRow label="duration" value={duration} min={0} max={2000} step={50} suffix="ms" onChange={setDuration} />
            <label className="grid gap-1.5">
              <Text variant="body-xs" fontFamily="mono" color="secondary">
                timing-function
              </Text>
              <select
                value={timing}
                onChange={(e) => setTiming(e.target.value as Timing)}
                className="h-8 w-full cursor-pointer rounded-md border border-stroke bg-surface px-2 text-sm text-content-strong outline-none transition-colors focus:border-stroke-brand focus:ring-2 focus:ring-stroke-brand/20"
              >
                {TIMINGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <SliderRow label="delay" value={delay} min={0} max={1000} step={50} suffix="ms" onChange={setDelay} />
            <Text variant="body-xs" color="muted">
              With <code>transform</code> selected, only motion eases — the colour jumps.
              <code>all</code> transitions every animatable property.
            </Text>
          </div>

          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>Easing at a glance</SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['ease', 'Default — quick start, gentle stop. Good for most UI.'],
            ['linear', 'Constant speed. Best for spinners / progress, not movement.'],
            ['ease-in', 'Slow start. Use for elements leaving the screen.'],
            ['ease-out', 'Slow stop. Use for elements entering the screen.'],
            ['ease-in-out', 'Slow start and stop. Smooth A↔B toggles.'],
            ['cubic-bezier(…)', 'Custom curve — overshoot past 1 for a springy feel.'],
          ].map(([name, body]) => (
            <div key={name} className="flex flex-col gap-1 rounded-xl border border-stroke bg-surface-elevated p-4">
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {name}
              </Text>
              <Text variant="body-xs" color="secondary">
                {body}
              </Text>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          A transition only fires when the property actually changes (via a class, <code>:hover</code>,
          or inline style). For looping or multi-step motion, reach for{' '}
          <code>@keyframes</code> animations instead.
        </Text>
      </section>
    </div>
  )
}
