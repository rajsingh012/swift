import { useMemo, useState, type CSSProperties } from 'react'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive mask-image lesson. A real `mask-image` (alpha gradient) is
 * applied to the box — wherever the mask is transparent the box is hidden,
 * revealing the dotted stage behind it. Unlike clip-path's hard edge, a
 * gradient mask fades softly.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

type Preset = 'fade right' | 'fade bottom' | 'spotlight' | 'stripes'
const PRESETS: ReadonlyArray<Preset> = ['fade right', 'fade bottom', 'spotlight', 'stripes']

function maskFor(preset: Preset, stop: number): string {
  switch (preset) {
    case 'fade right':
      return `linear-gradient(to right, black ${stop}%, transparent)`
    case 'fade bottom':
      return `linear-gradient(to bottom, black ${stop}%, transparent)`
    case 'spotlight':
      return `radial-gradient(circle, black ${stop}%, transparent ${Math.min(100, stop + 25)}%)`
    case 'stripes':
      return 'repeating-linear-gradient(45deg, black 0 12px, transparent 12px 22px)'
  }
}

export function MaskingPanel() {
  const [preset, setPreset] = useState<Preset>('fade right')
  const [stop, setStop] = useState(30)
  const usesStop = preset !== 'stripes'
  const mask = maskFor(preset, stop)

  const css = useMemo(
    () =>
      `.box {
  -webkit-mask-image: ${mask};
          mask-image: ${mask};
  mask-repeat: no-repeat;
}`,
    [mask],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Masking
        </Text>
        <Text variant="para-lg" color="secondary">
          A <code>mask-image</code> uses another image&rsquo;s alpha (or luminance) to decide which
          pixels of an element show: opaque areas of the mask keep the element, transparent areas
          hide it. Because the mask can be a gradient, edges fade <em>softly</em> — the key
          difference from <code>clip-path</code>&rsquo;s hard cut.
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-72 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{
                width: 280,
                height: 180,
                borderRadius: 14,
                background:
                  'linear-gradient(135deg, #f59e0b, #ef4444 45%, #8b5cf6 75%, #22c55e)',
                WebkitMaskImage: mask,
                maskImage: mask,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                fontWeight: 700,
                textShadow: '0 1px 4px rgba(0,0,0,.4)',
              }}
            >
              masked
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="grid gap-1.5">
              <Text variant="body-xs" fontFamily="mono" color="secondary">
                mask
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
                <Text variant="body-xs" fontFamily="mono" color={usesStop ? 'secondary' : 'muted'}>
                  solid stop {usesStop ? '' : '(n/a)'}
                </Text>
                <Text variant="body-xs" fontFamily="mono" color={usesStop ? 'primary' : 'muted'}>
                  {stop}%
                </Text>
              </div>
              <Slider value={[stop]} min={0} max={80} step={1} onValueChange={([v]) => setStop(v)} aria-label="solid stop" />
            </div>
            <Text variant="body-xs" color="muted">
              The dotted background shows through the masked-out (transparent) areas — nothing is
              actually deleted, just hidden.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Masks also take real images (PNG alpha, SVG) and can be layered, sized, and positioned
          just like backgrounds. The <code>-webkit-</code> prefix is still needed for broad
          support.
        </Text>
      </section>
    </div>
  )
}
