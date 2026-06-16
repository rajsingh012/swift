import { useMemo, useState, type CSSProperties } from 'react'
import { Button } from '@swift/components/Button'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive @keyframes lesson. The keyframes live in an injected
 * <style> (inline styles can't declare them); every other control feeds a
 * real `animation` shorthand on the box, so duration, iteration,
 * direction, easing, and play-state all behave exactly as the browser
 * runs them.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const KEYFRAMES = `
@keyframes swift-pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.3) } }
@keyframes swift-bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-34px) } }
@keyframes swift-spin { to { transform: rotate(360deg) } }
@keyframes swift-shake { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-9px) } 75% { transform: translateX(9px) } }
@keyframes swift-slide { from { transform: translateX(-70px); opacity: .35 } to { transform: translateX(70px); opacity: 1 } }
`

const PRESETS = ['pulse', 'bounce', 'spin', 'shake', 'slide'] as const
type Preset = (typeof PRESETS)[number]

const TIMINGS = ['ease', 'linear', 'ease-in', 'ease-out', 'ease-in-out'] as const
type Timing = (typeof TIMINGS)[number]

const ITERATIONS = ['1', '2', '3', 'infinite'] as const
type Iteration = (typeof ITERATIONS)[number]

const DIRECTIONS = ['normal', 'reverse', 'alternate', 'alternate-reverse'] as const
type Direction = (typeof DIRECTIONS)[number]

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

const DESCRIPTION =
  'A CSS animation runs a named set of `@keyframes` over time — looping, reversing, and easing on its own (unlike a transition, which only fires on a state change). Define the steps once, then drive playback with the `animation-*` longhands. Tweak everything below and watch it run live.'

export function AnimationsPanel() {
  const [preset, setPreset] = useState<Preset>('pulse')
  const [duration, setDuration] = useState(1000)
  const [timing, setTiming] = useState<Timing>('ease-in-out')
  const [iteration, setIteration] = useState<Iteration>('infinite')
  const [direction, setDirection] = useState<Direction>('alternate')
  const [paused, setPaused] = useState(false)

  const css = useMemo(
    () =>
      `@keyframes ${preset} { /* … */ }

.box {
  animation: ${preset} ${duration}ms ${timing} ${iteration} ${direction};
  animation-play-state: ${paused ? 'paused' : 'running'};
}`,
    [preset, duration, timing, iteration, direction, paused],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      {/* Keyframes are global; defining them here keeps the panel self-contained. */}
      <style>{KEYFRAMES}</style>

      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Animations &amp; keyframes
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-72 items-center justify-center overflow-hidden bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              key={`${preset}-${duration}-${timing}-${iteration}-${direction}`}
              style={{
                width: 72,
                height: 72,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--color-brand-300)',
                border: '1px solid var(--color-brand-500)',
                color: 'var(--color-neutral-800)',
                fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                fontSize: 12,
                fontWeight: 700,
                animationName: `swift-${preset}`,
                animationDuration: `${duration}ms`,
                animationTimingFunction: timing,
                animationIterationCount: iteration === 'infinite' ? 'infinite' : Number(iteration),
                animationDirection: direction,
                animationFillMode: 'both',
                animationPlayState: paused ? 'paused' : 'running',
              }}
            >
              box
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="flex items-center justify-between">
              <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
                animation
              </Text>
              <Button size="sm" variant="secondary" onClick={() => setPaused((p) => !p)}>
                {paused ? 'Play' : 'Pause'}
              </Button>
            </div>
            <div className="grid gap-1.5">
              <Text variant="body-xs" fontFamily="mono" color="secondary">
                keyframes
              </Text>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPreset(p)}
                    className={`cursor-pointer rounded-md px-2 py-1 font-mono text-xs transition-colors ${
                      p === preset
                        ? 'bg-surface-brand-muted font-semibold text-content-brand'
                        : 'bg-surface-muted text-content-secondary hover:bg-surface-subtle'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-1.5">
              <div className="flex items-baseline justify-between">
                <Text variant="body-xs" fontFamily="mono" color="secondary">
                  duration
                </Text>
                <Text variant="body-xs" fontFamily="mono" color="primary">
                  {duration}ms
                </Text>
              </div>
              <Slider value={[duration]} min={200} max={3000} step={100} onValueChange={([v]) => setDuration(v)} aria-label="duration" />
            </div>
            <Select label="timing-function" value={timing} options={TIMINGS} onChange={setTiming} />
            <Select label="iteration-count" value={iteration} options={ITERATIONS} onChange={setIteration} />
            <Select label="direction" value={direction} options={DIRECTIONS} onChange={setDirection} />
          </div>

          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>Transition vs animation</SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['transition', 'Animates between two states, triggered by a change (class, :hover, inline style). One way, no looping.'],
            ['animation', 'Runs a @keyframes timeline on its own — multi-step, can loop forever, reverse, and pause. No trigger needed.'],
          ].map(([t, b]) => (
            <div key={t} className="flex flex-col gap-1 rounded-xl border border-stroke bg-surface-elevated p-5">
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {t}
              </Text>
              <Text variant="body-xs" color="secondary">
                {b}
              </Text>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Respect <code>@media (prefers-reduced-motion: reduce)</code> — gate non-essential
          looping animations so they don&rsquo;t play for users who opt out.
        </Text>
      </section>
    </div>
  )
}
