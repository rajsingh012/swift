import { useMemo, useState, type CSSProperties } from 'react'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive blend-modes lesson. A coloured shape overlaps a gradient
 * backdrop; the chosen `mix-blend-mode` is applied for real, so you see
 * exactly how the layers composite.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const MODES = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'difference',
  'hue',
  'luminosity',
] as const
type Mode = (typeof MODES)[number]

const NOTES: Partial<Record<Mode, string>> = {
  multiply: 'Darkens — like stacked ink. White vanishes, black stays.',
  screen: 'Lightens — like projected light. Black vanishes, white stays.',
  overlay: 'Multiply in shadows, screen in highlights — boosts contrast.',
  difference: 'Subtracts colours — great for inverting against a backdrop.',
  luminosity: 'Keeps the backdrop’s colour, takes the layer’s brightness.',
}

export function BlendModesPanel() {
  const [mode, setMode] = useState<Mode>('multiply')
  const css = useMemo(() => `.overlay {\n  mix-blend-mode: ${mode};\n}`, [mode])

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Blend modes
        </Text>
        <Text variant="para-lg" color="secondary">
          A blend mode controls how an element&rsquo;s colours composite with what&rsquo;s behind
          it — the same maths as Photoshop layers. <code>mix-blend-mode</code> blends an element
          with its backdrop; <code>background-blend-mode</code> blends an element&rsquo;s own
          background layers. Cycle through the modes below.
        </Text>
      </header>

      <section>
        <SectionHeader>Playground · shape over a gradient</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-72 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{
                position: 'relative',
                width: 280,
                height: 180,
                borderRadius: 14,
                overflow: 'hidden',
                background:
                  'linear-gradient(115deg, #f59e0b, #ef4444 40%, #8b5cf6 70%, #22c55e)',
              }}
            >
              {[
                { c: '#3b82f6', left: 40, top: 40 },
                { c: '#f43f5e', left: 130, top: 70 },
                { c: '#facc15', left: 90, top: 20 },
              ].map((b, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: b.left,
                    top: b.top,
                    width: 96,
                    height: 96,
                    borderRadius: '50%',
                    background: b.c,
                    mixBlendMode: mode,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
              mix-blend-mode
            </Text>
            <div className="grid grid-cols-2 gap-1.5">
              {MODES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`cursor-pointer rounded-md px-2 py-1.5 font-mono text-xs transition-colors ${
                    m === mode
                      ? 'bg-surface-brand-muted font-semibold text-content-brand'
                      : 'bg-surface-muted text-content-secondary hover:bg-surface-subtle'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <Text variant="body-xs" color="secondary">
              {NOTES[mode] ?? 'Composites the overlapping colours with the backdrop.'}
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>multiply</code> is the workhorse — it lets a logo or texture sit on a photo while
          keeping the shadows. <code>isolation: isolate</code> on a parent stops a blend from
          reaching further-back layers.
        </Text>
      </section>
    </div>
  )
}
