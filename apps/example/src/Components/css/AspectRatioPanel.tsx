import { useState, type CSSProperties } from 'react'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive aspect-ratio + object-fit lesson. The ratio box uses a real
 * `aspect-ratio`, so its height derives from its width; the object-fit
 * demo drops a real image into a fixed frame and applies each fit mode.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const RATIOS = ['1 / 1', '4 / 3', '3 / 2', '16 / 9', '21 / 9'] as const
type Ratio = (typeof RATIOS)[number]

const FITS = ['fill', 'contain', 'cover', 'none', 'scale-down'] as const
type Fit = (typeof FITS)[number]

const SAMPLE_IMG = 'https://picsum.photos/id/1015/400/300'

function ratioValue(r: Ratio): number {
  const [a, b] = r.split('/').map((n) => Number(n.trim()))
  return a / b
}

export function AspectRatioPanel() {
  const [ratio, setRatio] = useState<Ratio>('16 / 9')
  const [width, setWidth] = useState(280)
  const height = Math.round(width / ratioValue(ratio))

  const [fit, setFit] = useState<Fit>('cover')

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Aspect ratio &amp; object-fit
        </Text>
        <Text variant="para-lg" color="secondary">
          <code>aspect-ratio</code> locks a box&rsquo;s width-to-height so it scales without
          reserving a fixed height (no more padding-top hacks). <code>object-fit</code> decides
          how a replaced element — an <code>img</code> or <code>video</code> — fills its box
          when the proportions don&rsquo;t match.
        </Text>
      </header>

      {/* ── aspect-ratio ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>aspect-ratio</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-64 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{
                width,
                maxWidth: '100%',
                aspectRatio: ratio.replace(/\s/g, ''),
                borderRadius: 12,
                background: 'linear-gradient(135deg, var(--color-brand-300), var(--color-brand-500))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                fontWeight: 700,
              }}
            >
              {ratio}
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="grid gap-1.5">
              <Text variant="body-xs" fontFamily="mono" color="secondary">
                aspect-ratio
              </Text>
              <div className="flex flex-wrap gap-1.5">
                {RATIOS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRatio(r)}
                    className={`cursor-pointer rounded-md px-2 py-1 font-mono text-xs transition-colors ${
                      r === ratio
                        ? 'bg-surface-brand-muted font-semibold text-content-brand'
                        : 'bg-surface-muted text-content-secondary hover:bg-surface-subtle'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-1.5">
              <div className="flex items-baseline justify-between">
                <Text variant="body-xs" fontFamily="mono" color="secondary">
                  width
                </Text>
                <Text variant="body-xs" fontFamily="mono" color="primary">
                  {width}px → {height}px tall
                </Text>
              </div>
              <Slider value={[width]} min={120} max={420} step={4} onValueChange={([v]) => setWidth(v)} aria-label="width" />
            </div>
            <Text variant="body-xs" color="muted">
              Set only the width — the height follows the ratio automatically, at any size.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={`.box {\n  width: ${width}px;\n  aspect-ratio: ${ratio};\n}`} />
          </div>
        </div>
      </section>

      {/* ── object-fit ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader>object-fit · same image, fixed frame</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-64 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{
                width: 240,
                height: 150,
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid var(--color-stroke-strong)',
                background:
                  'repeating-conic-gradient(var(--color-surface-subtle) 0% 25%, var(--color-surface-muted) 0% 50%) 0 / 20px 20px',
              }}
            >
              <img
                src={SAMPLE_IMG}
                alt="Sample landscape"
                width={240}
                height={150}
                style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
              object-fit
            </Text>
            <div className="grid grid-cols-2 gap-1.5">
              {FITS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFit(f)}
                  className={`cursor-pointer rounded-md px-2 py-1.5 font-mono text-xs transition-colors ${
                    f === fit
                      ? 'bg-surface-brand-muted font-semibold text-content-brand'
                      : 'bg-surface-muted text-content-secondary hover:bg-surface-subtle'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <Text variant="body-xs" color="secondary">
              {fit === 'cover'
                ? 'Fills the frame, cropping the overflow — the everyday choice for thumbnails.'
                : fit === 'contain'
                  ? 'Fits the whole image inside, letter-boxing the gaps (the checkerboard).'
                  : fit === 'fill'
                    ? 'Stretches to fill — distorts when ratios differ (the default).'
                    : fit === 'none'
                      ? 'No resize — shows the image at natural size, cropped by the frame.'
                      : 'Like contain, but never scales up past the natural size.'}
            </Text>
            <Text variant="body-xs" color="muted">
              Pair with <code>object-position</code> (e.g. <code>top</code>) to choose which part
              stays visible when cropped.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={`img {\n  width: 240px;\n  height: 150px;\n  object-fit: ${fit};\n}`} />
          </div>
        </div>
      </section>
    </div>
  )
}
